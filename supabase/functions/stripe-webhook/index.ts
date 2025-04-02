
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { handleSubscriptionChange, handleSubscriptionCancelled } from "./subscription-handlers.ts";
import { handleTemplatePurchase } from "./template-handlers.ts";
import { verifyStripeSignature } from "./auth.ts";

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

    // Verify webhook signature
    const event = await verifyStripeSignature(body, signature);
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
      case 'checkout.session.completed':
        // For one-time payments (templates)
        const session = event.data.object;
        if (session.mode === 'payment' && session.metadata?.template_id) {
          await handleTemplatePurchase(session);
        }
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
