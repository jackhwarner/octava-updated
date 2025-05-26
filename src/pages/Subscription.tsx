import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
const Subscription = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    subscribed: false,
    inTrial: false,
    hasAccess: false,
    subscription_tier: null,
    trial_end: null,
    subscription_end: null
  });
  useEffect(() => {
    checkSubscription();
  }, []);
  const checkSubscription = async () => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionStatus(data);

      // If user has access, redirect to dashboard
      if (data.hasAccess) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setCheckingSubscription(false);
    }
  };
  const handleSubscribe = async (plan: 'monthly' | 'annual') => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan
        }
      });
      if (error) throw error;

      // Open Stripe checkout in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleManageSubscription = async () => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive"
      });
    }
  };
  if (checkingSubscription) {
    return <div className="min-h-screen flex items-center justify-center mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription status...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen flex items-center justify-center py-12 mx-auto">
      <div className="max-w-4xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-6">
            Start your musical journey with a 14-day free trial
          </p>
          {subscriptionStatus.inTrial && <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Free trial active until {new Date(subscriptionStatus.trial_end).toLocaleDateString()}
              </span>
            </div>}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Monthly Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Monthly</span>
                {subscriptionStatus.subscription_tier === "Monthly" && <Badge className="bg-purple-600">Current Plan</Badge>}
              </CardTitle>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Unlimited project collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Cloud storage for your files</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Connect with musicians worldwide</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>14-day free trial</span>
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleSubscribe('monthly')} disabled={loading || subscriptionStatus.hasAccess}>
                {subscriptionStatus.subscription_tier === "Monthly" ? "Current Plan" : "Start Free Trial"}
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="relative border-purple-200 bg-purple-50">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm flex items-center">
              <Star className="w-4 h-4 inline mr-1" />
              Save 17%
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Annual</span>
                {subscriptionStatus.subscription_tier === "Annual" && <Badge className="bg-purple-600">Current Plan</Badge>}
              </CardTitle>
              <div className="mb-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-gray-600">Best value for serious creators</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Everything in Monthly</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>14-day free trial</span>
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleSubscribe('annual')} disabled={loading || subscriptionStatus.hasAccess}>
                {subscriptionStatus.subscription_tier === "Annual" ? "Current Plan" : "Start Free Trial"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Manage Subscription */}
        {subscriptionStatus.hasAccess && <div className="text-center">
            <Button variant="outline" onClick={handleManageSubscription} className="mb-4">
              Manage Subscription
            </Button>
            <p className="text-sm text-gray-600">
              Need to update your payment method or cancel? Use the subscription management portal.
            </p>
          </div>}

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">How does the free trial work?</h3>
              <p className="text-gray-600 text-sm">
                You get 14 days of full access to all features. No credit card required during trial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can cancel your subscription at any time through the customer portal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens after my trial ends?</h3>
              <p className="text-gray-600 text-sm">
                You'll be automatically subscribed to your chosen plan. Cancel before trial ends to avoid charges.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan anytime through the subscription management portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Subscription;