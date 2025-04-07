
/**
 * Functions for handling client link delivery (email/SMS)
 */

import { supabase } from "@/integrations/supabase/client";

// Record a delivery attempt for a client link
export const recordLinkDelivery = async (
  linkId: string,
  deliveryType: 'email' | 'sms',
  recipient: string,
  status: string = 'pending'
): Promise<boolean> => {
  try {
    // Retry logic to handle intermittent connection issues
    let attempts = 0;
    let success = false;
    let error = null;
    
    while (attempts < 3 && !success) {
      const result = await supabase.rpc(
        'record_client_link_delivery',
        {
          p_link_id: linkId,
          p_delivery_type: deliveryType,
          p_recipient: recipient,
          p_status: status
        }
      );

      error = result.error;
      
      if (error) {
        console.error(`Error recording ${deliveryType} delivery (attempt ${attempts + 1}):`, error);
        attempts++;
        // Wait a bit before retrying
        if (attempts < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        success = true;
      }
    }
    
    if (error) {
      console.error(`Error recording ${deliveryType} delivery after retries:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in recordLinkDelivery for ${deliveryType}:`, error);
    return false;
  }
};

// Get delivery information for a client link
export const getLinkDeliveries = async (linkId: string): Promise<any[] | null> => {
  try {
    const { data, error } = await supabase
      .from('client_link_deliveries')
      .select('*')
      .eq('link_id', linkId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting link deliveries:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLinkDeliveries:', error);
    return null;
  }
};

// Resend a client link with improved error handling
export const resendClientLink = async (
  linkId: string,
  deliveryType: 'email' | 'sms',
  recipient: string,
  personalMessage?: string | null
): Promise<boolean> => {
  try {
    // Make sure the recipient is properly formatted
    let formattedRecipient = recipient.trim();
    
    // For SMS, ensure proper formatting
    if (deliveryType === 'sms' && !formattedRecipient.startsWith('+')) {
      formattedRecipient = `+${formattedRecipient}`;
    }
    
    const response = await supabase.functions.invoke('notifications-api', {
      body: {
        action: 'send-client-link',
        linkId,
        deliveryType,
        recipient: formattedRecipient,
        personalMessage: personalMessage || null
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message || 'Unknown error sending link');
    }
    
    return true;
  } catch (error) {
    console.error(`Error resending client link via ${deliveryType}:`, error);
    return false;
  }
};
