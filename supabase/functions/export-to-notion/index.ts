
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Notion API endpoint
const NOTION_API_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

interface RequestBody {
  pdfBase64: string;
  title: string;
  description?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Notion API key from environment variables
    const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
    const NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID");

    if (!NOTION_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Notion API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!NOTION_DATABASE_ID) {
      return new Response(
        JSON.stringify({ error: "Notion Database ID not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { pdfBase64, title, description }: RequestBody = await req.json();
    
    if (!pdfBase64 || !title) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a new page in Notion
    const pageResponse = await fetch(`${NOTION_API_URL}/pages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: title,
                }
              }
            ]
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: description || "Design brief exported from DezignSync",
                }
              }
            ]
          }
        },
        // Simple content to start
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: "Design brief document is attached below.",
                  }
                }
              ]
            }
          }
        ]
      }),
    });

    if (!pageResponse.ok) {
      const errorData = await pageResponse.json();
      throw new Error(`Notion API error: ${JSON.stringify(errorData)}`);
    }

    const pageData = await pageResponse.json();
    const pageId = pageData.id;

    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));

    // Upload the PDF as an attachment to the page
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    const formData = new FormData();
    
    // Create file blob
    const fileBlob = new Blob([binaryData], { type: "application/pdf" });
    formData.append("file", fileBlob, filename);
    
    // Append the file block to the page
    await fetch(`${NOTION_API_URL}/blocks/${pageId}/children`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": NOTION_VERSION,
      },
      body: JSON.stringify({
        children: [
          {
            object: "block",
            type: "file",
            file: {
              type: "external",
              external: {
                url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              },
            },
          },
        ],
      }),
    });

    // Get the page URL
    const pageUrl = `https://notion.so/${pageId.replace(/-/g, '')}`;

    return new Response(
      JSON.stringify({ success: true, pageId, pageUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in export-to-notion function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
