
export type SubscriptionStatus = "free" | "basic" | "pro";
export type BillingCycle = "monthly" | "annual";

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  isActive: boolean;
  inTrial: boolean;
  expiresAt: string | null;
  willCancel: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}
