
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

// Define response headers for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Fetch the font
    const fontResponse = await fetch(url);
    if (!fontResponse.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch font: ${fontResponse.statusText}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const originalFontBuffer = await fontResponse.arrayBuffer();
    const originalSize = originalFontBuffer.byteLength;

    // Simulate font subsetting and optimization
    // In a real implementation, we would use a font subsetting library
    const compressionFactor = 0.5 + Math.random() * 0.2; // 50-70% of original
    const optimizedSize = Math.floor(originalSize * compressionFactor);
    
    // Placeholder for optimized URL - in a real implementation this would be the
    // URL of the actually optimized font stored in storage
    let optimizedUrl = url;
    
    // Extract font format
    const format = url.split('.').pop() || 'woff2';
    
    return new Response(
      JSON.stringify({
        url: optimizedUrl,
        originalSize,
        optimizedSize,
        format,
        metadata: {
          processedAt: new Date().toISOString(),
          subsetGlyphs: 'latin',
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
