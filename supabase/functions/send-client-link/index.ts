
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { 
  handleCorsRequest, 
  initSupabaseClient, 
  validatePersonalMessage,
  generateClientHubLink,
  updateDeliveryStatus,
  updateFailedDelivery
} from "./utils.ts";
import { sendEmail } from "./email-service.ts";
import { sendSMS } from "./sms-service.ts";
import { SendLinkRequest, corsHeaders } from "./types.ts";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsRequest(req);
  if (corsResponse) return corsResponse;

  let supabase;
  let requestData: SendLinkRequest | null = null;

  try {
    supabase = initSupabaseClient();
    
    // Parse request body
    requestData = await req.json();
    const { linkId, deliveryType, recipient, personalMessage } = requestData;
    
    if (!linkId || !deliveryType || !recipient) {
      throw new Error("Missing required parameters: linkId, deliveryType, and recipient are required");
    }
    
    // Validate personal message length using centralized validation
    validatePersonalMessage(personalMessage);
    
    // Get the link details
    const { data: linkData, error: linkError } = await supabase
      .from('client_access_links')
      .select('token, designer_id, client_name')
      .eq('id', linkId)
      .maybeSingle();
    
    if (linkError) {
      throw new Error(`Database error retrieving link: ${linkError.message}`);
    }
    
    if (!linkData) {
      throw new Error("Link not found in the database");
    }
    
    // Record the delivery attempt
    const { data: deliveryRecord, error: recordError } = await supabase.rpc(
      'record_client_link_delivery',
      {
        p_link_id: linkId,
        p_delivery_type: deliveryType,
        p_recipient: recipient,
        p_status: 'pending'
      }
    );
    
    if (recordError) {
      throw new Error(`Failed to record delivery attempt: ${recordError.message}`);
    }
    
    // Generate the client hub link
    const clientHubLink = generateClientHubLink(linkData.token, linkData.designer_id);
    
    // Send the message based on delivery type
    let deliveryResult;
    let status = 'error';
    let errorMessage = null;
    
    try {
      if (deliveryType === 'email') {
        deliveryResult = await sendEmail(
          recipient, 
          linkData.client_name, 
          clientHubLink, 
          personalMessage
        );
        status = 'sent';
      } 
      else if (deliveryType === 'sms') {
        deliveryResult = await sendSMS(
          recipient, 
          linkData.client_name, 
          clientHubLink, 
          personalMessage
        );
        status = 'sent';
      } else {
        throw new Error(`Unsupported delivery type: ${deliveryType}. Only 'email' and 'sms' are supported.`);
      }
    } catch (error: any) {
      console.error(`Error sending ${deliveryType}:`, error);
      status = 'error';
      errorMessage = error.message || "Unknown sending error";
      throw error;
    } finally {
      // Update delivery status regardless of outcome
      if (deliveryRecord) {
        await updateDeliveryStatus(supabase, deliveryRecord, status, errorMessage);
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: `Client hub link sent via ${deliveryType}`,
      deliveryResult
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-client-link function:", error);
    
    // Try to update the delivery record with error status if possible
    if (supabase && requestData) {
      try {
        const { linkId, deliveryType, recipient } = requestData;
        await updateFailedDelivery(supabase, linkId, deliveryType, recipient, error.message || "Unknown error");
      } catch (updateError) {
        console.error("Failed to update delivery status:", updateError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred",
        errorCode: error.code || "UNKNOWN_ERROR"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
