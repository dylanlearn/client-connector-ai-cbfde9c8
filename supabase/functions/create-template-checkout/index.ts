
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
    // Get request data
    const { templateId, price, title, guestEmail, guestName, returnUrl } = await req.json();
    
    if (!templateId || !price || !title) {
      throw new Error('Missing required parameters');
    }

    // Get the authenticated user from the request, if available
    let userId = null;
    let userEmail = null;
    
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        
        if (!userError && user) {
          userId = user.id;
          userEmail = user.email;
        }
      } catch (authError) {
        console.error('Auth error:', authError);
        // Continue as guest if authentication fails
      }
    }
    
    // Use guest info if no authenticated user
    const customerEmail = userEmail || guestEmail;
    
    if (!customerEmail) {
      throw new Error('Customer email is required');
    }

    console.log(`Creating checkout for template ${templateId}, price: ${price}, user: ${userId || 'guest'}`);

    // Format the price for Stripe (convert to cents)
    const stripeAmount = Math.round(parseFloat(price) * 100);
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              description: 'Template Purchase',
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl || req.headers.get('origin')}/templates?checkout=success&template_id=${templateId}`,
      cancel_url: `${returnUrl || req.headers.get('origin')}/templates?checkout=canceled`,
      client_reference_id: templateId,
      customer_email: customerEmail,
      metadata: {
        template_id: templateId,
        user_id: userId || `guest_${Date.now()}`,
        guest_name: !userId && guestName ? guestName : undefined,
      },
    });

    // Return the checkout URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating template checkout session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
