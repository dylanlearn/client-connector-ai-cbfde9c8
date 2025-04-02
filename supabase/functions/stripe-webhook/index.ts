
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
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // This webhook should not require authentication
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      headers: corsHeaders,
      status: 405,
    });
  }

  try {
    // Get the Stripe signature from the headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    // Get the raw request body as text
    const body = await req.text();
    
    // Construct the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook signature verification failed: ${err.message}`, {
        headers: corsHeaders,
        status: 400,
      });
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        // Find the user by the Stripe customer ID
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (subscriptionError) {
          throw new Error(`Error finding user: ${subscriptionError.message}`);
        }

        if (!subscriptionData) {
          throw new Error(`No user found for customer ${subscription.customer}`);
        }

        // Determine the subscription status
        let subscriptionStatus = 'free';
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          // Check the plan/price to determine if it's basic or pro
          const items = subscription.items.data;
          if (items && items.length > 0) {
            const priceId = items[0].price.id;
            if (priceId === 'price_basic') {
              subscriptionStatus = 'basic';
            } else if (priceId === 'price_pro') {
              subscriptionStatus = 'pro';
            }
          }
        }

        // Update the subscription in the database
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: subscriptionStatus,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', subscriptionData.user_id);

        if (updateError) {
          throw new Error(`Error updating subscription: ${updateError.message}`);
        }

        // Also update the profile subscription_status
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: subscriptionStatus,
          })
          .eq('id', subscriptionData.user_id);

        if (profileUpdateError) {
          throw new Error(`Error updating profile: ${profileUpdateError.message}`);
        }

        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Find the user by the Stripe customer ID
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (subscriptionError) {
          throw new Error(`Error finding user: ${subscriptionError.message}`);
        }

        if (!subscriptionData) {
          throw new Error(`No user found for customer ${subscription.customer}`);
        }

        // Update the subscription to free in the database
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            subscription_status: 'free',
            current_period_end: null,
            current_period_start: null,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', subscriptionData.user_id);

        if (updateError) {
          throw new Error(`Error updating subscription: ${updateError.message}`);
        }

        // Also update the profile subscription_status
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'free',
          })
          .eq('id', subscriptionData.user_id);

        if (profileUpdateError) {
          throw new Error(`Error updating profile: ${profileUpdateError.message}`);
        }

        break;
      }
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
