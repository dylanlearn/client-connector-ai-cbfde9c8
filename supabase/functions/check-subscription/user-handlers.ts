
import { corsHeaders } from "./cors.ts";
import { UserProfile, SubscriptionData, SubscriptionResponse, ADMIN_EMAILS } from "./types.ts";
import { log, LogLevel } from "./monitoring.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Handle admin user response
export function handleAdminUser(): Response {
  const responseData: SubscriptionResponse = {
    subscription: 'sync-pro',
    isActive: true,
    inTrial: false,
    expiresAt: null,
    willCancel: false,
    isAdmin: true,
    role: 'admin'
  };
  
  log(LogLevel.INFO, "Admin access granted", responseData);
  
  return new Response(JSON.stringify(responseData), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

// Handle admin-assigned subscription status
export function handleAdminAssignedAccess(profileData: UserProfile | null): Response | null {
  if (!profileData) return null;
  
  // If user has sync-pro role or sync-pro subscription status assigned by admin
  if (profileData.role === 'sync-pro' || profileData.subscription_status === 'sync-pro') {
    const responseData: SubscriptionResponse = {
      subscription: 'sync-pro',
      isActive: true,
      inTrial: false,
      expiresAt: null,
      willCancel: false,
      isAdmin: false,
      role: profileData.role,
      adminAssigned: true,
      adminAssignedStatus: 'sync-pro'
    };
    
    log(LogLevel.INFO, "Admin-assigned pro access detected", { role: profileData.role });
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  
  // If user has sync role or sync subscription status assigned by admin
  if (profileData.role === 'sync' || profileData.subscription_status === 'sync') {
    const responseData: SubscriptionResponse = {
      subscription: 'sync',
      isActive: true,
      inTrial: false,
      expiresAt: null,
      willCancel: false,
      isAdmin: false,
      role: profileData.role,
      adminAssigned: true,
      adminAssignedStatus: 'sync'
    };
    
    log(LogLevel.INFO, "Admin-assigned basic access detected", { role: profileData.role });
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  
  return null;
}

// Update user to admin role
export async function updateUserToAdmin(
  userId: string, 
  userEmail: string, 
  supabase: ReturnType<typeof createClient>
): Promise<boolean> {
  log(LogLevel.INFO, "Updating user to admin role", { userId, email: userEmail });
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);
    
  if (updateError) {
    log(LogLevel.ERROR, "Error updating profile to admin", { error: updateError.message });
    return false;
  }
  
  return true;
}

// Check if email is in admin list
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Handle regular user subscription status
export async function handleRegularUser(
  userId: string, 
  profileData: UserProfile | null, 
  supabase: ReturnType<typeof createClient>
): Promise<Response> {
  try {
    // Check the subscription status
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('subscription_status, current_period_end, cancel_at_period_end')
      .eq('user_id', userId)
      .maybeSingle();

    if (subscriptionError) {
      log(LogLevel.WARN, "Error fetching subscription", { error: subscriptionError.message, userId });
      
      // Fallback check for profile subscription status
      if (profileData?.subscription_status === 'sync-pro' || profileData?.subscription_status === 'sync') {
        const responseData: SubscriptionResponse = {
          subscription: profileData.subscription_status,
          isActive: true,
          inTrial: false,
          expiresAt: null,
          willCancel: false,
          isAdmin: false,
          role: profileData.role,
          adminAssigned: true,
          adminAssignedStatus: profileData.subscription_status
        };
        
        log(LogLevel.INFO, "Using profile subscription status as fallback", responseData);
        
        return new Response(JSON.stringify(responseData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    // Check if the subscription is active
    const isActive = subscription && ['sync', 'sync-pro'].includes(subscription.subscription_status);
    
    // Check if the subscription is in trial
    const inTrial = subscription && 
                    subscription.current_period_end && 
                    Date.now() < new Date(subscription.current_period_end).getTime() && 
                    !subscription.cancel_at_period_end;

    // Build response
    const responseData: SubscriptionResponse = {
      subscription: subscription?.subscription_status || profileData?.subscription_status || 'free',
      isActive: !!isActive,
      inTrial: !!inTrial,
      expiresAt: subscription?.current_period_end || null,
      willCancel: subscription?.cancel_at_period_end || false,
      isAdmin: false,
      role: profileData?.role || 'free',
      adminAssigned: false,
      adminAssignedStatus: null
    };
    
    log(LogLevel.INFO, "Regular user subscription status checked", { 
      userId, 
      status: responseData.subscription,
      isActive: responseData.isActive
    });

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    log(LogLevel.ERROR, "Error in handleRegularUser", { error: error instanceof Error ? error.message : String(error) });
    
    return new Response(JSON.stringify({
      subscription: 'free',
      isActive: false,
      inTrial: false,
      expiresAt: null,
      willCancel: false,
      isAdmin: false,
      role: profileData?.role || 'free',
      adminAssigned: false,
      adminAssignedStatus: null,
      error: error instanceof Error ? error.message : String(error)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
}
