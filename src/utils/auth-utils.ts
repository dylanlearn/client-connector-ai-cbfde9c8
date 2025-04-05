
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

// Cache for storing fetched profiles with TTL
const profileCache = new Map<string, {data: UserProfile, timestamp: number}>();
const CACHE_TTL = 60000; // 60 seconds cache TTL

/**
 * Fetches a user's profile from the database with caching
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Check cache first
    const cachedProfile = profileCache.get(userId);
    const now = Date.now();
    
    // Return cached profile if it exists and hasn't expired
    if (cachedProfile && (now - cachedProfile.timestamp) < CACHE_TTL) {
      console.log("Using cached profile for user:", userId);
      return cachedProfile.data;
    }
    
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
    
    // Store in cache
    profileCache.set(userId, {
      data: data as UserProfile,
      timestamp: now
    });
    
    return data as UserProfile;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

/**
 * Invalidates cached profile data for a user
 */
export const invalidateProfileCache = (userId: string): void => {
  profileCache.delete(userId);
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

// Cache for realtime channel subscriptions
const realtimeChannels = new Map<string, any>();

/**
 * Enables realtime updates for a database table
 */
export const enableRealtimeForTable = async (tableName: string): Promise<boolean> => {
  try {
    // Check if channel already exists
    if (realtimeChannels.has(tableName)) {
      console.log(`Realtime already enabled for ${tableName}`);
      return true;
    }
    
    // Use channel-based approach for realtime updates
    const channel = supabase.channel(`realtime:${tableName}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: tableName 
      }, payload => {
        console.log('Change received!', payload);
        
        // If it's a profile update, invalidate the cache for that user
        if (tableName === 'profiles' && payload.new && payload.new.id) {
          invalidateProfileCache(payload.new.id);
        }
      })
      .subscribe();
      
    // Store channel reference
    realtimeChannels.set(tableName, channel);
    
    console.log(`Realtime enabled for ${tableName}`);
    return true;
  } catch (error) {
    console.error(`Error enabling realtime for ${tableName}:`, error);
    return false;
  }
};

// Admin status cache
const adminStatusCache = new Map<string, {isAdmin: boolean, timestamp: number}>();
const ADMIN_CACHE_TTL = 300000; // 5 minutes

/**
 * Directly checks if a user is an admin via database query
 * Uses caching to reduce database calls
 */
export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Check cache first
    const cachedStatus = adminStatusCache.get(userId);
    const now = Date.now();
    
    if (cachedStatus && (now - cachedStatus.timestamp) < ADMIN_CACHE_TTL) {
      console.log("Using cached admin status for user:", userId);
      return cachedStatus.isAdmin;
    }
    
    console.log("Checking admin status from database for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    const isAdmin = data?.role === 'admin';
    
    // Store in cache
    adminStatusCache.set(userId, {
      isAdmin,
      timestamp: now
    });
    
    return isAdmin;
  } catch (error) {
    console.error("Error in checkAdminStatus:", error);
    return false;
  }
};

/**
 * Checks if a user has an active subscription or privileged role
 * Uses cached profile data when possible
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

// Cache for post-login redirects to prevent repeated calculations
const redirectCache = new Map<string, {redirect: string, timestamp: number}>();
const REDIRECT_CACHE_TTL = 60000; // 1 minute

/**
 * Gets the appropriate post-login redirect based on user status
 * with optimized caching
 */
export const getPostLoginRedirect = (profile: UserProfile | null, defaultPath: string = '/dashboard'): string => {
  // Skip caching for null profiles or admin checks which are already cached
  if (!profile) {
    return '/pricing?needSubscription=true';
  }
  
  // Create cache key from profile id and default path
  const cacheKey = `${profile.id}:${defaultPath}`;
  const cachedRedirect = redirectCache.get(cacheKey);
  const now = Date.now();
  
  if (cachedRedirect && (now - cachedRedirect.timestamp) < REDIRECT_CACHE_TTL) {
    return cachedRedirect.redirect;
  }
  
  console.log("getPostLoginRedirect called with profile:", profile, "and defaultPath:", defaultPath);
  
  // Direct admin check - always redirect admins to the dashboard regardless of subscription
  if (profile?.role === 'admin') {
    console.log("Admin user detected in getPostLoginRedirect, redirecting to dashboard");
    const redirect = '/dashboard';
    redirectCache.set(cacheKey, { redirect, timestamp: now });
    return redirect;
  }
  
  // Check if user has active subscription
  if (isUserActive(profile)) {
    console.log("User has active subscription, redirecting to:", defaultPath);
    const redirect = defaultPath;
    redirectCache.set(cacheKey, { redirect, timestamp: now });
    return redirect;
  }
  
  // Non-admin users without subscription go to pricing
  console.log("Non-subscribed user, redirecting to pricing page");
  const redirect = '/pricing?needSubscription=true';
  redirectCache.set(cacheKey, { redirect, timestamp: now });
  return redirect;
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
