
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

    // Get the invitation code from the request body
    const { code } = await req.json();
    
    if (!code) {
      throw new Error('No invitation code provided');
    }

    // Check if the invitation code is valid
    const { data: invitation, error: invitationError } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('code', code)
      .single();

    if (invitationError) {
      throw new Error('Invalid invitation code');
    }

    // Check if the invitation code is revoked
    if (invitation.is_revoked) {
      throw new Error('This invitation code has been revoked');
    }

    // Check if the invitation code is expired
    if (new Date(invitation.expires_at) < new Date()) {
      throw new Error('This invitation code has expired');
    }

    // Check if the invitation code has reached its maximum uses
    if (invitation.uses >= invitation.max_uses) {
      throw new Error('This invitation code has reached its maximum uses');
    }

    // Start a transaction
    const { data: existingSubscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('subscription_status, stripe_subscription_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subscriptionError) {
      throw new Error(`Error checking subscription: ${subscriptionError.message}`);
    }

    // Calculate the expiration date (1 year from now for free invitations)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // If the user doesn't have a subscription record, create one
    if (!existingSubscription) {
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          subscription_status: invitation.plan,
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
          subscription_status: invitation.plan,
          current_period_start: new Date().toISOString(),
          current_period_end: expiresAt.toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error(`Error updating subscription: ${updateError.message}`);
      }
    }

    // Update the profile subscription status
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: invitation.plan,
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      throw new Error(`Error updating profile: ${profileUpdateError.message}`);
    }

    // Increment the uses count for the invitation code
    const { error: incrementError } = await supabase
      .from('invitation_codes')
      .update({
        uses: invitation.uses + 1,
      })
      .eq('code', code);

    if (incrementError) {
      throw new Error(`Error incrementing invitation uses: ${incrementError.message}`);
    }

    // Add a record to the invitation_redemptions table
    const { error: redemptionError } = await supabase
      .from('invitation_redemptions')
      .insert({
        invitation_code_id: invitation.id,
        user_id: user.id,
      });

    if (redemptionError) {
      throw new Error(`Error recording redemption: ${redemptionError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Invitation code redeemed successfully",
      plan: invitation.plan,
      expiresAt: expiresAt.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in redeem-invitation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
