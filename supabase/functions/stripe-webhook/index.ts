
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
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('Missing Stripe signature');
    }

    // This should be your webhook signing secret from Stripe Dashboard
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
    if (!webhookSecret) {
      throw new Error('Missing Stripe webhook secret');
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing Stripe event: ${event.type}`);

    // Handle the event based on its type
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    // Find the user associated with this customer
    const { data: subscriptionData, error: findError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', subscription.customer as string)
      .maybeSingle();

    if (findError) {
      throw new Error(`Error finding subscription: ${findError.message}`);
    }

    if (!subscriptionData) {
      console.error(`No subscription found for customer: ${subscription.customer}`);
      return;
    }

    // Determine subscription status
    let status: 'free' | 'basic' | 'pro';
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      status = 'free';
    } else {
      // Get plan from the price ID
      const priceId = subscription.items.data[0]?.price.id;
      if (priceId.includes('basic')) {
        status = 'basic';
      } else if (priceId.includes('pro')) {
        status = 'pro';
      } else {
        status = 'free';
      }
    }

    // Update the subscription record
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_status: status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', subscriptionData.user_id);

    if (updateError) {
      throw new Error(`Error updating subscription: ${updateError.message}`);
    }

    // Also update profile subscription status
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionData.user_id);

    if (profileUpdateError) {
      throw new Error(`Error updating profile status: ${profileUpdateError.message}`);
    }

    console.log(`Subscription updated successfully for user: ${subscriptionData.user_id}`);
  } catch (error) {
    console.error(`Error in handleSubscriptionChange: ${error.message}`);
    throw error;
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  try {
    // Find the user associated with this customer
    const { data: subscriptionData, error: findError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .maybeSingle();

    if (findError) {
      throw new Error(`Error finding subscription: ${findError.message}`);
    }

    if (!subscriptionData) {
      console.error(`No subscription found for subscription ID: ${subscription.id}`);
      return;
    }

    // Update the subscription record
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        subscription_status: 'free',
        cancel_at_period_end: false,
        current_period_end: new Date().toISOString(), // End immediately
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', subscriptionData.user_id);

    if (updateError) {
      throw new Error(`Error updating subscription: ${updateError.message}`);
    }

    // Also update profile subscription status
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'free',
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionData.user_id);

    if (profileUpdateError) {
      throw new Error(`Error updating profile status: ${profileUpdateError.message}`);
    }

    console.log(`Subscription cancelled for user: ${subscriptionData.user_id}`);
  } catch (error) {
    console.error(`Error in handleSubscriptionCancelled: ${error.message}`);
    throw error;
  }
}
