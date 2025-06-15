
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { isProfileSetupComplete } from '@/utils/isProfileSetupComplete';

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
      .select('id, name, username, bio, location, experience, profile_setup_completed')
      .eq('id', sessionUser.id)
      .maybeSingle();
    setProfileComplete(!!profile && isProfileSetupComplete(profile));
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    let unsub: any = null;

    async function checkAuthAndProfile(sessionUser: User | null) {
      if (cancelled) return;
      setUser(sessionUser);
      if (!sessionUser) {
        setProfileComplete(false);
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, name, username, bio, location, experience, profile_setup_completed')
        .eq('id', sessionUser.id)
        .maybeSingle();
      if (cancelled) return;
      setProfileComplete(!!profile && isProfileSetupComplete(profile));
      setLoading(false);
    }

    unsub = supabase.auth.onAuthStateChange((event, session) => {
      checkAuthAndProfile(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAuthAndProfile(session?.user ?? null);
    });

    return () => {
      if (unsub && typeof unsub.data?.subscription?.unsubscribe === 'function') {
        unsub.data.subscription.unsubscribe();
      }
      cancelled = true;
    };
  }, []);

  return { user, profileComplete, loading, reloadProfile };
}
