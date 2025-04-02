
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get the user from the authorization header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token or user not found');
    }
    
    console.log("Checking subscription for user:", user.id);
    console.log("User email:", user.email);
    console.log("User metadata:", user.user_metadata);
    
    // Check if the user is an admin first - this is critical
    // Try multiple paths for redundancy
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, subscription_status, email')
      .eq('id', user.id)
      .single();
      
    console.log("Profile data:", profileData);
    console.log("Profile error:", profileError);
    
    // If user has admin role, grant full access
    if (!profileError && profileData?.role === 'admin') {
      console.log("User is admin, granting full access");
      return new Response(JSON.stringify({
        subscription: 'pro',
        isActive: true,
        inTrial: false,
        expiresAt: null,
        willCancel: false,
        isAdmin: true,
        role: profileData.role
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Check for admin-assigned subscription status
    if (!profileError) {
      // If user has pro role or pro subscription status assigned by admin
      if (profileData?.role === 'pro' || profileData?.subscription_status === 'pro') {
        console.log("User has admin-assigned pro access");
        return new Response(JSON.stringify({
          subscription: 'pro',
          isActive: true,
          inTrial: false,
          expiresAt: null,
          willCancel: false,
          isAdmin: false,
          role: profileData.role,
          adminAssigned: true,
          adminAssignedStatus: 'pro'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      // If user has basic role or basic subscription status assigned by admin
      if (profileData?.role === 'basic' || profileData?.subscription_status === 'basic') {
        console.log("User has admin-assigned basic access");
        return new Response(JSON.stringify({
          subscription: 'basic',
          isActive: true,
          inTrial: false,
          expiresAt: null,
          willCancel: false,
          isAdmin: false,
          role: profileData.role,
          adminAssigned: true,
          adminAssignedStatus: 'basic'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    // Special check for Google login admin (based on email)
    const userEmail = user.email || profileData?.email || user.user_metadata?.email;
    
    // Check if the email is in the admin list (add your admin emails here)
    const adminEmails = ["dylanmohseni0@gmail.com"];
    
    if (userEmail && adminEmails.includes(userEmail.toLowerCase())) {
      console.log("Email found in admin list. Updating profile to admin and granting access.");
      
      // Update the user's profile to have admin role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Error updating profile to admin:", updateError);
      }
      
      return new Response(JSON.stringify({
        subscription: 'pro',
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

    // If not admin or admin-assigned, check the subscription status
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('subscription_status, current_period_end, cancel_at_period_end')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subscriptionError) {
      console.log("Error fetching subscription:", subscriptionError.message);
      
      // Fallback check for profile subscription status
      if (!profileError && (profileData?.subscription_status === 'pro' || profileData?.subscription_status === 'basic')) {
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
    const isActive = subscription && ['basic', 'pro'].includes(subscription.subscription_status);
    
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
  } catch (error) {
    console.error('Error checking subscription:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      subscription: 'free',
      isActive: false,
      inTrial: false,
      expiresAt: null,
      willCancel: false,
      isAdmin: false,
      adminAssigned: false,
      adminAssignedStatus: null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 even on error with default values to prevent UI failures
    });
  }
});
