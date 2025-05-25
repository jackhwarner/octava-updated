
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

      // Fetch projects stats
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, status')
        .or(`owner_id.eq.${user.id},project_collaborators.user_id.eq.${user.id}`);

      if (projectsError) throw projectsError;

      // Fetch collaborations stats
      const { data: collaborations, error: collaborationsError } = await supabase
        .from('project_collaborators')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (collaborationsError) throw collaborationsError;

      // Fetch upcoming sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id')
        .or(`created_by.eq.${user.id},session_attendees.user_id.eq.${user.id}`)
        .gte('start_time', new Date().toISOString());

      if (sessionsError) throw sessionsError;

      // Fetch messages stats
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id, read_at')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (messagesError) throw messagesError;

      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const totalCollaborations = collaborations?.length || 0;
      const upcomingSessions = sessions?.length || 0;
      const totalMessages = messages?.length || 0;
      const unreadMessages = messages?.filter(m => !m.read_at && m.sender_id !== user.id).length || 0;

      setStats({
        totalProjects,
        activeProjects,
        totalCollaborations,
        upcomingSessions,
        totalMessages,
        unreadMessages,
      });
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
