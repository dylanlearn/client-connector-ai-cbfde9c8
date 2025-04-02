
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  pdfBase64: string;
  title: string;
  channel?: string;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Slack API token from environment variables
    const SLACK_API_TOKEN = Deno.env.get("SLACK_API_TOKEN");
    const DEFAULT_SLACK_CHANNEL = Deno.env.get("DEFAULT_SLACK_CHANNEL");

    if (!SLACK_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: "Slack API token not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { pdfBase64, title, channel, message }: RequestBody = await req.json();
    
    if (!pdfBase64 || !title) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Set the channel to use
    const targetChannel = channel || DEFAULT_SLACK_CHANNEL || "general";

    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    
    // Prepare file upload
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    const fileBlob = new Blob([binaryData], { type: "application/pdf" });
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", fileBlob, filename);
    formData.append("channels", targetChannel);
    
    if (message) {
      formData.append("initial_comment", message);
    } else {
      formData.append("initial_comment", `Here's the design brief: ${title}`);
    }
    
    formData.append("title", title);

    // Upload the file to Slack
    const slackResponse = await fetch("https://slack.com/api/files.upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SLACK_API_TOKEN}`,
      },
      body: formData,
    });

    if (!slackResponse.ok) {
      throw new Error(`Slack API error: ${slackResponse.statusText}`);
    }

    const slackData = await slackResponse.json();
    
    if (!slackData.ok) {
      throw new Error(`Slack API error: ${slackData.error}`);
    }

    return new Response(
      JSON.stringify({ success: true, channel: targetChannel }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in export-to-slack function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
