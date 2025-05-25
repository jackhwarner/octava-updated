
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
      name: string;
      username: string;
    };
  }>;
}

interface Collaborator {
  id: string;
  name: string;
  username: string;
  role: string;
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
              name,
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

  const addSession = async (sessionData: {
    title: string;
    description?: string;
    type: 'recording' | 'meeting' | 'rehearsal' | 'mixing' | 'mastering' | 'writing' | 'other';
    location?: string;
    start_time: string;
    end_time: string;
    project_id?: string;
    collaborators?: Collaborator[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert([{
          title: sessionData.title,
          description: sessionData.description,
          type: sessionData.type,
          location: sessionData.location,
          start_time: sessionData.start_time,
          end_time: sessionData.end_time,
          created_by: user.id,
          project_id: sessionData.project_id
        }])
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Add collaborators as attendees if any
      if (sessionData.collaborators && sessionData.collaborators.length > 0) {
        const attendeeInserts = sessionData.collaborators.map(collaborator => ({
          session_id: session.id,
          user_id: collaborator.id,
          status: 'pending' as const
        }));

        const { error: attendeeError } = await supabase
          .from('session_attendees')
          .insert(attendeeInserts);

        if (attendeeError) throw attendeeError;
      }

      await fetchSessions(); // Refresh the list
      toast({
        title: "Success",
        description: "Session created successfully",
      });
      return session;
    } catch (error) {
      console.error('Error adding session:', error);
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive",
      });
      throw error;
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
    addSession,
    deleteSession,
    refetch: fetchSessions
  };
};
