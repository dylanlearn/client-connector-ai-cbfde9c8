
import { corsHeaders } from "./cors.ts";

// Handle admin user response
export function handleAdminUser() {
  return new Response(JSON.stringify({
    subscription: 'sync-pro',
    isActive: true,
    inTrial: false,
    expiresAt: null,
    willCancel: false,
    isAdmin: true,
    role: 'admin'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

// Handle admin-assigned subscription status
export function handleAdminAssignedAccess(profileData) {
  // If user has sync-pro role or sync-pro subscription status assigned by admin
  if (profileData?.role === 'sync-pro' || profileData?.subscription_status === 'sync-pro') {
    console.log("User has admin-assigned pro access");
    return new Response(JSON.stringify({
      subscription: 'sync-pro',
      isActive: true,
      inTrial: false,
      expiresAt: null,
      willCancel: false,
      isAdmin: false,
      role: profileData.role,
      adminAssigned: true,
      adminAssignedStatus: 'sync-pro'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  
  // If user has sync role or sync subscription status assigned by admin
  if (profileData?.role === 'sync' || profileData?.subscription_status === 'sync') {
    console.log("User has admin-assigned basic access");
    return new Response(JSON.stringify({
      subscription: 'sync',
      isActive: true,
      inTrial: false,
      expiresAt: null,
      willCancel: false,
      isAdmin: false,
      role: profileData.role,
      adminAssigned: true,
      adminAssignedStatus: 'sync'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  
  return null;
}

// Handle regular user subscription status
export async function handleRegularUser(userId, profileData, supabase) {
  // Check the subscription status
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('subscription_status, current_period_end, cancel_at_period_end')
    .eq('user_id', userId)
    .maybeSingle();

  if (subscriptionError) {
    console.log("Error fetching subscription:", subscriptionError.message);
    
    // Fallback check for profile subscription status
    if (profileData?.subscription_status === 'sync-pro' || profileData?.subscription_status === 'sync') {
      console.log("Using profile subscription status as fallback");
      return new Response(JSON.stringify({
        subscription: profileData.subscription_status,
        isActive: true,
        inTrial: false,
        expiresAt: null,
        willCancel: false,
        isAdmin: false,
        role: profileData.role,
        adminAssigned: true,
        adminAssignedStatus: profileData.subscription_status
      }), {
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

  // Return the subscription status with enhanced details
  return new Response(JSON.stringify({
    subscription: subscription?.subscription_status || profileData?.subscription_status || 'free',
    isActive,
    inTrial,
    expiresAt: subscription?.current_period_end || null,
    willCancel: subscription?.cancel_at_period_end || false,
    isAdmin: false,
    role: profileData?.role || 'free',
    adminAssigned: false,
    adminAssignedStatus: null
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}
