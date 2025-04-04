
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BackgroundTask {
  id: string;
  task_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  input_data: any;
  output_data?: any;
  error_message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { maxTasks = 5, specificTaskId = null } = await req.json();

    let processedTasks = 0;
    const startTime = Date.now();

    // If a specific task ID is provided, try to process just that task
    if (specificTaskId) {
      const { data: taskData, error: taskError } = await supabase
        .from('wireframe_background_tasks')
        .select('*')
        .eq('id', specificTaskId)
        .single();

      if (taskError || !taskData) {
        return new Response(
          JSON.stringify({ error: `Task with ID ${specificTaskId} not found` }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Process the specific task
      const result = await processTask(supabase, taskData as BackgroundTask);
      processedTasks = result ? 1 : 0;
    } else {
      // Process up to maxTasks pending tasks
      for (let i = 0; i < maxTasks; i++) {
        // Get the next pending task
        const { data: nextTask, error: fetchError } = await supabase
          .from('wireframe_background_tasks')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: true })
          .limit(1)
          .single();
          
        if (fetchError || !nextTask) {
          break; // No more pending tasks
        }
        
        // Process this task
        const result = await processTask(supabase, nextTask as BackgroundTask);
        if (result) {
          processedTasks++;
        }
      }
    }

    const processingTime = Date.now() - startTime;

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        tasksProcessed: processedTasks,
        processingTimeMs: processingTime
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in process-wireframe-tasks function:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

/**
 * Process a single background task
 */
async function processTask(supabase: any, task: BackgroundTask): Promise<boolean> {
  try {
    // Mark task as processing
    await supabase
      .from('wireframe_background_tasks')
      .update({ status: 'processing' })
      .eq('id', task.id);
    
    // Process the task based on its type
    let outputData: any;
    let errorMessage: string | undefined;
    let status: 'completed' | 'failed' = 'completed';
    
    try {
      switch (task.task_type) {
        case 'optimize_wireframe':
          outputData = await optimizeWireframe(task.input_data);
          break;
          
        case 'generate_assets':
          outputData = await generateAssets(task.input_data);
          break;
          
        case 'clean_cache':
          outputData = await cleanCache(supabase);
          break;
          
        default:
          throw new Error(`Unknown task type: ${task.task_type}`);
      }
    } catch (processingError) {
      // Set task to failed status
      status = 'failed';
      errorMessage = processingError instanceof Error ? processingError.message : 'Unknown error';
      console.error(`Error processing task ${task.id} (${task.task_type}):`, processingError);
    }
    
    // Update the task with the result
    await supabase
      .from('wireframe_background_tasks')
      .update({ 
        status,
        output_data: outputData || null,
        error_message: errorMessage,
        completed_at: new Date().toISOString()
      })
      .eq('id', task.id);
    
    return true;
  } catch (error) {
    console.error(`Error handling task ${task.id}:`, error);
    
    // Make sure the task is marked as failed
    try {
      await supabase
        .from('wireframe_background_tasks')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', task.id);
    } catch (updateError) {
      console.error(`Failed to update task ${task.id} status:`, updateError);
    }
    
    return false;
  }
}

/**
 * Example task handler: Optimize wireframe
 */
async function optimizeWireframe(wireframeData: any): Promise<any> {
  // This is a placeholder - would normally perform optimization
  // In a real implementation, you might:
  // 1. Analyze the wireframe structure for improvements
  // 2. Optimize image sizes
  // 3. Run accessibility checks
  // 4. Generate additional variants
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    optimized: true,
    optimizationTimestamp: new Date().toISOString(),
    improvementsSuggested: 3,
    originalSectionsCount: wireframeData.sections?.length || 0
  };
}

/**
 * Example task handler: Generate assets based on wireframe
 */
async function generateAssets(input: { wireframeId: string }): Promise<any> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Placeholder for asset generation logic
  return {
    generatedAssets: true,
    assetCount: 5,
    wireframeId: input.wireframeId,
    assetTypes: ['icon', 'image', 'svg', 'illustration', 'pattern']
  };
}

/**
 * Example task handler: Clean expired cache
 */
async function cleanCache(supabase: any): Promise<any> {
  try {
    const now = new Date().toISOString();
    
    // Delete expired entries
    const { data, error } = await supabase
      .from('wireframe_cache')
      .delete()
      .lt('expires_at', now)
      .select('id');
    
    if (error) throw error;
    
    return {
      entriesRemoved: data?.length || 0,
      timestamp: now
    };
  } catch (error) {
    console.error('Error cleaning cache:', error);
    throw error;
  }
}
