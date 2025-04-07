
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@1.0.0";
import { Twilio } from "https://esm.sh/twilio@4.14.0/lib/rest/Twilio.js";

// CORS headers
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define request types
interface BaseRequest {
  action: string;
}

// Client Link Request
interface ClientLinkRequest extends BaseRequest {
  linkId: string;
  deliveryType: 'email' | 'sms';
  recipient: string;
  personalMessage?: string;
}

// Client Notification Request
interface ClientNotificationRequest extends BaseRequest {
  notificationId: string;
}

// PDF Export Request
interface PDFExportRequest extends BaseRequest {
  pdfBase64: string;
  email: string;
  subject: string;
  message?: string;
}

// SMS Request
interface SMSRequest extends BaseRequest {
  phoneNumber: string;
  message: string;
  pdfUrl: string;
}

// Initialize Supabase with environment variables
function initSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Validate personal message
function validatePersonalMessage(personalMessage?: string | null): void {
  const MAX_PERSONAL_MESSAGE_LENGTH = 150;
  if (personalMessage && personalMessage.length > MAX_PERSONAL_MESSAGE_LENGTH) {
    throw new Error(`Personal message must be ${MAX_PERSONAL_MESSAGE_LENGTH} characters or less`);
  }
}

// Generate client hub link
function generateClientHubLink(token: string, designerId: string): string {
  return `https://dezignsync.com/client-hub?clientToken=${token}&designerId=${designerId}`;
}

// Handle client link delivery
async function handleSendClientLink(request: ClientLinkRequest) {
  const supabase = initSupabaseClient();
  const { linkId, deliveryType, recipient, personalMessage } = request;
  
  if (!linkId || !deliveryType || !recipient) {
    throw new Error("Missing required parameters: linkId, deliveryType, and recipient are required");
  }
  
  // Validate personal message length
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
  
  return {
    success: true,
    message: `Client hub link sent via ${deliveryType}`,
    deliveryResult
  };
}

// Update delivery status in the database
async function updateDeliveryStatus(
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

// Sending client link via email
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
  
  // Use verified domain for from address
  const fromAddress = "noreply@dezignsync.com";
  const fromName = "DezignSync";
  
  // Send email using Resend with your verified domain
  const emailResponse = await resend.emails.send({
    from: `${fromName} <${fromAddress}>`,
    to: recipient,
    subject: `${clientName}, access your design project`,
    html: emailHtml,
  });
  
  console.log("Email sent successfully:", emailResponse);
  return emailResponse;
}

// Sending client link via SMS
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

// Handle sending client notification
async function handleSendClientNotification(request: ClientNotificationRequest) {
  const supabase = initSupabaseClient();
  const { notificationId } = request;

  if (!notificationId) {
    throw new Error('Missing required parameter: notificationId');
  }

  // Fetch the notification
  const { data: notification, error: fetchError } = await supabase
    .from('client_notifications')
    .select('*, projects(title, client_name, client_email)')
    .eq('id', notificationId)
    .eq('status', 'pending')
    .single();

  if (fetchError) {
    throw new Error(`Error fetching notification: ${fetchError.message}`);
  }

  if (!notification) {
    throw new Error('Notification not found or already processed');
  }

  // In a real implementation, you would send an email here using a service like Resend, SendGrid, etc.
  // For this demo, we'll just log the notification and update its status to 'sent'

  console.log('Sending notification to client:', {
    recipient: notification.client_email,
    subject: `Update on your project: ${notification.projects.title}`,
    message: notification.message
  });

  // Update notification status
  const { error: updateError } = await supabase
    .from('client_notifications')
    .update({ 
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .eq('id', notificationId);

  if (updateError) {
    throw new Error(`Error updating notification status: ${updateError.message}`);
  }

  return {
    success: true,
    message: `Notification sent to ${notification.client_email}`
  };
}

// Handle PDF export via email
async function handleSendPDFExport(request: PDFExportRequest) {
  const { pdfBase64, email, subject, message } = request;
  
  if (!pdfBase64 || !email || !subject) {
    throw new Error("Missing required parameters");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Initialize Resend for email
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    throw new Error("Resend API key not configured");
  }
  
  const resend = new Resend(resendApiKey);

  // Email the PDF
  const { data: emailData, error: emailError } = await resend.emails.send({
    from: "Design Brief <onboarding@resend.dev>",
    to: [email],
    subject: subject,
    html: `
      <div>
        <h1>Design Brief</h1>
        ${message ? `<p>${message}</p>` : ""}
        <p>Please find your design brief attached.</p>
        <p>Generated by DezignSync</p>
      </div>
    `,
    attachments: [
      {
        filename: "design-brief.pdf",
        content: pdfBase64,
        encoding: "base64",
      },
    ],
  });

  if (emailError) {
    console.error("Email error:", emailError);
    throw new Error("Failed to send email");
  }

  // Record the export in the database
  const supabase = initSupabaseClient();
  const authHeader = Deno.env.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (!userError && user) {
    await supabase.from("pdf_exports").insert({
      user_id: user.id,
      recipient_email: email,
      export_type: "email",
      status: "sent",
    });
  }

  return {
    success: true,
    message: "PDF sent successfully"
  };
}

// Handle sending SMS
async function handleSendSMS(request: SMSRequest) {
  const { phoneNumber, message, pdfUrl } = request;
  
  if (!phoneNumber || !pdfUrl) {
    throw new Error("Missing required parameters");
  }

  // Initialize Twilio with credentials
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");
  
  if (!accountSid || !authToken || !twilioPhone) {
    throw new Error("Twilio credentials not configured");
  }
  
  const client = new Twilio(accountSid, authToken);

  // Format phone number (ensure it has + prefix)
  let formattedPhone = phoneNumber;
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = `+${formattedPhone}`;
  }

  // Construct SMS message
  const smsBody = `${message} View your design brief here: ${pdfUrl}`;
  
  // Send SMS using Twilio
  const smsResponse = await client.messages.create({
    body: smsBody,
    from: twilioPhone,
    to: formattedPhone,
    statusCallback: `${Deno.env.get("SUPABASE_URL")}/functions/v1/update-sms-status`
  });

  // Record the SMS delivery
  const supabase = initSupabaseClient();
  const authHeader = Deno.env.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (!userError && user) {
    await supabase.from("pdf_exports").insert({
      user_id: user.id,
      recipient_phone: phoneNumber,
      export_type: "sms",
      status: "sent",
      message_sid: smsResponse.sid
    });
  }

  return {
    success: true,
    messageId: smsResponse.sid
  };
}

// Main handler
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body to determine the action
    const requestData = await req.json();
    const { action } = requestData as BaseRequest;

    if (!action) {
      throw new Error("Missing required parameter: action");
    }

    let result;

    // Route to the appropriate handler based on the action
    switch (action) {
      case "send-client-link":
        result = await handleSendClientLink(requestData as ClientLinkRequest);
        break;
      case "send-client-notification":
        result = await handleSendClientNotification(requestData as ClientNotificationRequest);
        break;
      case "send-pdf-export":
        result = await handleSendPDFExport(requestData as PDFExportRequest);
        break;
      case "send-sms":
        result = await handleSendSMS(requestData as SMSRequest);
        break;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error(`Error in notifications-api function:`, error);
    
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
