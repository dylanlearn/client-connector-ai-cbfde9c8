
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Twilio } from "https://esm.sh/twilio@4.14.0/lib/rest/Twilio.js";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Twilio with credentials
const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const authToken = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER") || "";
const twilio = new Twilio(accountSid, authToken);

interface RequestBody {
  phoneNumber: string;
  message: string;
  pdfUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { phoneNumber, message, pdfUrl }: RequestBody = await req.json();
    
    if (!phoneNumber || !pdfUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format phone number (ensure it has + prefix)
    let formattedPhone = phoneNumber;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    // Get the current authenticated user
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Authentication error" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Construct SMS message
    const smsBody = `${message} View your design brief here: ${pdfUrl}`;
    
    // Send SMS using Twilio
    const smsResponse = await twilio.messages.create({
      body: smsBody,
      from: twilioPhone,
      to: formattedPhone,
      statusCallback: `${supabaseUrl}/functions/v1/update-sms-status`
    });

    // Log the SMS delivery
    await supabase.from("pdf_exports").insert({
      user_id: user?.id,
      recipient_phone: phoneNumber,
      export_type: "sms",
      status: "sent",
      message_sid: smsResponse.sid
    });

    return new Response(
      JSON.stringify({ success: true, messageId: smsResponse.sid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-sms function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
