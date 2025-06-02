import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/project'; // Import Project type if needed for clarity

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalCollaborations: number;
  totalMessages: number;
  unreadMessages: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalCollaborations: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch projects owned by the user
      const { data: ownedProjects, error: ownedProjectsError } = await supabase
        .from('projects')
        .select('id, status')
        .eq('owner_id', user.id);

      if (ownedProjectsError) throw ownedProjectsError;

      // Fetch projects where the user is a collaborator
      const { data: collaboratedProjectsData, error: collaboratedProjectsError } = await supabase
        .from('project_collaborators')
        .select('project_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (collaboratedProjectsError) {
         console.error('Error fetching collaborated project IDs:', collaboratedProjectsError);
         // Handle error or throw
      }

      // Get the full project data for collaborated projects
      let collaboratedProjects: Pick<Project, 'id' | 'status'>[] = [];
      if (collaboratedProjectsData && collaboratedProjectsData.length > 0) {
          const projectIds = collaboratedProjectsData.map(c => c.project_id);
          const { data: fullCollaboratedProjects, error: fullCollaboratedProjectsError } = await supabase
            .from('projects')
            .select('id, status')
            .in('id', projectIds);
            
            if(fullCollaboratedProjectsError){
                console.error('Error fetching full collaborated projects:', fullCollaboratedProjectsError);
                // Handle error or throw
            } else {
                collaboratedProjects = fullCollaboratedProjects || [];
            }
      }

      // Combine unique projects
      const allProjectsMap = new Map<string, Pick<Project, 'id' | 'status'>>();

      ownedProjects?.forEach(p => allProjectsMap.set(p.id, p));
      collaboratedProjects?.forEach(p => allProjectsMap.set(p.id, p));

      const allProjects = Array.from(allProjectsMap.values());

      const totalProjects = allProjects.length;
      const activeProjects = allProjects.filter(p => p.status === 'active').length;

      setStats(prev => ({
        ...prev,
        totalProjects,
        activeProjects,
      }));

      // Fetch collaborations stats (already looks correct)
      const { data: collaborations, error: collaborationsError } = await supabase
        .from('project_collaborators')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (!collaborationsError) {
        const totalCollaborations = collaborations?.length || 0;
        setStats(prev => ({
          ...prev,
          totalCollaborations,
        }));
      }

      // Fetch messages stats (already looks correct)
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('id, read_at')
        .eq('sender_id', user.id);

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('id, read_at')
        .eq('recipient_id', user.id);

      if (!sentError && !receivedError) {
        const totalMessages = (sentMessages?.length || 0) + (receivedMessages?.length || 0);
        const unreadMessages = receivedMessages?.filter(m => !m.read_at).length || 0;
        
        setStats(prev => ({
          ...prev,
          totalMessages,
          unreadMessages,
        }));
      }

    } catch (error) {
      console.error('Projects error:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
};
