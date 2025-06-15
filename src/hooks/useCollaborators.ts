
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { rankCollaborators } from '@/utils/collaboratorMatching';

interface Collaborator {
  id: string;
  name: string;
  username: string | null;
  role: string;
  genres: string[];
  location: string | null;
  experience: string;
  avatar_url: string | null;
  skills: string[];
  is_online: boolean;
  visibility: string;
}

export const useCollaborators = () => {
  const [suggestedCollaborators, setSuggestedCollaborators] = useState<Collaborator[]>([]);
  const [onlineCollaborators, setOnlineCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useProfile();

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        // Get the current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting user:', userError);
          throw userError;
        }

        console.log('Current user:', user);

        if (!user) {
          console.log('No user found, returning empty collaborators list');
          setSuggestedCollaborators([]);
          setOnlineCollaborators([]);
          setLoading(false);
          return;
        }

        // Fetch public profiles of other users who could be potential collaborators
        // This excludes the current user and only gets profiles marked as public
        console.log('Fetching collaborators with user ID:', user.id);
        const { data: collaborators, error: collabError } = await supabase
          .from('profiles')
          .select('id, name, username, role, genres, location, experience, avatar_url, skills, visibility')
          .neq('id', user.id)
          .eq('visibility', 'public');

        if (collabError) {
          console.error('Error fetching collaborators:', {
            error: collabError,
            message: collabError.message,
            details: collabError.details,
            hint: collabError.hint
          });
          throw collabError;
        }

        console.log('Fetched collaborators:', collaborators);

        // Process the fetched profiles:
        // 1. Add default values for missing fields
        // 2. Randomly assign online status (for demo purposes)
        // 3. Map skills to instruments
        const processedCollaborators = collaborators.map(profile => ({
          ...profile,
          name: profile.name || 'Anonymous',
          username: profile.username || '@unknown',
          role: profile.role || 'Musician',
          genres: profile.genres || [],
          location: profile.location || 'Unknown',
          experience: profile.experience || 'Beginner',
          avatar_url: profile.avatar_url,
          skills: profile.skills || [],
          is_online: Math.random() > 0.5, // Random online status for demo
          visibility: profile.visibility || 'public'
        }));

        console.log('Processed collaborators:', processedCollaborators);

        // Rank collaborators based on user's profile
        const rankedCollaborators = rankCollaborators(processedCollaborators, profile);
        console.log('Ranked collaborators:', rankedCollaborators);

        // Set all ranked collaborators as suggested collaborators
        setSuggestedCollaborators(rankedCollaborators);
        
        // Set online collaborators (also ranked)
        setOnlineCollaborators(rankedCollaborators.filter(c => c.is_online));
      } catch (error) {
        console.error('Error in fetchCollaborators:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        toast({
          title: 'Error',
          description: 'Failed to fetch collaborators. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, [toast, profile]); // Added profile to dependencies so it re-ranks when profile changes

  return { suggestedCollaborators, onlineCollaborators, loading };
};
