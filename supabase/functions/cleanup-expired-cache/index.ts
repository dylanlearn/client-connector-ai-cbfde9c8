
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
    
    // Cleanup different cache tables based on their structure
    // First try wireframe_cache which has expires_at
    let entriesRemoved = 0;
    
    try {
      // Delete expired entries from wireframe_cache
      const { data: wireframeCache, error: wireframeCacheError } = await supabaseClient
        .from('wireframe_cache')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('count');
        
      if (!wireframeCacheError && wireframeCache) {
        entriesRemoved += wireframeCache.length;
      }
    } catch (err) {
      console.log('No wireframe_cache table or error accessing it:', err);
    }
    
    try {
      // Delete expired entries from ai_content_cache
      const { data: contentCache, error: contentCacheError } = await supabaseClient
        .from('ai_content_cache')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('count');
        
      if (!contentCacheError && contentCache) {
        entriesRemoved += contentCache.length;
      }
    } catch (err) {
      console.log('No ai_content_cache table or error accessing it:', err);
    }
    
    // Log the cleanup operation
    await supabaseClient
      .from('system_monitoring')
      .insert({
        event_type: 'cache_cleanup',
        component: 'database',
        status: 'normal',
        message: `Removed ${entriesRemoved} expired cache entries`,
        metadata: { entriesRemoved }
      });
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        entriesRemoved,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error during cache cleanup:`, error);
    
    // Try to log the error
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      
      await supabaseClient
        .from('system_monitoring')
        .insert({
          event_type: 'cache_cleanup_error',
          component: 'database',
          status: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
    } catch (logError) {
      console.error('Failed to log cache cleanup error:', logError);
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
