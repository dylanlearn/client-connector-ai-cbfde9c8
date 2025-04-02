
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

    // Get the plan from the request body
    const { plan, returnUrl } = await req.json();
    
    if (!plan || (plan !== 'basic' && plan !== 'pro')) {
      throw new Error('Invalid or missing plan parameter');
    }

    // Get or create the customer in Stripe
    let customerId;
    const { data: customers, error: customersError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customersError) {
      throw new Error(`Error fetching customer: ${customersError.message}`);
    }

    if (customers?.stripe_customer_id) {
      customerId = customers.stripe_customer_id;
    } else {
      // Get user profile info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error(`Error fetching profile: ${profileError.message}`);
      }

      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: profile.email || user.email,
        name: profile.name || undefined,
        metadata: {
          user_id: user.id,
        },
      });
      
      customerId = customer.id;
      
      // Insert the customer into the subscriptions table
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          subscription_status: 'free',
        });
        
      if (insertError) {
        throw new Error(`Error inserting subscription: ${insertError.message}`);
      }
    }

    // Set up the price ID based on the selected plan
    const priceId = plan === 'basic' 
      ? 'price_basic' // Replace with your actual Stripe price ID for basic plan
      : 'price_pro';  // Replace with your actual Stripe price ID for pro plan

    // Create a checkout session with a free trial
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 3, // 3-day free trial
      },
      success_url: `${returnUrl || req.headers.get('origin')}/dashboard?checkout=success`,
      cancel_url: `${returnUrl || req.headers.get('origin')}/dashboard?checkout=canceled`,
    });

    // Return the checkout URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
