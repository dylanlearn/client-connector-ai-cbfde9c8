
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./types.ts";

// Constants
const MAX_PERSONAL_MESSAGE_LENGTH = 150;

/**
 * Initialize and return Supabase client with environment credentials
 * @returns Configured Supabase client
 * @throws Error if credentials are missing
 */
export function initSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Validate a personal message
 * @param personalMessage The message to validate
 * @throws Error if the message exceeds the maximum length
 */
export function validatePersonalMessage(personalMessage?: string | null): void {
  if (personalMessage && personalMessage.length > MAX_PERSONAL_MESSAGE_LENGTH) {
    throw new Error(`Personal message must be ${MAX_PERSONAL_MESSAGE_LENGTH} characters or less`);
  }
}

/**
 * Generate a client hub link
 * @param token The client token
 * @param designerId The designer ID
 * @returns The complete client hub link
 */
export function generateClientHubLink(token: string, designerId: string): string {
  // Use the live domain instead of a fallback
  return `https://dezignsync.com/client-hub?clientToken=${token}&designerId=${designerId}`;
}

/**
 * Handle the CORS preflight request
 * @param req The incoming request
 * @returns Response with appropriate CORS headers
 */
export function handleCorsRequest(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

/**
 * Update delivery status in the database
 * @param supabase Supabase client
 * @param deliveryRecordId Delivery record ID to update
 * @param status New status value
 * @param errorMessage Optional error message
 */
export async function updateDeliveryStatus(
  supabase: any,
  deliveryRecordId: string,
  status: 'sent' | 'error',
  errorMessage: string | null = null
): Promise<void> {
  await supabase
    .from('client_link_deliveries')
    .update({ 
      status: status,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
      error_message: errorMessage
    })
    .eq('id', deliveryRecordId);
}

/**
 * Find and update a failed delivery record
 * @param supabase Supabase client
 * @param linkId Link ID
 * @param deliveryType Delivery type
 * @param recipient Recipient
 * @param errorMessage Error message
 */
export async function updateFailedDelivery(
  supabase: any,
  linkId: string,
  deliveryType: 'email' | 'sms',
  recipient: string,
  errorMessage: string
): Promise<void> {
  try {
    // Find the most recent pending delivery for this link and type
    const { data } = await supabase
      .from('client_link_deliveries')
      .select('id')
      .eq('link_id', linkId)
      .eq('delivery_type', deliveryType)
      .eq('recipient', recipient)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (data && data.length > 0) {
      await updateDeliveryStatus(supabase, data[0].id, 'error', errorMessage);
    }
  } catch (updateError) {
    console.error("Failed to update delivery status:", updateError);
  }
}
