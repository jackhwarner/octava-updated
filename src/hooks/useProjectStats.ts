
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectStats {
  totalFiles: number;
  totalTodos: number;
  completedTodos: number;
  teamSize: number;
  totalMessages: number;
}

export const useProjectStats = (projectId: string) => {
  const [stats, setStats] = useState<ProjectStats>({
    totalFiles: 0,
    totalTodos: 0,
    completedTodos: 0,
    teamSize: 0,
    totalMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const [filesResult, todosResult, collaboratorsResult, messagesResult] = await Promise.all([
        // Get file count
        supabase
          .from('project_files')
          .select('id', { count: 'exact' })
          .eq('project_id', projectId)
          .eq('is_pending_approval', false),

        // Get todo counts
        supabase
          .from('project_todos')
          .select('id, completed', { count: 'exact' })
          .eq('project_id', projectId),

        // Get collaborator count
        supabase
          .from('project_collaborators')
          .select('id', { count: 'exact' })
          .eq('project_id', projectId)
          .eq('status', 'accepted'),

        // Get message count
        supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('project_id', projectId)
      ]);

      const totalFiles = filesResult.count || 0;
      const totalTodos = todosResult.count || 0;
      const completedTodos = todosResult.data?.filter(t => t.completed).length || 0;
      const teamSize = (collaboratorsResult.count || 0) + 1; // +1 for owner
      const totalMessages = messagesResult.count || 0;

      setStats({
        totalFiles,
        totalTodos,
        completedTodos,
        teamSize,
        totalMessages
      });
    } catch (error) {
      console.error('Error fetching project stats:', error);
      toast({
        title: "Error",
        description: "Failed to load project statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchStats();
    }
  }, [projectId]);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
};
