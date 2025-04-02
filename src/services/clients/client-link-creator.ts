
import { supabase } from "@/integrations/supabase/client";
import { validatePersonalMessage } from "@/utils/validation-utils";

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
    // Use centralized validation for personal message
    const validation = validatePersonalMessage(personalMessage);
    if (!validation.valid) {
      throw new Error(validation.errorMessage || "Invalid personal message");
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
        personal_message: personalMessage?.trim() || null
      })
      .select('id')
      .single();
    
    if (error) {
      throw new Error(`Failed to create client access link: ${error.message}`);
    }
    
    // Get the base URL from environment or use the correct domain
    const baseUrl = "https://dezignsync.com";
    
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
