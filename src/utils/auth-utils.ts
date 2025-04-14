
export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
  subscription_status?: string | null;
  preferences?: Record<string, any>;
}

// Helper function to get redirect URL for authentication
export function getRedirectUrl(): string {
  return `${window.location.origin}/dashboard`;
}

// Helper function to get email confirmation redirect URL
export function getEmailConfirmationRedirectUrl(): string {
  return `${window.location.origin}/email-confirmation`;
}
