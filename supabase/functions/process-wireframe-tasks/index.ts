
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, BackgroundTask, TaskProcessingResult, ProcessingResponse } from "./types.ts";
import { supabase } from "../_shared/supabase-client.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Check authorization (JWT verification is configured in config.toml)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get processing parameters
    const params = await req.json();
    const maxTasks = params.maxTasks || 5;
    const taskType = params.taskType || null;
    
    // Get pending tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('wireframe_background_tasks')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(maxTasks);

    if (tasksError) {
      throw new Error(`Error fetching tasks: ${tasksError.message}`);
    }

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, results: [] }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const results: TaskProcessingResult[] = [];

    // Process each task
    for (const task of tasks as BackgroundTask[]) {
      // Mark task as processing
      await supabase
        .from('wireframe_background_tasks')
        .update({ status: 'processing' })
        .eq('id', task.id);
      
      try {
        // Process based on task type
        let output_data = {};
        
        // Different task type handlers
        if (task.task_type === 'optimize_wireframe') {
          output_data = await processOptimizeWireframeTask(task);
        } else if (task.task_type === 'generate_variants') {
          output_data = await processGenerateVariantsTask(task);
        } else if (task.task_type === 'analyze_sections') {
          output_data = await processAnalyzeSectionsTask(task);
        }
        
        // Mark task as completed
        await supabase
          .from('wireframe_background_tasks')
          .update({ 
            status: 'completed', 
            completed_at: new Date().toISOString(),
            output_data 
          })
          .eq('id', task.id);
        
        results.push({
          id: task.id,
          status: 'completed',
          task_type: task.task_type
        });
      } catch (error) {
        // Mark task as failed
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error processing task ${task.id}:`, errorMessage);
        
        await supabase
          .from('wireframe_background_tasks')
          .update({ 
            status: 'failed', 
            completed_at: new Date().toISOString(),
            error_message: errorMessage
          })
          .eq('id', task.id);
        
        results.push({
          id: task.id,
          status: 'failed',
          task_type: task.task_type,
          error: errorMessage
        });
      }
    }

    const response: ProcessingResponse = {
      processed: results.length,
      results
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in process-wireframe-tasks:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Task processors
async function processOptimizeWireframeTask(task: BackgroundTask): Promise<Record<string, any>> {
  const wireframeData = task.input_data.wireframeData;
  
  // Improve the quality flags
  const qualityFlags = wireframeData.qualityFlags || {};
  
  // Set optimized flag to true
  const improvedQualityFlags = {
    ...qualityFlags,
    optimized: true,
    optimizationDate: new Date().toISOString()
  };
  
  // Return the optimized wireframe data
  return {
    original: wireframeData,
    improved: {
      ...wireframeData,
      qualityFlags: improvedQualityFlags
    }
  };
}

async function processGenerateVariantsTask(task: BackgroundTask): Promise<Record<string, any>> {
  // Would normally call an AI model to generate variants
  // Simplified implementation
  return {
    variantsGenerated: true,
    timestamp: new Date().toISOString()
  };
}

async function processAnalyzeSectionsTask(task: BackgroundTask): Promise<Record<string, any>> {
  // Would normally analyze sections for patterns and improvements
  // Simplified implementation
  return {
    analysisComplete: true,
    timestamp: new Date().toISOString()
  };
}
