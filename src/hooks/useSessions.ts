
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Session {
  id: string;
  title: string;
  description?: string;
  type: 'recording' | 'meeting' | 'rehearsal' | 'mixing' | 'mastering' | 'writing' | 'other';
  location?: string;
  start_time: string;
  end_time: string;
  created_by: string;
  project_id?: string;
  attendees?: Array<{
    user_id: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    profiles: {
      full_name: string;
      username: string;
    };
  }>;
}

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          session_attendees (
            user_id,
            status,
            profiles (
              full_name,
              username
            )
          )
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSessions(prev => prev.filter(session => session.id !== id));
      toast({
        title: "Success",
        description: "Session deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    loading,
    deleteSession,
    refetch: fetchSessions
  };
};
