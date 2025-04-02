
/**
 * Information about a user's subscription status
 */
export interface SubscriptionInfo {
  status: SubscriptionStatus;
  isActive: boolean;
  inTrial: boolean;
  expiresAt: string | null;
  willCancel: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  adminAssigned?: boolean;
  adminAssignedStatus?: SubscriptionStatus | null;
  error?: string;
}

/**
 * Subscription billing cycle options
 */
export type BillingCycle = "monthly" | "annual";

/**
 * Subscription status types
 */
export type SubscriptionStatus = "free" | "basic" | "pro" | "template-buyer" | "trial";
