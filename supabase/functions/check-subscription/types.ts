
export interface UserProfile {
  role?: string;
  subscription_status?: string;
  email?: string;
}

export interface SubscriptionData {
  subscription_status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface SubscriptionResponse {
  subscription: string;
  isActive: boolean;
  inTrial: boolean;
  expiresAt: string | null;
  willCancel: boolean;
  isAdmin: boolean;
  role: string;
  adminAssigned?: boolean;
  adminAssignedStatus?: string | null;
  error?: string;
}

// Admin email list - emails that should always have admin access
export const ADMIN_EMAILS = [
  'dylanmohseni0@gmail.com',
  'admin@example.com',
  // add other admin emails here
];
