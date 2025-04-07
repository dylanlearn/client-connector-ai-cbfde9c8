
import { supabase } from "@/integrations/supabase/client";
import { ErrorHandlingConfig } from "../monitoring/error-config";
import { toast } from "sonner";

/**
 * Client for interacting with Supabase RPC functions
 */
export const RpcClient = {
  /**
   * Error handling configuration operations
   */
  errorConfig: {
    /**
     * Get error handling configuration for a specific component and error type
     */
    async get(component: string, errorType: string): Promise<ErrorHandlingConfig | null> {
      try {
        const { data, error } = await supabase.rpc('manage_error_config', {
          p_action: 'get',
          p_component: component,
          p_error_type: errorType
        });
        
        if (error) {
          console.error('Error fetching error handling config:', error);
          return null;
        }
        
        if (data?.config) {
          return data.config as ErrorHandlingConfig;
        }
        
        return null;
      } catch (error) {
        console.error('Failed to get error handling config:', error);
        return null;
      }
    },

    /**
     * Update or create error handling configuration
     */
    async upsert(config: ErrorHandlingConfig): Promise<boolean> {
      try {
        const { data, error } = await supabase.rpc('manage_error_config', {
          p_action: 'upsert',
          p_config: config
        });
        
        if (error) {
          console.error('Error updating error handling config:', error);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Failed to upsert error handling config:', error);
        return false;
      }
    },

    /**
     * List error handling configurations, optionally filtered by component
     */
    async list(component?: string): Promise<ErrorHandlingConfig[]> {
      try {
        const { data, error } = await supabase.rpc('manage_error_config', {
          p_action: 'list',
          p_component: component
        });
        
        if (error) {
          console.error('Error listing error handling configs:', error);
          return [];
        }
        
        return data?.configs || [];
      } catch (error) {
        console.error('Failed to list error handling configs:', error);
        return [];
      }
    },

    /**
     * Delete an error handling configuration
     */
    async delete(configId: string): Promise<boolean> {
      try {
        const { data, error } = await supabase.rpc('manage_error_config', {
          p_action: 'delete',
          p_config: { id: configId }
        });
        
        if (error) {
          console.error('Error deleting error handling config:', error);
          return false;
        }
        
        return data?.deleted || false;
      } catch (error) {
        console.error('Failed to delete error handling config:', error);
        return false;
      }
    }
  },

  /**
   * Design memory operations
   */
  designMemory: {
    /**
     * Store or update design memory
     */
    async store(userId: string, projectId: string, data: any): Promise<any> {
      try {
        const { data: result, error } = await supabase.rpc('manage_wireframe_design_memory', {
          p_action: 'store',
          p_user_id: userId,
          p_data: {
            projectId,
            ...data
          }
        });
        
        if (error) {
          console.error('Error storing design memory:', error);
          return null;
        }
        
        return result?.data;
      } catch (error) {
        console.error('Failed to store design memory:', error);
        return null;
      }
    },

    /**
     * Retrieve design memories for a user, optionally filtered by project
     */
    async retrieve(userId: string, projectId?: string): Promise<any> {
      try {
        const { data: result, error } = await supabase.rpc('manage_wireframe_design_memory', {
          p_action: 'retrieve',
          p_user_id: userId,
          p_data: projectId ? { projectId } : {}
        });
        
        if (error) {
          console.error('Error retrieving design memory:', error);
          return null;
        }
        
        return result?.data;
      } catch (error) {
        console.error('Failed to retrieve design memory:', error);
        return null;
      }
    },

    /**
     * Update an existing design memory
     */
    async update(userId: string, memoryId: string, updates: any): Promise<any> {
      try {
        const { data: result, error } = await supabase.rpc('manage_wireframe_design_memory', {
          p_action: 'update',
          p_user_id: userId,
          p_data: {
            memoryId,
            updates
          }
        });
        
        if (error) {
          console.error('Error updating design memory:', error);
          return null;
        }
        
        return result?.data;
      } catch (error) {
        console.error('Failed to update design memory:', error);
        return null;
      }
    }
  },

  /**
   * Feedback analysis operations
   */
  feedbackAnalysis: {
    /**
     * Store feedback analysis results
     */
    async store(data: any): Promise<string | null> {
      try {
        const { data: result, error } = await supabase.rpc('manage_feedback_analysis', {
          p_action: 'store',
          p_data: data
        });
        
        if (error) {
          console.error('Error storing feedback analysis:', error);
          return null;
        }
        
        return result?.id;
      } catch (error) {
        console.error('Failed to store feedback analysis:', error);
        return null;
      }
    },

    /**
     * List feedback analyses with optional filters
     */
    async list(filters?: {
      status?: string,
      priority?: 'high' | 'medium' | 'low',
      userId?: string,
      projectId?: string,
      category?: string,
      limit?: number
    }): Promise<any[]> {
      try {
        const { data: result, error } = await supabase.rpc('manage_feedback_analysis', {
          p_action: 'list',
          p_data: filters
        });
        
        if (error) {
          console.error('Error listing feedback analyses:', error);
          return [];
        }
        
        return result?.analyses || [];
      } catch (error) {
        console.error('Failed to list feedback analyses:', error);
        return [];
      }
    },

    /**
     * Update feedback status
     */
    async updateStatus(id: string, status: string): Promise<boolean> {
      try {
        const { data: result, error } = await supabase.rpc('manage_feedback_analysis', {
          p_action: 'update_status',
          p_data: { id, status }
        });
        
        if (error) {
          console.error('Error updating feedback status:', error);
          return false;
        }
        
        return result?.success || false;
      } catch (error) {
        console.error('Failed to update feedback status:', error);
        return false;
      }
    },

    /**
     * Update feedback priority
     */
    async updatePriority(id: string, priority: 'high' | 'medium' | 'low'): Promise<boolean> {
      try {
        const { data: result, error } = await supabase.rpc('manage_feedback_analysis', {
          p_action: 'update_priority',
          p_data: { id, priority }
        });
        
        if (error) {
          console.error('Error updating feedback priority:', error);
          return false;
        }
        
        return result?.success || false;
      } catch (error) {
        console.error('Failed to update feedback priority:', error);
        return false;
      }
    }
  },

  /**
   * Interaction analytics operations
   */
  interactionAnalytics: {
    /**
     * Analyze interaction patterns
     */
    async analyzePatterns(
      userId: string,
      eventType?: string,
      pageUrl?: string,
      limit: number = 1000
    ): Promise<any> {
      try {
        const { data, error } = await supabase.rpc('analyze_interaction_patterns', {
          p_user_id: userId,
          p_event_type: eventType,
          p_page_url: pageUrl,
          p_limit: limit
        });
        
        if (error) {
          console.error('Error analyzing interaction patterns:', error);
          return { insights: [], hotspots: [], patterns: [] };
        }
        
        return data || { insights: [], hotspots: [], patterns: [] };
      } catch (error) {
        console.error('Error analyzing interaction patterns:', error);
        return { insights: [], hotspots: [], patterns: [] };
      }
    }
  }
};
