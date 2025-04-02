
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleHeatmapRequest } from "./handlers.ts";
import { corsHeaders } from "./cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await handleHeatmapRequest(req);
  } catch (error) {
    console.error("Error in get-heatmap-data function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
