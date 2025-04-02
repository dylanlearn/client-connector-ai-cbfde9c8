
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@1.0.0";
import { Twilio } from "https://esm.sh/twilio@4.14.0/lib/rest/Twilio.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendLinkRequest {
  linkId: string;
  deliveryType: 'email' | 'sms';
  recipient: string;
  personalMessage?: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { linkId, deliveryType, recipient, personalMessage }: SendLinkRequest = await req.json();
    
    if (!linkId || !deliveryType || !recipient) {
      throw new Error("Missing required parameters");
    }
    
    // Validate personal message length
    if (personalMessage && personalMessage.length > 150) {
      throw new Error("Personal message must be 150 characters or less");
    }
    
    // Get the link details
    const { data: linkData, error: linkError } = await supabase
      .from('client_access_links')
      .select('token, designer_id, client_name')
      .eq('id', linkId)
      .maybeSingle();
    
    if (linkError) {
      throw new Error(`Database error: ${linkError.message}`);
    }
    
    if (!linkData) {
      throw new Error("Link not found");
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
      throw new Error(`Failed to record delivery: ${recordError.message}`);
    }
    
    // Generate the full client hub link
    const baseUrl = Deno.env.get("PUBLIC_APP_URL") || "https://dezignsync.app";
    const clientHubLink = `${baseUrl}/client-hub?clientToken=${linkData.token}&designerId=${linkData.designer_id}`;
    
    // Send the message based on delivery type
    let deliveryResult;
    let status = 'error';
    let errorMessage = null;
    
    if (deliveryType === 'email') {
      try {
        deliveryResult = await sendEmail(
          recipient, 
          linkData.client_name, 
          clientHubLink, 
          personalMessage
        );
        status = 'sent';
      } catch (error) {
        console.error("Error sending email:", error);
        status = 'error';
        errorMessage = error.message;
        throw error;
      }
    } 
    else if (deliveryType === 'sms') {
      try {
        deliveryResult = await sendSMS(
          recipient, 
          linkData.client_name, 
          clientHubLink, 
          personalMessage
        );
        status = 'sent';
      } catch (error) {
        console.error("Error sending SMS:", error);
        status = 'error';
        errorMessage = error.message;
        throw error;
      }
    }
    
    // Update delivery status
    await supabase
      .from('client_link_deliveries')
      .update({ 
        status: status,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        error_message: errorMessage
      })
      .eq('id', deliveryRecord);
    
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
    try {
      const { linkId, deliveryType, recipient } = await req.json();
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
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
        await supabase
          .from('client_link_deliveries')
          .update({ 
            status: 'error',
            error_message: error.message
          })
          .eq('id', data[0].id);
      }
    } catch (updateError) {
      console.error("Failed to update delivery status:", updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper function to send email
async function sendEmail(
  recipient: string, 
  clientName: string, 
  clientHubLink: string, 
  personalMessage: string | null
): Promise<any> {
  // Initialize Resend with API key
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    throw new Error("Resend API key not configured");
  }
  
  const resend = new Resend(resendApiKey);
  
  // Build email content with optional personal message
  let emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4338ca;">Your Design Project Is Ready</h1>
      <p>Hello ${clientName},</p>
      <p>Your designer has shared a project with you. Click the button below to access your design hub:</p>
  `;
  
  // Add personal message if provided
  if (personalMessage) {
    emailHtml += `
      <div style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #4338ca; margin: 20px 0;">
        <p style="font-style: italic; margin: 0;">"${personalMessage}"</p>
      </div>
    `;
  }
  
  emailHtml += `
      <div style="margin: 30px 0;">
        <a href="${clientHubLink}" style="background-color: #4338ca; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Access Your Design Hub</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #6b7280;">${clientHubLink}</p>
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">This link will expire in 7 days.</p>
    </div>
  `;
  
  // Send email using Resend
  const emailResponse = await resend.emails.send({
    from: "DezignSync <noreply@dezignsync.app>",
    to: recipient,
    subject: `${clientName}, access your design project`,
    html: emailHtml,
  });
  
  console.log("Email sent successfully:", emailResponse);
  return emailResponse;
}

// Helper function to send SMS
async function sendSMS(
  recipient: string, 
  clientName: string, 
  clientHubLink: string, 
  personalMessage: string | null
): Promise<any> {
  // Initialize Twilio with credentials
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");
  
  if (!accountSid || !authToken || !twilioPhone) {
    throw new Error("Twilio credentials not configured");
  }
  
  const client = new Twilio(accountSid, authToken);
  
  // Format phone number (ensure it has + prefix)
  let formattedPhone = recipient;
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = `+${formattedPhone}`;
  }
  
  console.log(`Sending SMS to ${formattedPhone}`);
  
  // Construct SMS message with optional personal message
  let smsBody = `Hello ${clientName}, your designer has shared a project with you on DezignSync.`;
  
  // Add personal message if provided
  if (personalMessage) {
    smsBody += ` "${personalMessage}"`;
  }
  
  // Add the link
  smsBody += ` Access your design hub here: ${clientHubLink}`;
  
  // Send SMS using Twilio
  const message = await client.messages.create({
    body: smsBody,
    from: twilioPhone,
    to: formattedPhone,
    statusCallback: `${Deno.env.get("SUPABASE_URL")}/functions/v1/update-sms-status`
  });
  
  console.log("SMS sent successfully:", message.sid);
  return { messageId: message.sid };
}

serve(handler);
