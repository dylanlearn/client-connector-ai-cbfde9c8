
/**
 * Functions for creating client access links
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ClientLinkResult } from "@/types/client";
import { generateToken } from "./token-generation";
import { recordLinkDelivery } from "./client-link-delivery";
import { createDefaultClientTasks } from "../client-tasks-service";

// Create a new client access link
export const createClientAccessLink = async (
  designerId: string,
  clientEmail: string,
  clientName: string,
  clientPhone: string | null = null,
  deliveryMethods: { email: boolean, sms: boolean } = { email: true, sms: false },
  projectId: string | null = null
): Promise<ClientLinkResult> => {
  try {
    // Create an expiry date 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    const token = generateToken();
    
    const { data, error } = await supabase
      .from('client_access_links')
      .insert({
        designer_id: designerId,
        client_email: clientEmail,
        client_name: clientName,
        client_phone: clientPhone,
        project_id: projectId,
        token: token,
        expires_at: expiresAt.toISOString(),
        status: 'active'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating client access link:', error);
      toast.error('Failed to create client access link');
      return { link: null, linkId: null };
    }

    // Create default tasks for this client
    await createDefaultClientTasks(data.id);
    
    // Record delivery methods
    if (deliveryMethods.email) {
      await recordLinkDelivery(data.id, 'email', clientEmail);
    }
    
    if (deliveryMethods.sms && clientPhone) {
      await recordLinkDelivery(data.id, 'sms', clientPhone);
    }
    
    // Return the sharable link and the link ID
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/client-hub?clientToken=${token}&designerId=${designerId}`;
    return { link, linkId: data.id };
  } catch (error) {
    console.error('Error in createClientAccessLink:', error);
    toast.error('An unexpected error occurred');
    return { link: null, linkId: null };
  }
};
