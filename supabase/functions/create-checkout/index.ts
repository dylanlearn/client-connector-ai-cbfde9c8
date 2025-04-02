
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import Stripe from "https://esm.sh/stripe@11.18.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token or user not found');
    }
    
    // Parse body to get plan and billing cycle
    const { plan, billingCycle, returnUrl } = await req.json();
    
    if (!plan || !['sync', 'sync-pro'].includes(plan)) {
      throw new Error('Invalid plan type');
    }
    
    if (!billingCycle || !['monthly', 'annual'].includes(billingCycle)) {
      throw new Error('Invalid billing cycle');
    }
    
    console.log(`Creating checkout for user ${user.id} - Plan: ${plan}, Cycle: ${billingCycle}`);
    
    // Get or create Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      throw new Error(`Error getting user profile: ${profileError.message}`);
    }

    // Determine price ID based on plan and billing cycle
    // Replace these IDs with your actual Stripe Price IDs
    const priceIds = {
      sync: {
        monthly: 'price_1NfYQJIxX0RUORwIMeRipt7V', // Replace with actual Sync monthly price ID
        annual: 'price_1NfYQgIxX0RUORwIVj3qQfUD',  // Replace with actual Sync annual price ID
      },
      'sync-pro': {
        monthly: 'price_1Na5oTIxX0RUORwIUKfcoc4d', // Replace with actual Sync Pro monthly price ID
        annual: 'price_1Na5pQIxX0RUORwIPcvVxBo3',  // Replace with actual Sync Pro annual price ID
      }
    };
    
    const priceId = priceIds[plan][billingCycle];
    if (!priceId) {
      throw new Error(`No price ID found for ${plan} (${billingCycle})`);
    }
    
    // Get or create Stripe customer
    let customerId = null;
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (subscriptionError) {
      console.error('Error getting subscription data:', subscriptionError);
    }
    
    if (subscriptionData?.stripe_customer_id) {
      customerId = subscriptionData.stripe_customer_id;
      console.log(`Using existing Stripe customer: ${customerId}`);
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile.name || user.email,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;
      console.log(`Created new Stripe customer: ${customerId}`);
    }

    // Create checkout session
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: returnUrl || `${origin}/dashboard?checkout=success`,
      cancel_url: returnUrl || `${origin}/dashboard?checkout=canceled`,
      subscription_data: {
        trial_period_days: 3,
        metadata: {
          userId: user.id,
          plan: plan
        },
      },
      allow_promotion_codes: true,
      metadata: {
        userId: user.id,
        plan: plan
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
