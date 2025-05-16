
export type EnterpriseAuthType = 'saml' | 'ldap' | 'oauth2' | 'oidc' | 'ad';
export type MFAType = 'totp' | 'sms' | 'email' | 'push';

export interface EnterpriseAuthConfiguration {
  id: string;
  organization_id: string;
  auth_type: EnterpriseAuthType;
  provider_name: string;
  configuration: Record<string, any>;
  metadata?: Record<string, any> | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MFAConfiguration {
  id: string;
  user_id: string;
  mfa_type: MFAType;
  is_enabled: boolean;
  secret_key?: string | null;
  backup_codes?: string[] | null;
  last_used_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SSOSession {
  id: string;
  user_id: string;
  provider: string;
  external_id: string;
  auth_token?: string | null;
  expires_at: string;
  created_at: string;
  last_used_at: string;
}

export interface SSOUser {
  email: string;
  name: string;
  external_id: string;
  attributes: Record<string, any>;
}

export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  role?: 'user' | 'admin' | 'sync' | 'pro' | 'template_buyer' | null;
  subscription_tier?: string | null;
  subscription_status?: string | null;
  is_subscribed?: boolean;
  company_name?: string | null;
  website?: string | null;
  social_links?: Record<string, string> | null;
  preferences?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}
