
/**
 * Subscription status types used throughout the application
 * @enum
 */
export type SubscriptionStatus = 
  | "free"       // No paid subscription
  | "sync"       // Basic tier
  | "sync-pro";  // Premium tier

/**
 * Billing cycle options for subscriptions
 * @enum
 */
export type BillingCycle = 
  | "monthly"   // Monthly billing cycle
  | "annual";   // Annual billing cycle (discounted)

/**
 * Complete subscription information object
 * Contains all details about a user's subscription
 */
export interface SubscriptionInfo {
  /** Current subscription tier */
  status: SubscriptionStatus;
  
  /** Whether the subscription is currently active */
  isActive: boolean;
  
  /** Whether the subscription is in trial period */
  inTrial: boolean;
  
  /** When the subscription expires (if applicable) */
  expiresAt: string | null;
  
  /** Whether the subscription is set to cancel at period end */
  willCancel: boolean;
  
  /** Whether the user has admin privileges */
  isAdmin: boolean;
  
  /** Whether the subscription is loading */
  isLoading: boolean;
  
  /** Whether subscription was assigned by an admin */
  adminAssigned?: boolean;
  
  /** The subscription status assigned by an admin */
  adminAssignedStatus?: SubscriptionStatus | null;
  
  /** Any error that occurred during subscription check */
  error?: string;
}

/**
 * Subscription plan metadata
 * Information about subscription plans for display purposes
 */
export interface SubscriptionPlanInfo {
  /** The plan's identifier */
  id: SubscriptionStatus;
  
  /** The display name of the plan */
  name: string;
  
  /** Monthly price in USD */
  monthlyPrice: number;
  
  /** Annual price in USD */
  annualPrice: number;
  
  /** Features included in this plan */
  features: string[];
  
  /** Whether this plan is recommended */
  isRecommended?: boolean;
}

/**
 * Response from the check-subscription edge function
 */
export interface SubscriptionResponse {
  /** Current subscription tier */
  subscription: SubscriptionStatus;
  
  /** Whether the subscription is currently active */
  isActive: boolean;
  
  /** Whether the subscription is in trial period */
  inTrial: boolean;
  
  /** When the subscription expires (if applicable) */
  expiresAt: string | null;
  
  /** Whether the subscription is set to cancel at period end */
  willCancel: boolean;
  
  /** Whether the user has admin privileges */
  isAdmin: boolean;
  
  /** Whether subscription was assigned by an admin */
  adminAssigned?: boolean;
  
  /** The subscription status assigned by an admin */
  adminAssignedStatus?: SubscriptionStatus | null;
  
  /** User's role in the system */
  role?: string;
  
  /** Any error that occurred during subscription check */
  error?: string;
}
