
/**
 * Information about a user's subscription status
 */
export interface SubscriptionInfo {
  status: "free" | "basic" | "pro" | "template-buyer" | "trial";
  isActive: boolean;
  inTrial: boolean;
  expiresAt: string | null;
  willCancel: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}
