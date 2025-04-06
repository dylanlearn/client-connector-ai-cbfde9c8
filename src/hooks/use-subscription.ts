import { useState, useEffect } from 'react';
import { fetchSubscriptionStatus, getCheckoutStatusFromUrl, cleanupCheckoutParams } from '@/utils/subscription-utils';
import { SubscriptionStatus, BillingCycle } from '@/types/subscription';
import { useAuth } from './use-auth';
import { createSubscriptionCheckout, cancelSubscription } from '@/utils/subscription-utils';
import { toast } from 'sonner';

export function useSubscription() {
  const { profile } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>('free');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [willCancel, setWillCancel] = useState(false);
  const [inTrial, setInTrial] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminFromProfile, setIsAdminFromProfile] = useState(false);
  const [adminAssignedStatus, setAdminAssignedStatus] = useState<SubscriptionStatus | null>(null);

  // Check subscription status on mount and when profile changes
  useEffect(() => {
    // Check URL for checkout status
    const checkoutStatus = getCheckoutStatusFromUrl();
    if (checkoutStatus) {
      // Clean up URL parameters
      cleanupCheckoutParams();
      
      if (checkoutStatus === 'success') {
        toast.success('Subscription activated successfully!');
        // Refresh subscription status after successful checkout
        refreshSubscription();
      } else if (checkoutStatus === 'canceled') {
        toast.info('Subscription checkout was canceled');
      }
    }
    
    // Set admin status based on profile
    if (profile) {
      setIsAdminFromProfile(profile.role === 'admin');
      setIsAdmin(profile.role === 'admin');

      // If user is not logged in or profile not loaded yet, keep loading
      refreshSubscription();
    }
  }, [profile]);

  // Function to refresh subscription status from API
  const refreshSubscription = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      // If admin, use admin-assigned status or set to 'sync-pro'
      if (profile.role === 'admin') {
        setStatus('sync-pro');
        setIsActive(true);
        setExpiresAt('');
        setWillCancel(false);
        setInTrial(false);
        setIsLoading(false);
        return;
      }
      
      // For regular users, fetch from API
      const subscriptionData = await fetchSubscriptionStatus();
      
      if (subscriptionData) {
        setStatus(subscriptionData.status || 'free');
        setIsActive(subscriptionData.status !== 'free');
        setExpiresAt(subscriptionData.expires_at || '');
        setWillCancel(subscriptionData.cancel_at_period_end || false);
        setInTrial(subscriptionData.trial_end ? new Date(subscriptionData.trial_end) > new Date() : false);
      } else {
        // Fallback to profile data if API call fails
        setStatus((profile.subscription_status as SubscriptionStatus) || 'free');
        setIsActive(profile.subscription_status !== 'free');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      toast.error('Could not fetch subscription status');
      
      // Fallback to profile data
      setStatus((profile.subscription_status as SubscriptionStatus) || 'free');
      setIsActive(profile.subscription_status !== 'free');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start subscription
  const startSubscription = async (plan: 'sync' | 'sync-pro', billingCycle: BillingCycle = 'monthly') => {
    setIsLoading(true);
    try {
      const data = await createSubscriptionCheckout(plan, billingCycle, window.location.href);
      
      if (data && data.url) {
        // Redirect to checkout page
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error starting subscription:', error);
      toast.error('Could not start subscription');
      setIsLoading(false);
    }
  };

  // Function to cancel subscription
  const cancelCurrentSubscription = async () => {
    setIsLoading(true);
    try {
      const data = await cancelSubscription();
      
      if (data && data.success) {
        toast.success('Subscription will be canceled at the end of your billing period');
        await refreshSubscription();
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Could not cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    status,
    isActive,
    isLoading,
    expiresAt,
    willCancel,
    refreshSubscription,
    startSubscription,
    cancelSubscription: cancelCurrentSubscription,
    inTrial,
    isAdmin,
    isAdminFromProfile,
    adminAssignedStatus
  };
}
