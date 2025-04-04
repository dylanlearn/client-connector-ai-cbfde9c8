
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
import { BackgroundTask, TaskProcessingResult, ProcessingResponse } from './types.ts';

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
    const requestData = await req.json();
    const operation = requestData.operation;

    // Operations router
    switch (operation) {
      case 'create_task':
        return await createTask(supabase, requestData);
      
      case 'update_task':
        return await updateTaskStatus(supabase, requestData);
      
      case 'get_next_task':
        return await getNextPendingTask(supabase);
      
      case 'process_tasks':
        return await processTasks(supabase, requestData);
      
      case 'get_metrics':
        return await getWireframeMetrics(supabase, requestData);
      
      case 'analyze_sections':
        return await analyzeSectionTypes(supabase, requestData);
      
      case 'check_cache':
        return await checkWireframeCache(supabase, requestData);
      
      case 'increment_cache_hit':
        return await incrementCacheHit(supabase, requestData);
      
      case 'store_in_cache':
        return await storeWireframeInCache(supabase, requestData);
      
      case 'clear_expired_cache':
        return await clearExpiredCache(supabase);
      
      case 'check_rate_limits':
        return await checkRateLimits(supabase, requestData);
      
      case 'record_generation':
        return await recordGeneration(supabase, requestData);
      
      case 'record_event':
        return await recordSystemEvent(supabase, requestData);
      
      default:
        return new Response(
          JSON.stringify({ error: `Unknown operation: ${operation}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in process-wireframe-tasks function:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Task creation operation
async function createTask(supabase: any, data: any) {
  const { task_type, input_data } = data;
  
  const { data: taskId, error } = await supabase.rpc(
    'create_background_task',
    {
      p_task_type: task_type,
      p_input_data: input_data
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true, taskId }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Task status update operation
async function updateTaskStatus(supabase: any, data: any) {
  const { task_id, status, output_data, error_message } = data;
  
  const { error } = await supabase.rpc(
    'update_background_task_status',
    {
      p_task_id: task_id,
      p_status: status,
      p_output_data: output_data || null,
      p_error_message: error_message || null
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Get next pending task operation
async function getNextPendingTask(supabase: any) {
  const { data, error } = await supabase.rpc('get_next_pending_task');
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true, task: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Process tasks in batch
async function processTasks(supabase: any, data: any) {
  let tasksProcessed = 0;
  const maxTasksToProcess = data.max_tasks || 5;
  const results: TaskProcessingResult[] = [];

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
      JSON.stringify({ message: 'No pending tasks found', processed: 0, results: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Process each task
  for (const task of tasks as BackgroundTask[]) {
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
              optimized: true,
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
          error_message: taskError instanceof Error ? taskError.message : 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', task.id);

      results.push({
        id: task.id,
        status: 'failed',
        task_type: task.task_type,
        error: taskError instanceof Error ? taskError.message : 'Unknown error'
      });
    }
  }

  const response: ProcessingResponse = {
    processed: tasksProcessed,
    results
  };

  return new Response(
    JSON.stringify(response),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Get wireframe metrics
async function getWireframeMetrics(supabase: any, data: any) {
  const { start_date, project_id } = data;
  
  const { data: metrics, error } = await supabase.rpc(
    'get_wireframe_metrics',
    {
      p_start_date: start_date,
      p_project_id: project_id || null
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true, metrics }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Analyze section types
async function analyzeSectionTypes(supabase: any, data: any) {
  const { start_date } = data;
  
  const { data: sections, error } = await supabase.rpc(
    'analyze_wireframe_sections',
    {
      p_start_date: start_date
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true, sections }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Check wireframe cache
async function checkWireframeCache(supabase: any, data: any) {
  const { params_hash } = data;
  
  const { data: wireframe, error } = await supabase.rpc(
    'check_wireframe_cache',
    {
      p_params_hash: params_hash
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true, wireframe }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Increment cache hit
async function incrementCacheHit(supabase: any, data: any) {
  const { cache_id } = data;
  
  const { error } = await supabase.rpc(
    'increment_cache_hit',
    {
      p_cache_id: cache_id
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Store wireframe in cache
async function storeWireframeInCache(supabase: any, data: any) {
  const { params_hash, wireframe_data, expires_at, generation_params } = data;
  
  const { error } = await supabase.rpc(
    'store_wireframe_in_cache',
    {
      p_params_hash: params_hash,
      p_wireframe_data: wireframe_data,
      p_expires_at: expires_at,
      p_generation_params: generation_params
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Clear expired cache
async function clearExpiredCache(supabase: any) {
  const { data: removed, error } = await supabase.rpc('clear_expired_wireframe_cache');
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true, removed }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Check rate limits
async function checkRateLimits(supabase: any, data: any) {
  const { user_id, max_daily, max_hourly } = data;
  
  const { data: limits, error } = await supabase.rpc(
    'check_wireframe_rate_limits',
    {
      p_user_id: user_id,
      p_max_daily: max_daily,
      p_max_hourly: max_hourly
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true, ...limits }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Record generation for rate limiting
async function recordGeneration(supabase: any, data: any) {
  const { user_id } = data;
  
  const { error } = await supabase.rpc(
    'record_wireframe_generation',
    {
      p_user_id: user_id
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Record system event
async function recordSystemEvent(supabase: any, data: any) {
  const { event_type, details, severity } = data;
  
  const { error } = await supabase.rpc(
    'record_system_event',
    {
      p_event_type: event_type,
      p_details: details,
      p_severity: severity || 'info'
    }
  );
  
  if (error) throw error;
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
