
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Process tasks in batches
    let tasksProcessed = 0;
    const maxTasksToProcess = 5;

    // Get pending tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('wireframe_background_tasks')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(maxTasksToProcess);

    if (tasksError) {
      throw new Error(`Error fetching tasks: ${tasksError.message}`);
    }

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending tasks found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process each task
    const results = [];
    for (const task of tasks) {
      try {
        // Mark as processing
        await supabase
          .from('wireframe_background_tasks')
          .update({ status: 'processing' })
          .eq('id', task.id);

        // Process based on task type
        let outputData;
        if (task.task_type === 'optimize_wireframe') {
          // Example optimization - in a real scenario, this would be more complex
          const wireframeData = task.input_data;
          if (wireframeData) {
            // Basic optimization logic - add quality flags
            outputData = {
              ...wireframeData,
              qualityFlags: {
                ...(wireframeData.qualityFlags || {}),
                isOptimized: true,
                optimizationLevel: 'high',
                optimizedAt: new Date().toISOString()
              }
            };
          }
        }

        // Mark as completed
        await supabase
          .from('wireframe_background_tasks')
          .update({
            status: 'completed',
            output_data: outputData || null,
            completed_at: new Date().toISOString()
          })
          .eq('id', task.id);

        tasksProcessed++;
        results.push({
          id: task.id,
          status: 'completed',
          task_type: task.task_type
        });
      } catch (taskError) {
        console.error(`Error processing task ${task.id}:`, taskError);
        
        // Mark as failed
        await supabase
          .from('wireframe_background_tasks')
          .update({
            status: 'failed',
            error_message: taskError.message || 'Unknown error',
            completed_at: new Date().toISOString()
          })
          .eq('id', task.id);

        results.push({
          id: task.id,
          status: 'failed',
          error: taskError.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        processed: tasksProcessed,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-wireframe-tasks function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Unknown error occurred',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
