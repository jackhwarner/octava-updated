
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Helper to check if profile is completed (you can adjust if needed)
const isProfileSetupComplete = (profile: any) => {
  if (profile?.profile_setup_completed === true) return true;
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
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
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

      // -- FIX: Make sure select string is correct, no ":1" --
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, username, bio, location, experience, profile_setup_completed')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (cancelled) return;

      const completed = !!profile && (
        profile.profile_setup_completed === true ||
        (
          !!profile?.name &&
          !!profile?.username &&
          !!profile?.bio &&
          !!profile?.location &&
          !!profile?.experience
        )
      );

      setProfileComplete(completed);
      setLoading(false);

      // If user is not on /profile-setup and profile not completed, redirect
      const onProfileSetupPage = location.pathname === '/profile-setup';
      if (!onProfileSetupPage && !completed) {
        navigate('/profile-setup', { replace: true });
      }
      // If user is on /profile-setup BUT they've just completed it, redirect to dashboard
      if (onProfileSetupPage && completed) {
        navigate('/dashboard', { replace: true });
      }
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
    // eslint-disable-next-line
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Only render children if authenticated AND profile is completed
  if (!user || !profileComplete) {
    // We already redirected above, nothing to render here
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
