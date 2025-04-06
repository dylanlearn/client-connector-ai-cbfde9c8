
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useAdminStatus } from './use-admin-status';

export type SubscriptionStatus = 'free' | 'sync' | 'sync-pro' | 'enterprise';

export function useSubscription() {
  const { user, profile } = useAuth();
  const { isAdmin } = useAdminStatus();
  const [status, setStatus] = useState<SubscriptionStatus>('free');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [willCancel, setWillCancel] = useState<boolean>(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      console.info("[Subscription] check_started", {
        timestamp: new Date().toISOString(),
        userId: user.id
      });

      // If user is admin, they automatically get access to all features
      if (isAdmin) {
        console.info("[Subscription] admin_detected", {
          timestamp: new Date().toISOString(),
          userId: user.id
        });
        
        setStatus('sync-pro');
        setIsActive(true);
        setIsLoading(false);
        return;
      }

      try {
        // Fetch subscription info from API or database
        // This is a mock implementation - replace with actual API call
        const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected for new users
          console.error('Error fetching subscription:', error);
          setIsLoading(false);
          return;
        }

        // Mock subscription data for development
        const subscription = data || {
          status: profile?.subscription_status || 'free',
          is_active: true,
          expires_at: null,
          will_cancel: false
        };

        console.info("[Subscription] status_received", {
          timestamp: new Date().toISOString(),
          userId: user.id,
          status: subscription.status,
          isActive: subscription.is_active,
          adminAssigned: false
        });

        setStatus(subscription.status as SubscriptionStatus);
        setIsActive(subscription.is_active);
        setExpiresAt(subscription.expires_at);
        setWillCancel(subscription.will_cancel);
      } catch (error) {
        console.error('Subscription check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [user, profile, isAdmin]);

  // Debug logging for subscription state
  useEffect(() => {
    console.info("Subscription hook state:", {
      "profile.role": profile?.role,
      "profile.subscription_status": profile?.subscription_status,
      "isAdminRole from useAdminStatus": isAdmin,
      "admin from subscriptionInfo": isAdmin,
      "adminAssigned from subscriptionInfo": false,
      "adminAssignedStatus from subscriptionInfo": null,
      "hasAdminRole": profile?.role === 'admin',
      "hasAssignedSyncProAccess": profile?.role === 'admin',
      "hasAssignedSyncAccess": false,
      "subscription status": status,
      "is subscription active": isActive
    });

    // Log subscriber status to console
    if (!isLoading) {
      console.info("Subscription status response:", {
        subscription: status,
        isActive,
        inTrial: false,
        expiresAt,
        willCancel,
        isAdmin,
        role: profile?.role
      });
    }
  }, [status, isActive, isLoading, expiresAt, willCancel, profile, isAdmin]);

  return {
    status,
    isActive,
    isLoading,
    expiresAt,
    willCancel
  };
}
