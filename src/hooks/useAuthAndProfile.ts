import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { isProfileSetupComplete } from '../utils/isProfileSetupComplete';

interface UseAuthAndProfileReturn {
  user: User | null;
  profileComplete: boolean;
  loading: boolean;
  reloadProfile: () => Promise<void>;
}

/**
 * Custom hook that manages authentication state and checks if profile is complete.
 */
export function useAuthAndProfile(): UseAuthAndProfileReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // reloadProfile can be called manually from components to re-fetch profile state
  const reloadProfile = async () => {
    console.log('useAuthAndProfile: Reloading profile');
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const sessionUser = session?.user ?? null;
    setUser(sessionUser);
    if (!sessionUser) {
      setProfileComplete(false);
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, username, bio, location, experience, profile_setup_completed, genres, skills, avatar_url, visibility')
      .eq('id', sessionUser.id)
      .maybeSingle();
    
    console.log('useAuthAndProfile: Profile data:', profile);
    const complete = !!profile && isProfileSetupComplete(profile);
    console.log('useAuthAndProfile: Profile complete:', complete);
    setProfileComplete(complete);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    let unsub: any = null;

    async function checkAuthAndProfile(sessionUser: User | null) {
      if (cancelled) return;
      console.log('useAuthAndProfile: Checking auth and profile for user:', !!sessionUser);
      setUser(sessionUser);
      if (!sessionUser) {
        setProfileComplete(false);
        setLoading(false);
        return;
      }
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, name, username, bio, location, experience, profile_setup_completed, genres, skills, avatar_url, visibility')
          .eq('id', sessionUser.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('useAuthAndProfile: Error fetching profile:', error);
        }
        
        if (cancelled) return;
        console.log('useAuthAndProfile: Profile fetched:', profile);
        const complete = !!profile && isProfileSetupComplete(profile);
        console.log('useAuthAndProfile: Profile complete check:', complete);
        setProfileComplete(complete);
      } catch (error) {
        console.error('useAuthAndProfile: Unexpected error:', error);
        if (!cancelled) {
          setProfileComplete(false);
        }
      }
      
      setLoading(false);
    }

    console.log('useAuthAndProfile: Setting up auth state listener');
    unsub = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('useAuthAndProfile: Auth state change:', event, !!session?.user);
      checkAuthAndProfile(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      console.log('useAuthAndProfile: Initial session check:', !!session?.user);
      checkAuthAndProfile(session?.user ?? null);
    });

    return () => {
      console.log('useAuthAndProfile: Cleaning up');
      if (unsub && typeof unsub.data?.subscription?.unsubscribe === 'function') {
        unsub.data.subscription.unsubscribe();
      }
      cancelled = true;
    };
  }, []);

  return { user, profileComplete, loading, reloadProfile };
}
