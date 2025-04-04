
import { supabase } from "@/integrations/supabase/client";

interface RateLimitConfig {
  userId: string;
  maxDailyGenerations: number;
  maxHourlyGenerations: number;
}

export interface RateLimitStatus {
  canGenerate: boolean;
  dailyRemaining: number;
  hourlyRemaining: number;
  resetTime: Date;
  isRateLimited: boolean;
}

/**
 * Service for managing rate limits on wireframe generation to control API costs
 */
export const WireframeRateLimiterService = {
  /**
   * Default rate limit configuration by user tier
   */
  getDefaultLimits: (userRole: string): { daily: number, hourly: number } => {
    switch (userRole) {
      case 'admin':
        return { daily: 100, hourly: 20 };
      case 'pro':
        return { daily: 50, hourly: 10 };
      default:
        return { daily: 5, hourly: 2 };
    }
  },
  
  /**
   * Check if a user is rate limited and get their current status
   */
  checkRateLimit: async (userId: string, userRole: string = 'free'): Promise<RateLimitStatus> => {
    try {
      const limits = WireframeRateLimiterService.getDefaultLimits(userRole);
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      
      const hourStart = new Date(now);
      hourStart.setMinutes(0, 0, 0);
      
      // Get today's generations
      const { data: dailyData, error: dailyError } = await supabase
        .from('wireframe_generation_metrics')
        .select('id')
        .eq('project_id', userId)
        .gte('created_at', todayStart.toISOString())
        .count();
      
      if (dailyError) {
        console.error("Error checking daily rate limit:", dailyError);
        return {
          canGenerate: false,
          dailyRemaining: 0,
          hourlyRemaining: 0,
          resetTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          isRateLimited: true
        };
      }
      
      // Get hourly generations
      const { data: hourlyData, error: hourlyError } = await supabase
        .from('wireframe_generation_metrics')
        .select('id')
        .eq('project_id', userId)
        .gte('created_at', hourStart.toISOString())
        .count();
      
      if (hourlyError) {
        console.error("Error checking hourly rate limit:", hourlyError);
        return {
          canGenerate: false,
          dailyRemaining: 0,
          hourlyRemaining: 0,
          resetTime: new Date(now.getTime() + 60 * 60 * 1000),
          isRateLimited: true
        };
      }
      
      const dailyCount = (dailyData as any).count || 0;
      const hourlyCount = (hourlyData as any).count || 0;
      
      const dailyRemaining = Math.max(0, limits.daily - dailyCount);
      const hourlyRemaining = Math.max(0, limits.hourly - hourlyCount);
      
      // Determine if rate limited and when it resets
      const isHourlyLimited = hourlyRemaining <= 0;
      const isDailyLimited = dailyRemaining <= 0;
      const isRateLimited = isHourlyLimited || isDailyLimited;
      
      let resetTime = new Date();
      if (isHourlyLimited) {
        resetTime = new Date(hourStart.getTime() + 60 * 60 * 1000);
      } else if (isDailyLimited) {
        resetTime = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
      }
      
      return {
        canGenerate: !isRateLimited,
        dailyRemaining,
        hourlyRemaining,
        resetTime,
        isRateLimited
      };
    } catch (error) {
      console.error("Error in rate limiter:", error);
      return {
        canGenerate: false,
        dailyRemaining: 0,
        hourlyRemaining: 0,
        resetTime: new Date(),
        isRateLimited: true
      };
    }
  },
  
  /**
   * Record a generation attempt for rate limiting purposes
   */
  recordGeneration: async (userId: string): Promise<void> => {
    try {
      await supabase
        .from('wireframe_generation_metrics')
        .insert({
          project_id: userId,
          prompt: 'Rate limit tracking',
          success: true
        });
    } catch (error) {
      console.error("Error recording generation for rate limiting:", error);
    }
  }
};
