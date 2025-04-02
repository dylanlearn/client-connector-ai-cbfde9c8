
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

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
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const startTime = Date.now();
    
    // First, get the count of expired cache entries
    const { count: expiredCount, error: countError } = await supabaseClient
      .from('ai_content_cache')
      .select('id', { count: 'exact', head: true })
      .lt('expires_at', new Date().toISOString());
    
    if (countError) {
      throw new Error(`Error counting expired cache entries: ${countError.message}`);
    }
    
    // Delete the expired cache entries
    const { error: deleteError } = await supabaseClient
      .from('ai_content_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (deleteError) {
      throw new Error(`Error deleting expired cache entries: ${deleteError.message}`);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log the cleanup operation
    await supabaseClient
      .from('ai_cleanup_metrics')
      .insert({
        entries_removed: expiredCount || 0,
        duration_ms: duration,
        success: true
      });
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        entriesRemoved: expiredCount,
        duration: duration
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
    
    // Try to log the error
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      
      await supabaseClient
        .from('ai_cleanup_metrics')
        .insert({
          entries_removed: 0,
          duration_ms: 0,
          success: false,
          error_message: error instanceof Error ? error.message : String(error)
        });
    } catch (logError) {
      console.error('Failed to log cleanup error:', logError);
    }
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
