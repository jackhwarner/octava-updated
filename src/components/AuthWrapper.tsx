
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Helper to check if profile is completed (you can adjust if needed)
const isProfileSetupComplete = (profile: any) => {
  // Accept true-ish or required fields
  if (profile?.profile_setup_completed === true) return true;
  // Fallback: check required fields
  return (
    !!profile?.name &&
    !!profile?.username &&
    !!profile?.bio &&
    !!profile?.location &&
    !!profile?.experience
  );
};

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    let unsub: any = null;

    async function checkAuthAndProfile(sessionUser: User | null) {
      setUser(sessionUser);
      if (!sessionUser) {
        setLoading(false);
        navigate('/login', { state: { from: location }, replace: true });
        return;
      }

      // Always fetch latest profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(
          'id, name, username, bio, location, experience, profile_setup_completed'
        )
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (cancelled) return;
      setLoading(false);

      // If user is not on /profile-setup and profile not completed, redirect
      const onProfileSetupPage = location.pathname === '/profile-setup';
      if (
        !onProfileSetupPage &&
        (!profile || !isProfileSetupComplete(profile))
      ) {
        // User must complete profile
        navigate('/profile-setup', { replace: true });
      }
      // Else, stay on page or render children
    }

    // Setup auth change subscription
    unsub = supabase.auth.onAuthStateChange((event, session) => {
      checkAuthAndProfile(session?.user ?? null);
    });

    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAuthAndProfile(session?.user ?? null);
    });

    return () => {
      if (unsub && typeof unsub.data?.subscription?.unsubscribe === 'function') {
        unsub.data.subscription.unsubscribe();
      }
      cancelled = true;
    };
    // eslint-disable-next-line
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default AuthWrapper;
