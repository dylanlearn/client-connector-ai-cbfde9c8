import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SubscriptionStatus } from "@/types/subscription";

/**
 * Type definition for user profile role
 */
export type UserRole = 'free' | 'sync-pro' | 'admin' | 'template-buyer' | 'sync' | 'pro';

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
  return "https://dezignsync.com/dashboard";
};

/**
 * Gets the email confirmation redirect URL
 */
export const getEmailConfirmationRedirectUrl = (): string => {
  return "https://dezignsync.com/login?confirmed=true";
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
 * Directly checks if a user is an admin via database query
 * Bypasses caching and provides a reliable check
 */
export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return data?.role === 'admin';
  } catch (error) {
    console.error("Error in checkAdminStatus:", error);
    return false;
  }
};

/**
 * Checks if a user has an active subscription or privileged role
 */
export const isUserActive = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  
  // Admin users are always considered active
  if (profile.role === 'admin') {
    console.log("User is admin, considering as active");
    return true;
  }
  
  // Check if the user has a paid subscription status
  const hasActivePlan = profile.subscription_status === 'sync' || 
                        profile.subscription_status === 'sync-pro';
  
  return hasActivePlan;
};

/**
 * Gets the appropriate post-login redirect based on user status
 */
export const getPostLoginRedirect = (profile: UserProfile | null, defaultPath: string = '/dashboard'): string => {
  console.log("getPostLoginRedirect called with profile:", profile, "and defaultPath:", defaultPath);
  
  // Direct admin check - always redirect admins to the dashboard regardless of subscription
  if (profile?.role === 'admin') {
    console.log("Admin user detected in getPostLoginRedirect, redirecting to dashboard");
    return '/dashboard'; // Always send admins to dashboard, not the requested path
  }
  
  // Check if user has active subscription
  if (isUserActive(profile)) {
    console.log("User has active subscription, redirecting to:", defaultPath);
    return defaultPath;
  }
  
  // Non-admin users without subscription go to pricing
  console.log("Non-subscribed user, redirecting to pricing page");
  return '/pricing?needSubscription=true';
};

/**
 * Validates the user's authentication state before proceeding with routing
 */
export const validateAuthState = (user: User | null, profile: UserProfile | null): boolean => {
  console.log("validateAuthState called with user:", user?.id, "and profile:", profile);
  
  if (!user) {
    console.log("No user found, auth state invalid");
    return false;
  }
  
  // No profile check for admins - they should always have access
  // This prevents admin lockout when profile loading fails
  
  console.log("Auth state valid, user is authenticated");
  return true;
};
