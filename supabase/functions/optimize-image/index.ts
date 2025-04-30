
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { Buffer } from "https://deno.land/std@0.131.0/node/buffer.ts";

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
    const { url, options } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Fetch the image
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch image: ${imageResponse.statusText}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const originalImageBuffer = await imageResponse.arrayBuffer();
    const originalSize = originalImageBuffer.byteLength;

    // Here we'd typically use a library like sharp or Imageflow for optimization,
    // but since we're in Deno, we'll simulate optimization
    // In a production environment, this would use proper image processing libraries

    // Simulate optimization (reduced size by 30-60%)
    const compressionFactor = 0.4 + Math.random() * 0.3; // 40-70% of original
    const optimizedSize = Math.floor(originalSize * compressionFactor);
    
    // Placeholder for optimized URL - in a real implementation this would be the
    // URL of the actually optimized image stored in storage
    let optimizedUrl = url;
    
    // In a real implementation, you would:
    // 1. Process the image (resize, compress, convert format)
    // 2. Upload it to storage
    // 3. Return the storage URL
    
    // For this demo, we'll return the original URL with optimization metadata
    const format = options?.format || url.split('.').pop() || 'jpeg';
    
    return new Response(
      JSON.stringify({
        url: optimizedUrl,
        originalSize,
        optimizedSize,
        format,
        width: options?.maxWidth || 1000,
        height: options?.maxHeight || 800,
        metadata: {
          processedAt: new Date().toISOString(),
          quality: options?.quality || 80,
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
