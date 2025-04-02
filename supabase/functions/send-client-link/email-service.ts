
import { Resend } from "https://esm.sh/resend@1.0.0";

/**
 * Send client link via email
 * @param recipient Email recipient
 * @param clientName Client name
 * @param clientHubLink The generated client hub link
 * @param personalMessage Optional personal message
 * @returns Email send response
 */
export async function sendEmail(
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
  
  // Send email using Resend with your verified domain
  const emailResponse = await resend.emails.send({
    from: "DezignRoom <owner@dezignroom.org>",
    to: recipient,
    subject: `${clientName}, access your design project`,
    html: emailHtml,
  });
  
  console.log("Email sent successfully:", emailResponse);
  return emailResponse;
}
