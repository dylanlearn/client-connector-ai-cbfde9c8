
import Stripe from "https://esm.sh/stripe@12.0.0";
import { supabase } from "./config.ts";

export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
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

export async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
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
