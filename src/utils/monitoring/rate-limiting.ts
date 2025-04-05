
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a specific operation is rate limited
 */
export const checkRateLimits = async (
  endpoint: string,
  maxTokens: number = 100,
  refillRate: number = 10, // tokens per minute
  refillInterval: number = 60 // seconds
): Promise<{
  isLimited: boolean;
  remainingTokens: number;
  resetTime: Date;
}> => {
  try {
    // Get current user info
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate a key based on user ID or IP address
    const key = user?.id || 'anonymous';
    
    // Find or create a rate limit counter
    const { data: counterData, error: counterError } = await supabase
      .from('rate_limit_counters')
      .select('*')
      .eq('key', key)
      .eq('endpoint', endpoint)
      .single();
      
    if (counterError && counterError.code !== 'PGRST116') {
      // PGRST116 is "no rows found" error, which we handle below
      throw counterError;
    }
    
    const now = new Date();
    let counter;
    
    if (!counterData) {
      // Create new counter
      const { data, error } = await supabase
        .from('rate_limit_counters')
        .insert({
          key,
          endpoint,
          tokens: maxTokens,
          user_id: user?.id,
          last_refill: now.toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      counter = data;
    } else {
      counter = counterData;
      
      // Check if tokens need refilling
      const lastRefill = new Date(counter.last_refill);
      const secondsSinceRefill = Math.floor((now.getTime() - lastRefill.getTime()) / 1000);
      
      if (secondsSinceRefill >= refillInterval) {
        // Calculate tokens to add
        const refillCycles = Math.floor(secondsSinceRefill / refillInterval);
        const tokensToAdd = refillRate * refillCycles;
        
        // Update counter
        const newTokens = Math.min(counter.tokens + tokensToAdd, maxTokens);
        const { data, error } = await supabase
          .from('rate_limit_counters')
          .update({
            tokens: newTokens,
            last_refill: now.toISOString()
          })
          .eq('id', counter.id)
          .select()
          .single();
          
        if (error) throw error;
        counter = data;
      }
    }
    
    // Check if rate limited
    const isLimited = counter.tokens <= 0;
    
    // Calculate reset time (when at least one token will be available again)
    const resetTime = new Date(counter.last_refill);
    resetTime.setSeconds(resetTime.getSeconds() + refillInterval);
    
    // Consume a token if not limited
    if (!isLimited) {
      await supabase
        .from('rate_limit_counters')
        .update({
          tokens: counter.tokens - 1
        })
        .eq('id', counter.id);
    }
    
    return {
      isLimited,
      remainingTokens: counter.tokens,
      resetTime
    };
  } catch (error) {
    console.error('Error checking rate limits:', error);
    // Default to not limited on error, to prevent blocking users
    return {
      isLimited: false,
      remainingTokens: 1,
      resetTime: new Date()
    };
  }
};

/**
 * Get rate limit status for monitoring
 */
export const getRateLimitStatus = async (
  endpoint: string = 'all'
): Promise<{
  totalCounters: number;
  limitedUsers: number;
  averageRemainingTokens: number;
  limitedUserIds: string[];
}> => {
  try {
    // Query rate limit counters
    let query = supabase
      .from('rate_limit_counters')
      .select('*');
      
    if (endpoint !== 'all') {
      query = query.eq('endpoint', endpoint);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Calculate statistics
    const totalCounters = data.length;
    const limitedCounters = data.filter(counter => counter.tokens <= 0);
    const limitedUsers = limitedCounters.length;
    const limitedUserIds = limitedCounters
      .filter(counter => counter.user_id)
      .map(counter => counter.user_id as string);
      
    const totalTokens = data.reduce((sum, counter) => sum + counter.tokens, 0);
    const averageRemainingTokens = totalCounters > 0 
      ? totalTokens / totalCounters 
      : 0;
    
    return {
      totalCounters,
      limitedUsers,
      averageRemainingTokens,
      limitedUserIds
    };
  } catch (error) {
    console.error('Error getting rate limit status:', error);
    return {
      totalCounters: 0,
      limitedUsers: 0,
      averageRemainingTokens: 0,
      limitedUserIds: []
    };
  }
};
