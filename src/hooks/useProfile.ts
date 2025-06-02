import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  name: string;
  username: string | null;
  role: string;
  genres: string[];
  location: string | null;
  experience: string;
  avatar_url: string | null;
  skills: string[];
  visibility: string;
  completed_projects?: number;
  instruments?: string[];
  email?: string;
  full_name?: string;
  bio?: string;
  zip_code?: string;
  hourly_rate?: number;
  profile_picture_url?: string;
  portfolio_urls?: string[];
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, this is okay for new users
          setProfile(null);
        } else {
          console.error('Error fetching profile:', error);
          throw error;
        }
      } else {
        // Map database visibility values to our interface
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

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Map our interface values to database values
      const dbUpdates = {
        ...updates,
        visibility: updates.visibility === 'connections_only' ? 'unlisted' : updates.visibility
      };

      // Create properly typed update object with required id
      const updateData: {
        id: string;
        avatar_url?: string;
        bio?: string;
        created_at?: string;
        email?: string;
        experience?: string;
        full_name?: string;
        genres?: string[];
        hourly_rate?: number;
        location?: string;
        name?: string;
        portfolio_urls?: string[];
        profile_picture_url?: string;
        role?: string;
        skills?: string[];
        updated_at?: string;
        username?: string;
        visibility?: 'public' | 'private' | 'unlisted';
        zip_code?: string;
      } = {
        id: user.id,
        ...Object.fromEntries(
          Object.entries(dbUpdates).filter(([_, value]) => value !== undefined)
        )
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updateData)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Map back for our interface
      const mappedProfile: Profile = {
        ...data,
        visibility: data.visibility === 'unlisted' ? 'connections_only' : data.visibility as 'public' | 'private' | 'connections_only'
      };
      setProfile(mappedProfile);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return mappedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  };
};
