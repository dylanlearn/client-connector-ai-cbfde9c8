
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
    const { error } = await supabase.rpc(
      'record_client_link_delivery',
      {
        p_link_id: linkId,
        p_delivery_type: deliveryType,
        p_recipient: recipient,
        p_status: status
      }
    );

    if (error) {
      console.error(`Error recording ${deliveryType} delivery:`, error);
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

// Resend a client link
export const resendClientLink = async (
  linkId: string,
  deliveryType: 'email' | 'sms',
  recipient: string
): Promise<boolean> => {
  try {
    const response = await supabase.functions.invoke('send-client-link', {
      body: {
        linkId,
        deliveryType,
        recipient
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return true;
  } catch (error) {
    console.error(`Error resending client link via ${deliveryType}:`, error);
    return false;
  }
};
