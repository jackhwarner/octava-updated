
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/hooks/useProfile';

export const usePublicProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (targetUserId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        const mappedProfile: Profile = {
          ...data,
          visibility: data.visibility === 'unlisted' ? 'connections_only' : data.visibility as 'public' | 'private' | 'connections_only'
        };
        setProfile(mappedProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      setLoading(false);
    }
  }, [userId]);

  return {
    profile,
    loading,
    refetch: () => userId ? fetchProfile(userId) : Promise.resolve()
  };
};
