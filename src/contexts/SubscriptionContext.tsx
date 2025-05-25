
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionState {
  subscribed: boolean;
  inTrial: boolean;
  hasAccess: boolean;
  subscription_tier: string | null;
  trial_end: string | null;
  subscription_end: string | null;
  loading: boolean;
}

interface SubscriptionContextType extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    subscribed: false,
    inTrial: false,
    hasAccess: false,
    subscription_tier: null,
    trial_end: null,
    subscription_end: null,
    loading: true,
  });

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSubscriptionState(prev => ({ ...prev, loading: false }));
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      setSubscriptionState({
        ...data,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionState(prev => ({ ...prev, loading: false }));
    }
  };

  const refreshSubscription = async () => {
    setSubscriptionState(prev => ({ ...prev, loading: true }));
    await checkSubscription();
  };

  useEffect(() => {
    checkSubscription();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkSubscription();
      } else if (event === 'SIGNED_OUT') {
        setSubscriptionState({
          subscribed: false,
          inTrial: false,
          hasAccess: false,
          subscription_tier: null,
          trial_end: null,
          subscription_end: null,
          loading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SubscriptionContext.Provider 
      value={{
        ...subscriptionState,
        checkSubscription,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
