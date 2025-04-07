
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { verifyAdminUser } from "./auth.ts";

// Define CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Setup Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define valid roles for validation
const validRoles = ['free', 'sync', 'sync-pro', 'template-buyer', 'trial', 'admin'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    try {
      // Verify admin user permissions
      await verifyAdminUser(authHeader);
    } catch (error) {
      console.error('Authentication error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get the action from the request body
    const { action, ...data } = await req.json();
    console.log(`Processing admin action: ${action}`, data);

    // Route to the appropriate handler based on the action
    switch (action) {
      // User Management Handlers
      case 'list_users':
        return await handleListUsers();
      case 'update_user_role':
        return await handleUpdateUserRole(data);
        
      // Invitation Handlers
      case 'create_invitation':
        return await handleCreateInvitation(data);
      case 'list_invitations':
        return await handleListInvitations();
      case 'revoke_invitation':
        return await handleRevokeInvitation(data);
      case 'grant_pro_access':
        return await handleGrantProAccess(data);
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in admin-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// ===== USER MANAGEMENT HANDLERS =====

async function handleListUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, name, role, subscription_status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing users:', error.message);
    throw new Error(`Error listing users: ${error.message}`);
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function handleUpdateUserRole({ userId, role }) {
  console.log(`Updating user role: userId=${userId}, role=${role}`);
  
  if (!userId || !role) {
    console.error('Missing required parameters: userId and role are required');
    return new Response(JSON.stringify({ error: 'User ID and role are required' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  // Validate role
  if (!validRoles.includes(role)) {
    console.error(`Invalid role provided: ${role}`);
    return new Response(JSON.stringify({ 
      error: `Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  // Simplified mapping for subscription_status - default to the role
  let subscription_status = role;
  
  // Special cases
  if (role === 'admin') {
    subscription_status = 'sync-pro'; // admins get sync-pro status
  } else if (role === 'template-buyer') {
    subscription_status = 'free'; // template buyers get free status
  }
  // 'trial' will map directly to 'trial' subscription_status
  // 'sync' will map directly to 'sync'
  // 'sync-pro' will map directly to 'sync-pro'

  console.log(`Mapped subscription_status: ${subscription_status}`);

  try {
    // First get the current profile to preserve all other fields
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching current profile:', fetchError.message);
      return new Response(JSON.stringify({ error: `Error fetching current profile: ${fetchError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Update only role and subscription_status, preserving all other fields
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role,
        subscription_status
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating user role:', error.message);
      return new Response(JSON.stringify({ error: `Error updating user role: ${error.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('User role updated successfully:', data);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Exception updating user role:', error);
    return new Response(JSON.stringify({ error: `Exception updating user role: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// ===== INVITATION HANDLERS =====

// Utility function for invitations
function generateInvitationCode() {
  // Generate a random string of 8 characters
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function handleCreateInvitation({ plan = 'pro', discountPercentage = 100, expiresInDays = 30, maxUses = 1, notes = '' }) {
  // Generate a unique code
  const code = generateInvitationCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  // Insert the invitation into the database
  const { data, error } = await supabase
    .from('invitation_codes')
    .insert({
      code,
      plan,
      discount_percentage: discountPercentage,
      expires_at: expiresAt.toISOString(),
      max_uses: maxUses,
      notes,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating invitation: ${error.message}`);
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function handleListInvitations() {
  const { data, error } = await supabase
    .from('invitation_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error listing invitations: ${error.message}`);
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function handleRevokeInvitation({ code }) {
  const { data, error } = await supabase
    .from('invitation_codes')
    .update({ is_revoked: true })
    .eq('code', code)
    .select()
    .single();

  if (error) {
    throw new Error(`Error revoking invitation: ${error.message}`);
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function handleGrantProAccess({ userId, plan = 'pro' }) {
  // Update the user's profile and subscription status
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ subscription_status: plan })
    .eq('id', userId);

  if (profileError) {
    throw new Error(`Error updating profile: ${profileError.message}`);
  }

  // Calculate expiration date (1 year from now for manual grants)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Check if the user already has a subscription record
  const { data: existingSubscription, error: subscriptionCheckError } = await supabase
    .from('subscriptions')
    .select('subscription_status')
    .eq('user_id', userId)
    .maybeSingle();

  if (subscriptionCheckError) {
    throw new Error(`Error checking subscription: ${subscriptionCheckError.message}`);
  }

  if (!existingSubscription) {
    // Create a new subscription record
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        subscription_status: plan,
        current_period_start: new Date().toISOString(),
        current_period_end: expiresAt.toISOString(),
      });

    if (insertError) {
      throw new Error(`Error creating subscription: ${insertError.message}`);
    }
  } else {
    // Update the existing subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        subscription_status: plan,
        current_period_start: new Date().toISOString(),
        current_period_end: expiresAt.toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      throw new Error(`Error updating subscription: ${updateError.message}`);
    }
  }

  return new Response(JSON.stringify({ 
    success: true, 
    message: `Successfully granted ${plan} access to user`,
    expiresAt: expiresAt.toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}
