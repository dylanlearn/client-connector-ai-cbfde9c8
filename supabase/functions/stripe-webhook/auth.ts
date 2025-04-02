
import Stripe from "https://esm.sh/stripe@12.0.0";
import { stripe, stripeWebhookSecret } from "./config.ts";

export async function verifyStripeSignature(
  payload: string, 
  signature: string
): Promise<Stripe.Event> {
  if (!stripeWebhookSecret) {
    throw new Error('Missing Stripe webhook secret');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error('Invalid signature');
  }
}
