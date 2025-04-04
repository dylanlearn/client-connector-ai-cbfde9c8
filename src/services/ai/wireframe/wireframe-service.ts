import { supabase } from "@/integrations/supabase/client";
import { WireframeCacheService } from "./wireframe-cache-service";
import { WireframeRateLimiterService } from "./rate-limiter-service";
import { WireframeBackgroundProcessor } from "./background-processor";
import { WireframeMonitoringService } from "./monitoring-service";
import { WireframeApiService } from "./wireframe-api";
import {
  WireframeData,
  WireframeSection,
  WireframeGenerationParams,
  WireframeGenerationResult,
  AIWireframe
} from "./wireframe-types";

// Re-export the types
export type {
  WireframeData,
  WireframeSection,
  WireframeGenerationParams,
  WireframeGenerationResult,
  AIWireframe
};

/**
 * Service for AI-powered wireframe generation and management
 */
export const WireframeService = {
  /**
   * Generate a wireframe using AI based on a prompt and parameters
   */
  generateWireframe: async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
    try {
      // Track start time for performance monitoring
      const startTime = performance.now();
      
      // Check rate limits first
      const userRole = await WireframeService.getUserRole(params.projectId);
      const rateLimitStatus = await WireframeRateLimiterService.checkRateLimit(params.projectId, userRole);
      
      if (rateLimitStatus.isRateLimited) {
        throw new Error(`Rate limit exceeded. You can generate ${rateLimitStatus.dailyRemaining} more wireframes today. Resets at ${rateLimitStatus.resetTime.toLocaleTimeString()}`);
      }
      
      // Check cache for similar wireframe
      const cachedWireframe = await WireframeCacheService.checkCache(params);
      if (cachedWireframe) {
        // If found in cache, return immediately
        const endTime = performance.now();
        const generationTime = (endTime - startTime) / 1000;
        
        // Record cache hit for analytics
        WireframeMonitoringService.recordEvent('wireframe_cache_hit', {
          projectId: params.projectId,
          generationTime
        });
        
        return {
          wireframe: cachedWireframe,
          generationTime,
          success: true
        };
      }
      
      // If not in cache, generate from OpenAI via the edge function
      const wireframeResult = await WireframeApiService.generateWireframe(params);
      const wireframeData = wireframeResult.wireframe;
      
      // Store the generated wireframe in the database
      try {
        const savedWireframe = await WireframeApiService.saveWireframe(
          params.projectId, 
          params.prompt, 
          wireframeData,
          params,
          wireframeResult.model || 'default'
        );
        
        // Save design tokens if available
        if (wireframeData.designTokens) {
          try {
            // Instead of RPC, directly insert into the design_tokens table
            const { error: tokenError } = await supabase
              .from('design_tokens')
              .insert({
                project_id: params.projectId,
                name: `${wireframeData.title} Design Tokens`,
                category: 'wireframe',
                value: wireframeData.designTokens as any,
                description: `Design tokens for wireframe: ${wireframeData.title}`
              });
            
            if (tokenError) {
              console.error("Error saving design tokens:", tokenError);
            }
          } catch (tokenError) {
            console.error("Exception saving design tokens:", tokenError);
          }
        }
        
        // Cache the wireframe for future similar requests
        WireframeCacheService.storeInCache(params, wireframeData);
        
        // Queue background optimization task
        WireframeBackgroundProcessor.queueTask('optimize_wireframe', wireframeData);
      } catch (saveError) {
        // Log the error but don't fail the generation
        console.error("Error saving wireframe:", saveError);
        WireframeMonitoringService.recordEvent('wireframe_save_error', {
          projectId: params.projectId,
          error: saveError instanceof Error ? saveError.message : 'Unknown error'
        }, 'error');
      }
      
      // Record metrics for this generation
      const endTime = performance.now();
      const totalTime = (endTime - startTime) / 1000;
      
      // Record generation for rate limiting purposes
      WireframeRateLimiterService.recordGeneration(params.projectId);
      
      // Record success for monitoring
      WireframeMonitoringService.recordEvent('wireframe_generation_success', {
        projectId: params.projectId,
        generationTime: totalTime,
        modelUsed: wireframeResult.model || 'default',
        tokenUsage: wireframeResult.usage?.total_tokens || 0
      });

      return wireframeResult;
    } catch (error) {
      console.error("Wireframe generation failed:", error);
      
      // Record metrics for failed generation
      WireframeMonitoringService.recordEvent('wireframe_generation_failure', {
        projectId: params.projectId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'error');
      
      throw error;
    }
  },

  /**
   * Get all wireframes for a project
   */
  getProjectWireframes: async (projectId: string): Promise<AIWireframe[]> => {
    return WireframeApiService.getProjectWireframes(projectId);
  },

  /**
   * Get a specific wireframe by ID with its sections
   */
  getWireframe: async (wireframeId: string): Promise<AIWireframe & { sections?: any[] }> => {
    return WireframeApiService.getWireframe(wireframeId);
  },

  /**
   * Update wireframe feedback and rating
   */
  updateWireframeFeedback: async (wireframeId: string, feedback: string, rating?: number): Promise<void> => {
    return WireframeApiService.updateWireframeFeedback(wireframeId, feedback, rating);
  },
  
  /**
   * Delete a wireframe
   */
  deleteWireframe: async (wireframeId: string): Promise<void> => {
    return WireframeApiService.deleteWireframe(wireframeId);
  },
  
  /**
   * Get user's role for rate limiting and permissions
   */
  getUserRole: async (userId: string): Promise<string> => {
    try {
      if (!userId) {
        console.warn("No user ID provided for role check");
        return 'free'; // Default to free tier if no user ID
      }
      
      // Get the user profile that contains the role
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return 'free'; // Default to free tier if there's an error
      }
      
      if (!data || !data.role) {
        console.warn("No role found for user:", userId);
        return 'free';
      }
      
      return data.role;
    } catch (error) {
      console.error("Exception fetching user role:", error);
      return 'free';
    }
  },
  
  /**
   * Clear expired wireframe cache entries
   */
  cleanupCache: async (): Promise<number> => {
    try {
      return await WireframeCacheService.clearExpiredCache();
    } catch (error) {
      console.error("Error cleaning up wireframe cache:", error);
      return 0;
    }
  },
  
  /**
   * Get rate limit status for a user
   */
  getRateLimitStatus: async (userId: string): Promise<any> => {
    try {
      const userRole = await WireframeService.getUserRole(userId);
      return await WireframeRateLimiterService.checkRateLimit(userId, userRole);
    } catch (error) {
      console.error("Error getting rate limit status:", error);
      throw error;
    }
  },
  
  /**
   * Process background tasks (can be called from a cron job or scheduler)
   */
  processBackgroundTasks: async (maxTasks: number = 5): Promise<number> => {
    let processed = 0;
    
    for (let i = 0; i < maxTasks; i++) {
      const hasMore = await WireframeBackgroundProcessor.processNextTask();
      if (hasMore) {
        processed++;
      } else {
        break; // No more tasks to process
      }
    }
    
    return processed;
  },
  
  /**
   * Get system performance metrics
   */
  getPerformanceMetrics: async (timeRange: 'day' | 'week' | 'month' = 'day'): Promise<any> => {
    try {
      const metrics = await WireframeMonitoringService.getMetrics(timeRange);
      const sectionTypes = await WireframeMonitoringService.analyzeSectionTypes(timeRange);
      
      return {
        metrics,
        sectionTypes
      };
    } catch (error) {
      console.error("Error getting performance metrics:", error);
      throw error;
    }
  }
};
