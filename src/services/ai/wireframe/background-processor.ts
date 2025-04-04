
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BackgroundProcessingTask {
  id: string;
  task_type: string;
  status: string;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

/**
 * Service for handling background tasks for wireframe processing
 * Using edge functions for reliable processing
 */
export const WireframeBackgroundProcessor = {
  /**
   * Queue a task for background processing
   */
  queueTask: async (taskType: string, inputData: Record<string, any>): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("process-wireframe-tasks", {
        body: {
          operation: "create_task",
          task_type: taskType,
          input_data: inputData
        }
      });
      
      if (error) {
        console.error('Error queuing background task:', error);
        return null;
      }
      
      return data?.taskId || null;
    } catch (error) {
      console.error('Exception in queueTask:', error);
      return null;
    }
  },
  
  /**
   * Update the status of a background task
   */
  updateTaskStatus: async (
    taskId: string, 
    status: 'processing' | 'completed' | 'failed',
    outputData?: Record<string, any>,
    errorMessage?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke("process-wireframe-tasks", {
        body: {
          operation: "update_task",
          task_id: taskId,
          status,
          output_data: outputData,
          error_message: errorMessage
        }
      });
      
      if (error) {
        console.error('Error updating task status:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception in updateTaskStatus:', error);
      return false;
    }
  },
  
  /**
   * Process the next pending task
   */
  processNextTask: async (): Promise<boolean> => {
    try {
      // Get the next pending task
      const { data, error } = await supabase.functions.invoke("process-wireframe-tasks", {
        body: {
          operation: "get_next_task"
        }
      });
      
      if (error) {
        console.error('Error getting next task:', error);
        return false;
      }
      
      if (!data || !data.task) {
        console.log('No pending tasks found');
        return false;
      }
      
      const task = data.task as BackgroundProcessingTask;
      
      // Mark the task as processing
      await WireframeBackgroundProcessor.updateTaskStatus(task.id, 'processing');
      
      // Process the task based on its type
      let result: Record<string, any> | null = null;
      let success = false;
      let errorMessage = '';
      
      try {
        // Task-specific processing logic
        switch (task.task_type) {
          case 'optimize_wireframe':
            result = await WireframeBackgroundProcessor._optimizeWireframe(task.input_data);
            success = true;
            break;
          // Add more task types as needed
          default:
            errorMessage = `Unknown task type: ${task.task_type}`;
            break;
        }
      } catch (processingError: any) {
        errorMessage = processingError.message || 'Error processing task';
        console.error(`Error processing task ${task.id}:`, processingError);
      }
      
      // Update the task status based on the processing result
      if (success && result) {
        await WireframeBackgroundProcessor.updateTaskStatus(task.id, 'completed', result);
      } else {
        await WireframeBackgroundProcessor.updateTaskStatus(task.id, 'failed', undefined, errorMessage);
      }
      
      return true;
    } catch (error) {
      console.error('Exception in processNextTask:', error);
      return false;
    }
  },
  
  /**
   * Private method to optimize a wireframe
   */
  _optimizeWireframe: async (wireframeData: any): Promise<Record<string, any>> => {
    // Example optimization logic - in reality, this would be more complex
    // and might involve calling external AI services
    
    // Add quality optimizations
    const optimized = {
      ...wireframeData,
      qualityFlags: {
        ...(wireframeData.qualityFlags || {}),
        optimized: true,
        optimizationLevel: 'high',
        optimizationTimestamp: new Date().toISOString()
      }
    };
    
    // Simulated processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return optimized;
  }
};
