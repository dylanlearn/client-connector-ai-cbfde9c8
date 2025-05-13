
import Stripe from 'stripe';

// Initialize Stripe client with environment variables
const stripeSecretKey = typeof window === 'undefined' 
  ? process.env.STRIPE_SECRET_KEY 
  : '';

export class StripeWrapper {
  private static instance: StripeWrapper;
  private stripe: Stripe;

  private constructor() {
    if (!stripeSecretKey) {
      console.error('Missing Stripe Secret Key');
    }
    this.stripe = new Stripe(stripeSecretKey || '', {
      apiVersion: '2025-03-31.basil', // Updated to match the expected API version
    });
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): StripeWrapper {
    if (!StripeWrapper.instance) {
      StripeWrapper.instance = new StripeWrapper();
    }
    return StripeWrapper.instance;
  }

  // Subscription management methods
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return null;
    }
  }

  async updateSubscription(
    subscriptionId: string, 
    updateData: Stripe.SubscriptionUpdateParams
  ): Promise<Stripe.Subscription | null> {
    try {
      return await this.stripe.subscriptions.update(subscriptionId, updateData);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return null;
    }
  }

  // Customer management methods
  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      return await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
    } catch (error) {
      console.error('Error retrieving customer:', error);
      return null;
    }
  }

  async createCustomer(customerData: Stripe.CustomerCreateParams): Promise<Stripe.Customer | null> {
    try {
      return await this.stripe.customers.create(customerData);
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  }

  // Checkout and payment methods
  async createCheckoutSession(
    params: Stripe.Checkout.SessionCreateParams
  ): Promise<Stripe.Checkout.Session | null> {
    try {
      return await this.stripe.checkout.sessions.create(params);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  }

  // Webhook handling
  async constructEventFromPayload(
    payload: string,
    signature: string,
    webhookSecret: string
  ): Promise<Stripe.Event | null> {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error('Error constructing webhook event:', error);
      return null;
    }
  }

  // Access to the raw Stripe instance if needed
  getStripeInstance(): Stripe {
    return this.stripe;
  }
}

// Export a singleton instance
export const stripeClient = StripeWrapper.getInstance();
