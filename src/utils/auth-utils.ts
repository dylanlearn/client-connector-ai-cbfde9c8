
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const fetchUserProfile = async (userId: string) => {
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
    return data;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

export const getRedirectUrl = () => {
  return "https://client-connector-ai.lovable.app/dashboard";
};

// Add a specific function for email confirmation redirect
export const getEmailConfirmationRedirectUrl = () => {
  return "https://client-connector-ai.lovable.app/login?confirmed=true";
};

// Function to enable realtime updates on a table
export const enableRealtimeForTable = async (tableName: string) => {
  try {
    // Use channel-based approach instead of RPC
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

// New utility function to check if a user has an active/paid role
export const isUserActive = (profile: any | null): boolean => {
  if (!profile) return false;
  
  // Check if the user has a paid subscription status
  const hasActivePlan = profile.subscription_status === 'basic' || 
                        profile.subscription_status === 'pro';
  
  // Check if the user has a privileged role
  const hasPrivilegedRole = profile.role === 'admin';
  
  return hasActivePlan || hasPrivilegedRole;
};

// Helper function to get the appropriate post-login redirect based on user status
export const getPostLoginRedirect = (profile: any | null, defaultPath: string = '/dashboard'): string => {
  if (isUserActive(profile)) {
    return defaultPath;
  }
  
  return '/pricing?needSubscription=true';
};
