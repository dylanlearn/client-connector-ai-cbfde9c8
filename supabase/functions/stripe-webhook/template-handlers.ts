
import { supabase } from "./config.ts";

export async function handleTemplatePurchase(session) {
  try {
    const templateId = session.metadata.template_id;
    const userId = session.metadata.user_id;
    const paymentAmount = session.amount_total / 100; // Convert from cents to dollars
    const transactionId = session.payment_intent;

    console.log(`Recording template purchase: template ${templateId}, user ${userId}, amount ${paymentAmount}`);

    // Insert the purchase record into the database
    const { data, error } = await supabase
      .from('template_purchases')
      .insert({
        template_id: templateId,
        user_id: userId,
        price_paid: paymentAmount,
        transaction_id: transactionId
      });

    if (error) {
      throw new Error(`Failed to record template purchase: ${error.message}`);
    }

    console.log('Template purchase recorded successfully:', data);
    return true;
  } catch (error) {
    console.error('Error handling template purchase:', error);
    throw error;
  }
}
