
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserProfile = async (userId: string) => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        // Check if profile is incomplete (missing required fields)
        if (!profile || !profile.full_name || !profile.username || !profile.bio || !profile.location || !profile.experience) {
          navigate('/profile-setup');
          return;
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        navigate('/profile-setup');
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        checkUserProfile(session.user.id);
      } else {
        const currentPath = location.pathname;
        navigate(`/login?from=${encodeURIComponent(currentPath)}`);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          checkUserProfile(session.user.id);
        } else {
          const currentPath = location.pathname;
          navigate(`/login?from=${encodeURIComponent(currentPath)}`);
        }
      }
    );

    return () => subscription.unsubscribe();
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
