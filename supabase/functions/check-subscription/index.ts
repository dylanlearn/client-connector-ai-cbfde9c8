
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { corsHeaders } from "./cors.ts";
import { 
  handleAdminUser, 
  handleAdminAssignedAccess, 
  handleRegularUser,
  updateUserToAdmin,
  isAdminEmail
} from "./user-handlers.ts";
import { verifyUser } from "./auth.ts";
import { log, LogLevel, createErrorResponse } from "./monitoring.ts";

// Environment configuration
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Initialize Supabase client with service role for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Main function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user from authorization header
    const { user, error: authError } = await verifyUser(req, supabase);
    
    if (authError || !user) {
      log(LogLevel.ERROR, "Authentication failed", { error: authError?.message });
      throw new Error(authError?.message || 'Invalid token or user not found');
    }
    
    log(LogLevel.INFO, "Checking subscription for user", { userId: user.id, email: user.email });
    
    // Fetch profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, subscription_status, email')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      log(LogLevel.WARN, "Error fetching profile data", { error: profileError.message, userId: user.id });
    } else {
      log(LogLevel.DEBUG, "Profile data retrieved", { profileData, userId: user.id });
    }
    
    // Check if user is admin
    if (!profileError && profileData?.role === 'admin') {
      log(LogLevel.INFO, "User is admin, granting full access", { userId: user.id });
      return handleAdminUser();
    }
    
    // Check for admin-assigned subscription status
    if (!profileError) {
      const adminAssignedResponse = handleAdminAssignedAccess(profileData);
      if (adminAssignedResponse) {
        return adminAssignedResponse;
      }
    }

    // Special check for Google login admin (based on email)
    const userEmail = user.email || profileData?.email || user.user_metadata?.email;
    
    // Check if the email is in the admin list
    if (isAdminEmail(userEmail)) {
      log(LogLevel.INFO, "Email found in admin list, updating profile", { email: userEmail, userId: user.id });
      
      const updated = await updateUserToAdmin(user.id, userEmail, supabase);
      
      if (updated) {
        log(LogLevel.INFO, "User successfully updated to admin role", { userId: user.id });
        return handleAdminUser();
      }
    }

    // Handle regular user subscription status
    return await handleRegularUser(user.id, profileData, supabase);
    
  } catch (error) {
    return createErrorResponse(error);
  }
});
