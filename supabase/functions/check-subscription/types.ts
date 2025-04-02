
export interface UserProfile {
  role: string;
  subscription_status: string;
  email: string | null;
}

export interface SubscriptionData {
  subscription_status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
}

export interface SubscriptionResponse {
  subscription: string;
  isActive: boolean;
  inTrial: boolean;
  expiresAt: string | null;
  willCancel: boolean;
  isAdmin: boolean;
  role?: string;
  adminAssigned?: boolean;
  adminAssignedStatus?: string | null;
  error?: string;
}

export interface AuthResult {
  user: any;
  error: Error | null;
}

export const ADMIN_EMAILS = ["dylanmohseni0@gmail.com"];
