
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import Stripe from "https://esm.sh/stripe@12.0.0";

// Import shared utilities and types
import { corsHeaders, generateInvitationCode } from "./utils.ts";

// Setup clients
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
});

export async function handleCreateInvitation({ plan = 'pro', discountPercentage = 100, expiresInDays = 30, maxUses = 1, notes = '' }) {
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

export async function handleListInvitations() {
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

export async function handleRevokeInvitation({ code }) {
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

export async function handleGrantProAccess({ userId, plan = 'pro' }) {
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
