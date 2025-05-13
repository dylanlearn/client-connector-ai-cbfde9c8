
// Stripe wrapper to initialize the Stripe client on the frontend.
// This isolates Stripe initialization and makes it easy to mock for testing.

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Store the loaded Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Initialize and return the Stripe instance
 * Caches the promise for subsequent calls
 */
export const getStripe = (): Promise<Stripe | null> => {
  // If we've already initiated Stripe, return the existing promise
  if (stripePromise) {
    return stripePromise;
  }

  // Get the publishable key from environment variables
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Initialize Stripe with the key and latest API version
  stripePromise = loadStripe(publishableKey, {
    apiVersion: '2025-04-30.basil',
  });

  return stripePromise;
};
