
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

// Toggle this variable to enable/disable auto-redirect for non-subscribers
const REDIRECT_IF_NO_SUBSCRIPTION = true;

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAccess, loading } = useSubscription();

  useEffect(() => {
    // Don't redirect if still loading or if already on subscription page
    if (loading || location.pathname === '/subscription') {
      return;
    }

    // If no access, redirect to subscription page (only if variable is turned on)
    if (!hasAccess && REDIRECT_IF_NO_SUBSCRIPTION) {
      navigate('/subscription', { replace: true });
    }
  }, [hasAccess, loading, navigate, location.pathname]);

  // Show loading while checking subscription
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if user has access or is on subscription page
  if (hasAccess || location.pathname === '/subscription') {
    return <>{children}</>;
  }

  // Return null if no access and not on subscription page (redirect will happen)
  return null;
};

export default SubscriptionGuard;

