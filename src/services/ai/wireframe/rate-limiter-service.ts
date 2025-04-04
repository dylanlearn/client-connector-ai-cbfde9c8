
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
      
      // Use RPC to check rate limits
      const { data, error } = await supabase.rpc('check_wireframe_rate_limits', {
        p_user_id: userId,
        p_max_daily: limits.daily,
        p_max_hourly: limits.hourly
      });
      
      if (error) {
        console.error("Error checking rate limits:", error);
        return {
          canGenerate: false,
          dailyRemaining: 0,
          hourlyRemaining: 0,
          resetTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          isRateLimited: true
        };
      }
      
      const rateLimitInfo = data || {
        daily_count: 0,
        hourly_count: 0,
        is_rate_limited: false
      };
      
      const dailyRemaining = Math.max(0, limits.daily - rateLimitInfo.daily_count);
      const hourlyRemaining = Math.max(0, limits.hourly - rateLimitInfo.hourly_count);
      
      // Determine when limits reset
      const isHourlyLimited = hourlyRemaining <= 0;
      const isDailyLimited = dailyRemaining <= 0;
      const isRateLimited = isHourlyLimited || isDailyLimited;
      
      let resetTime = new Date();
      
      if (isHourlyLimited) {
        // Reset at the next hour
        resetTime = new Date(now);
        resetTime.setHours(resetTime.getHours() + 1);
        resetTime.setMinutes(0, 0, 0);
      } else if (isDailyLimited) {
        // Reset at midnight tonight
        resetTime = new Date(now);
        resetTime.setDate(resetTime.getDate() + 1);
        resetTime.setHours(0, 0, 0, 0);
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
      await supabase.rpc('record_wireframe_generation', {
        p_user_id: userId
      });
    } catch (error) {
      console.error("Error recording generation for rate limiting:", error);
    }
  }
};
