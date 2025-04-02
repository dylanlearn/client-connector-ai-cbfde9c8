
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Setup Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting expired cache cleanup job");
    
    // Delete expired cache entries
    const { data, error } = await supabase
      .from('ai_content_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (error) {
      console.error("Error cleaning up cache:", error);
      throw error;
    }
    
    console.log(`Cleanup complete. Removed ${data?.length || 0} expired entries.`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Cache cleanup successful", 
        entriesRemoved: data?.length || 0 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Failed to clean up expired cache:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
