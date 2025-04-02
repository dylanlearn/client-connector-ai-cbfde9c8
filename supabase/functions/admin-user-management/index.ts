
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyAdminUser } from "../admin-invitations/auth.ts";
import { corsHeaders } from "../admin-invitations/utils.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Setup Supabase client
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
      case 'list_users':
        return await handleListUsers();
      case 'update_user_role':
        return await handleUpdateUserRole(data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in admin-user-management function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

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

  // Valid roles check - Verify these match your database enum types
  const validRoles = ['free', 'sync', 'sync-pro', 'template-buyer', 'trial', 'admin'];
  if (!validRoles.includes(role)) {
    console.error(`Invalid role provided: ${role}`);
    return new Response(JSON.stringify({ 
      error: `Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  // Map role to subscription_status
  let subscription_status;
  switch (role) {
    case 'admin':
      subscription_status = 'sync-pro'; // admins always get sync-pro subscription status
      break;
    case 'sync':
    case 'sync-pro':
    case 'trial':
      subscription_status = role;
      break;
    default:
      subscription_status = 'free';
  }

  console.log(`Mapped subscription_status: ${subscription_status}`);

  try {
    // Update both role and subscription_status to ensure consistency
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
