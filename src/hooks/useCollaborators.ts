
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Collaborator {
  id: string;
  name: string;
  username: string;
  role?: string;
  avatar_url?: string;
  experience?: string;
  genres?: string[];
  location?: string;
  completed_projects?: number;
  is_online?: boolean;
}

export const useCollaborators = () => {
  const [onlineCollaborators, setOnlineCollaborators] = useState<Collaborator[]>([]);
  const [suggestedCollaborators, setSuggestedCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCollaborators = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get profiles of users who are collaborators on projects with current user
      const { data: collaboratorProfiles, error: collabError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          username,
          role,
          avatar_url,
          experience,
          genres,
          location
        `)
        .neq('id', user.id)
        .eq('visibility', 'public')
        .limit(20);

      if (collabError) throw collabError;

      // For now, randomly assign some as "online" and add completed projects count
      const processedCollaborators = (collaboratorProfiles || []).map(profile => ({
        ...profile,
        name: profile.name || 'Unknown User',
        username: profile.username || '@unknown',
        is_online: Math.random() > 0.7,
        completed_projects: Math.floor(Math.random() * 50) + 5
      }));

      // Split into online and suggested
      const online = processedCollaborators.filter(c => c.is_online).slice(0, 3);
      const suggested = processedCollaborators.slice(0, 6);

      setOnlineCollaborators(online);
      setSuggestedCollaborators(suggested);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to load collaborators",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  return {
    onlineCollaborators,
    suggestedCollaborators,
    loading,
    refetch: fetchCollaborators
  };
};
