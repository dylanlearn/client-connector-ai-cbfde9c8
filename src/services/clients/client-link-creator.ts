
import { supabase } from "@/integrations/supabase/client";

interface DeliveryMethods {
  email: boolean;
  sms: boolean;
}

/**
 * Creates a client access link and returns the link URL and ID
 */
export const createClientAccessLink = async (
  designerId: string,
  clientEmail: string,
  clientName: string,
  clientPhone: string | null = null,
  deliveryMethods: DeliveryMethods = { email: true, sms: false },
  projectId: string | null = null,
  personalMessage: string | null = null
): Promise<{ link: string; linkId: string }> => {
  try {
    // Validate personal message length
    if (personalMessage && personalMessage.length > 150) {
      throw new Error("Personal message must be 150 characters or less");
    }
    
    // Generate a unique token for the client
    const token = generateUniqueToken();
    
    // Calculate expiration date (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Insert the link into the database
    const { data, error } = await supabase
      .from('client_access_links')
      .insert({
        designer_id: designerId,
        token,
        client_email: clientEmail,
        client_name: clientName,
        client_phone: clientPhone,
        status: 'active',
        expires_at: expiresAt.toISOString(),
        project_id: projectId,
        personal_message: personalMessage
      })
      .select('id')
      .single();
    
    if (error) {
      throw new Error(`Failed to create client access link: ${error.message}`);
    }
    
    // Get the base URL from environment or use a default
    const baseUrl = window.location.origin;
    
    // Generate the full URL to send to the client
    const clientHubLink = `${baseUrl}/client-hub?clientToken=${token}&designerId=${designerId}`;
    
    return {
      link: clientHubLink,
      linkId: data.id
    };
  } catch (error) {
    console.error("Error creating client access link:", error);
    throw error;
  }
};

/**
 * Generates a unique token for client authentication
 */
const generateUniqueToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
