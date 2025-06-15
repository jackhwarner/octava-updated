
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
  const { user, loading, profileComplete } = useAuthAndProfile();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (loading) return;
    const onProfileSetupPage = location.pathname === '/profile-setup';
    // Not authenticated: redirect to login
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }
    // Authenticated, but NOT completed profile: must be on /profile-setup
    if (!profileComplete && !onProfileSetupPage) {
      navigate('/profile-setup', { replace: true });
      return;
    }
    // Profile completed but user is at /profile-setup: redirect to dashboard
    if (profileComplete && onProfileSetupPage) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, profileComplete, location.pathname, location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  // We already redirected above if not authenticated/profile not complete.
  if (!user || !profileComplete) return null;
  return <>{children}</>;
};

export default AuthWrapper;
