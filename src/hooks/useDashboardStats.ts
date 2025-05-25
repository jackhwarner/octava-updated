
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalCollaborations: number;
  upcomingSessions: number;
  totalMessages: number;
  unreadMessages: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalCollaborations: 0,
    upcomingSessions: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch projects stats - fix the OR syntax
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, status')
        .or(`owner_id.eq.${user.id},project_collaborators.user_id.eq.${user.id}`);

      if (projectsError) {
        console.error('Projects error:', projectsError);
        // For now, just get projects owned by user
        const { data: ownedProjects } = await supabase
          .from('projects')
          .select('id, status')
          .eq('owner_id', user.id);
        
        const totalProjects = ownedProjects?.length || 0;
        const activeProjects = ownedProjects?.filter(p => p.status === 'active').length || 0;
        
        setStats(prev => ({
          ...prev,
          totalProjects,
          activeProjects,
        }));
      } else {
        const totalProjects = projects?.length || 0;
        const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
        
        setStats(prev => ({
          ...prev,
          totalProjects,
          activeProjects,
        }));
      }

      // Fetch collaborations stats
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

      // Fetch upcoming sessions - fix the OR syntax
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id')
        .eq('created_by', user.id)
        .gte('start_time', new Date().toISOString());

      if (!sessionsError) {
        const upcomingSessions = sessions?.length || 0;
        setStats(prev => ({
          ...prev,
          upcomingSessions,
        }));
      }

      // Fetch messages stats
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
      console.error('Error fetching dashboard stats:', error);
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
