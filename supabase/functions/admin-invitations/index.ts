
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import Stripe from "https://esm.sh/stripe@12.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
});

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

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    if (profile.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    // Get the action from the request body
    const { action, ...data } = await req.json();

    switch (action) {
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
    console.error('Error in admin-invitations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

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

function generateInvitationCode() {
  // Generate a random string of 8 characters
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
