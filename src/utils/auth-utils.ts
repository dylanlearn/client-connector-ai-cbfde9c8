
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

/**
 * Type definition for user profile subscription status
 */
export type SubscriptionStatus = 'free' | 'basic' | 'pro' | 'template-buyer' | 'trial';

/**
 * Type definition for user profile role
 */
export type UserRole = 'free' | 'pro' | 'admin' | 'template-buyer';

/**
 * User profile type with subscription status and role
 */
export interface UserProfile {
  id: string;
  email?: string;
  subscription_status?: SubscriptionStatus;
  role?: UserRole;
  [key: string]: any; // For other potential profile fields
}

/**
 * Fetches a user's profile from the database
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    console.log("Profile data retrieved:", data);
    return data as UserProfile;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

/**
 * Gets the redirect URL for authentication
 */
export const getRedirectUrl = (): string => {
  return "https://client-connector-ai.lovable.app/dashboard";
};

/**
 * Gets the email confirmation redirect URL
 */
export const getEmailConfirmationRedirectUrl = (): string => {
  return "https://client-connector-ai.lovable.app/login?confirmed=true";
};

/**
 * Enables realtime updates for a database table
 */
export const enableRealtimeForTable = async (tableName: string): Promise<boolean> => {
  try {
    // Use channel-based approach for realtime updates
    const channel = supabase.channel(`realtime:${tableName}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: tableName 
      }, payload => {
        console.log('Change received!', payload);
      })
      .subscribe();
      
    console.log(`Realtime enabled for ${tableName}`);
    return true;
  } catch (error) {
    console.error(`Error enabling realtime for ${tableName}:`, error);
    return false;
  }
};

/**
 * Checks if a user has an active subscription or privileged role
 */
export const isUserActive = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  
  // Admin users are always considered active
  if (profile.role === 'admin') return true;
  
  // Check if the user has a paid subscription status
  const hasActivePlan = profile.subscription_status === 'basic' || 
                        profile.subscription_status === 'pro';
  
  return hasActivePlan;
};

/**
 * Gets the appropriate post-login redirect based on user status
 */
export const getPostLoginRedirect = (profile: UserProfile | null, defaultPath: string = '/dashboard'): string => {
  if (isUserActive(profile)) {
    return defaultPath;
  }
  
  return '/pricing?needSubscription=true';
};

/**
 * Validates the user's authentication state before proceeding with routing
 */
export const validateAuthState = (user: User | null, profile: UserProfile | null): boolean => {
  if (!user) return false;
  
  // Make sure we have a user profile
  if (!profile) return false;
  
  return true;
};
