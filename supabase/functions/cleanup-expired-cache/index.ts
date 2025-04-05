
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
    console.log("Cache cleanup function triggered");
    
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Define the cleanup operations to perform
    const cleanupOperations = [
      // Clean ai_content_cache
      {
        name: 'ai_content_cache',
        query: `DELETE FROM ai_content_cache WHERE expires_at < NOW()`
      },
      // Clean wireframe_cache
      {
        name: 'wireframe_cache',
        query: `DELETE FROM wireframe_cache WHERE expires_at < NOW()`
      },
      // Clean rate_limit_counters (older than 7 days)
      {
        name: 'rate_limit_counters',
        query: `DELETE FROM rate_limit_counters WHERE created_at < NOW() - INTERVAL '7 days'`
      }
    ];
    
    let totalEntriesRemoved = 0;
    const results = [];
    
    // Execute each cleanup operation
    for (const op of cleanupOperations) {
      try {
        console.log(`Executing cleanup for ${op.name}: ${op.query}`);
        
        // Execute the deletion query and count removed rows
        const { data, error, count } = await supabaseClient
          .from(op.name)
          .delete({ count: 'exact' })
          .lt('expires_at', new Date().toISOString());
        
        if (error) {
          console.error(`Error cleaning up ${op.name}:`, error);
          results.push({
            table: op.name,
            success: false,
            error: error.message
          });
          continue;
        }
        
        console.log(`Removed ${count} expired entries from ${op.name}`);
        
        totalEntriesRemoved += count || 0;
        results.push({
          table: op.name,
          success: true,
          entriesRemoved: count
        });
      } catch (opError) {
        console.error(`Error in cleanup operation for ${op.name}:`, opError);
        results.push({
          table: op.name,
          success: false,
          error: opError.message
        });
      }
    }
    
    // Record the cleanup metrics
    try {
      await supabaseClient.from('ai_cleanup_metrics').insert({
        success: true,
        duration_ms: 0, // We don't track duration yet
        entries_removed: totalEntriesRemoved
      });
    } catch (metricError) {
      console.error('Failed to record cleanup metrics:', metricError);
    }
    
    // Log the cleanup operation in system monitoring
    try {
      await supabaseClient.from('system_monitoring').insert({
        event_type: 'cache_cleanup',
        component: 'database',
        status: 'normal',
        message: `Removed ${totalEntriesRemoved} expired entries from cache tables`,
        metadata: { results }
      });
    } catch (logError) {
      console.error('Failed to log cleanup operation:', logError);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        entriesRemoved: totalEntriesRemoved,
        details: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Error during cache cleanup:', error);
    
    // Try to log the error
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      
      await supabaseClient.from('system_monitoring').insert({
        event_type: 'cache_cleanup_error',
        component: 'database',
        status: 'error',
        message: error instanceof Error ? error.message : String(error)
      });
      
    } catch (logError) {
      console.error('Failed to log cleanup error:', logError);
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 even for errors to prevent function client from throwing
      }
    );
  }
});
