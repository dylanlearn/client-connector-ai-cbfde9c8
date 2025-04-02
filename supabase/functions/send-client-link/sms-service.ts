
import { Twilio } from "https://esm.sh/twilio@4.14.0/lib/rest/Twilio.js";

/**
 * Send client link via SMS
 * @param recipient Phone number recipient
 * @param clientName Client name
 * @param clientHubLink The generated client hub link
 * @param personalMessage Optional personal message
 * @returns SMS send response
 */
export async function sendSMS(
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
