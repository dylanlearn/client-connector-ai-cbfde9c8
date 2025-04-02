
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import Stripe from "https://esm.sh/stripe@12.0.0";

// Environment variables
export const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
export const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
export const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
export const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? 'whsec_ObivcgGMpHgfBrjAhvQnhb7m4jDc8KoH';

// Create clients
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
});
