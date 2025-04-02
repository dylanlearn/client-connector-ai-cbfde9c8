
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { corsHeaders } from "./cors.ts";
import { handleAdminUser, handleAdminAssignedAccess, handleRegularUser } from "./user-handlers.ts";
import { verifyUser } from "./auth.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user from authorization header
    const { user, error: authError } = await verifyUser(req, supabase);
    
    if (authError || !user) {
      throw new Error(authError?.message || 'Invalid token or user not found');
    }
    
    console.log("Checking subscription for user:", user.id);
    console.log("User email:", user.email);
    console.log("User metadata:", user.user_metadata);
    
    // Fetch profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, subscription_status, email')
      .eq('id', user.id)
      .single();
      
    console.log("Profile data:", profileData);
    console.log("Profile error:", profileError);
    
    // Check if user is admin
    if (!profileError && profileData?.role === 'admin') {
      console.log("User is admin, granting full access");
      return handleAdminUser();
    }
    
    // Check for admin-assigned subscription status
    if (!profileError) {
      const adminAssignedResponse = await handleAdminAssignedAccess(profileData);
      if (adminAssignedResponse) {
        return adminAssignedResponse;
      }
    }

    // Special check for Google login admin (based on email)
    const userEmail = user.email || profileData?.email || user.user_metadata?.email;
    
    // Check if the email is in the admin list
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
      
      return handleAdminUser();
    }

    // Handle regular user subscription status
    return await handleRegularUser(user.id, profileData, supabase);
    
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
