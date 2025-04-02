
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

// Maximum retry attempts for database operations
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

// Helper function to retry database operations with exponential backoff
async function retryOperation(operation, maxRetries = MAX_RETRY_ATTEMPTS) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Attempt the database operation
      const result = await operation();
      console.log(`Operation successful on attempt ${attempt + 1}`);
      return result;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      // Don't wait after the last attempt
      if (attempt < maxRetries - 1) {
        // Calculate delay with exponential backoff (1s, 2s, 4s, ...)
        const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt);
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting expired cache cleanup job");
    
    // Get current timestamp for metrics
    const startTime = Date.now();
    const batchSize = 100; // Process in batches to avoid timeouts
    let totalRemoved = 0;
    let hasMore = true;
    let lastId = null;
    
    while (hasMore) {
      // Delete expired cache entries in batches with retry logic
      const { data, error } = await retryOperation(async () => {
        let query = supabase
          .from('ai_content_cache')
          .delete()
          .lt('expires_at', new Date().toISOString())
          .select('id'); // Get IDs for count and pagination
        
        if (lastId) {
          query = query.gt('id', lastId);
        }
        
        return await query.limit(batchSize);
      });
      
      if (error) {
        console.error("Error in batch cleanup:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        totalRemoved += data.length;
        lastId = data[data.length - 1].id;
        console.log(`Removed batch of ${data.length} expired entries. Total so far: ${totalRemoved}`);
      } else {
        hasMore = false;
      }
      
      // Break if we've been running for more than 9 seconds (edge function timeout is 10s)
      if (Date.now() - startTime > 9000) {
        console.log("Approaching timeout, breaking batch processing");
        hasMore = false;
      }
    }
    
    // Record metrics for this cleanup job
    try {
      await supabase.from('ai_cleanup_metrics').insert({
        entries_removed: totalRemoved,
        duration_ms: Date.now() - startTime,
        success: true
      });
    } catch (metricsError) {
      console.error("Failed to record cleanup metrics:", metricsError);
      // Non-critical, continue without failing the function
    }
    
    console.log(`Cleanup complete. Removed ${totalRemoved} expired entries in ${Date.now() - startTime}ms.`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Cache cleanup successful", 
        entriesRemoved: totalRemoved,
        durationMs: Date.now() - startTime
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Failed to clean up expired cache:", error);
    
    // Record error metrics
    try {
      await supabase.from('ai_cleanup_metrics').insert({
        entries_removed: 0,
        duration_ms: 0,
        success: false,
        error_message: error.message
      });
    } catch (metricsError) {
      console.error("Failed to record error metrics:", metricsError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        errorDetails: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
