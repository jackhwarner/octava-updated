
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthAndProfile } from '@/hooks/useAuthAndProfile';

/**
 * Wraps protected routes: shows loading until auth/profile loaded; redirects if not complete.
 */
interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  console.log('AuthWrapper rendering');
  
  const { user, loading, profileComplete } = useAuthAndProfile();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('AuthWrapper state:', { 
    user: !!user, 
    loading, 
    profileComplete, 
    pathname: location.pathname 
  });

  // Temporarily bypass complex logic for profile setup page to debug
  if (location.pathname === '/profile-setup') {
    console.log('AuthWrapper: On profile setup page, rendering children directly for debugging');
    return <>{children}</>;
  }

  React.useEffect(() => {
    if (loading) {
      console.log('AuthWrapper: Still loading auth state');
      return;
    }

    const onProfileSetupPage = location.pathname === '/profile-setup';
    console.log('AuthWrapper: Processing auth state', {
      hasUser: !!user,
      profileComplete,
      onProfileSetupPage,
      pathname: location.pathname
    });

    // Not authenticated: redirect to login
    if (!user) {
      console.log('AuthWrapper: No user, redirecting to login');
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // Authenticated, but NOT completed profile: must be on /profile-setup
    if (!profileComplete && !onProfileSetupPage) {
      console.log('AuthWrapper: Profile not complete, redirecting to profile setup');
      navigate('/profile-setup', { replace: true });
      return;
    }

    // Profile completed but user is at /profile-setup: redirect to dashboard
    if (profileComplete && onProfileSetupPage) {
      console.log('AuthWrapper: Profile complete, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, profileComplete, location.pathname, location, navigate]);

  if (loading) {
    console.log('AuthWrapper: Showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // We already redirected above if not authenticated/profile not complete.
  if (!user && location.pathname !== '/profile-setup') {
    console.log('AuthWrapper: No user after loading, showing null');
    return null;
  }

  // For other pages, require profile to be complete
  if (!profileComplete && location.pathname !== '/profile-setup') {
    console.log('AuthWrapper: Profile not complete for protected route, showing null');
    return null;
  }

  console.log('AuthWrapper: All checks passed, rendering children');
  return <>{children}</>;
};

export default AuthWrapper;
