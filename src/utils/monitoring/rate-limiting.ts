
import { supabase } from "@/integrations/supabase/client";
import { RateLimitCounter } from "./types";

/**
 * Check API rate limits
 */
export const checkRateLimits = async (
  endpoint: string,
  key: string,
  limit: number = 10
): Promise<boolean> => {
  try {
    // First, get the current rate limit counter
    const { data, error } = await (supabase
      .from('rate_limit_counters' as any)
      .select('*')
      .eq('endpoint', endpoint)
      .eq('key', key)
      .maybeSingle()) as any;
      
    if (error) {
      console.error('Error checking rate limits:', error);
      return false;
    }
    
    const counter = data as RateLimitCounter | null;
    
    if (!counter) {
      // No counter exists, create a new one
      await createRateLimitCounter(endpoint, key, limit);
      return true;
    }
    
    // Check if tokens are available
    if (counter.tokens > 0) {
      // Use a token and update the counter
      await decrementRateLimitCounter(counter.id);
      return true;
    }
    
    // Check if refill time has passed
    const lastRefill = new Date(counter.last_refill);
    const now = new Date();
    const hoursSinceRefill = (now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceRefill >= 1) {
      // Refill tokens and update counter
      await refillRateLimitCounter(counter.id, limit);
      return true;
    }
    
    // Rate limit exceeded
    return false;
  } catch (error) {
    console.error('Error in checkRateLimits:', error);
    return false;
  }
};

/**
 * Create a new rate limit counter
 */
export const createRateLimitCounter = async (
  endpoint: string,
  key: string,
  tokens: number
): Promise<boolean> => {
  try {
    const { error } = await (supabase
      .from('rate_limit_counters' as any)
      .insert({
        endpoint,
        key,
        tokens: tokens - 1, // Use one token immediately
        last_refill: new Date().toISOString()
      })) as any;
      
    if (error) {
      console.error('Error creating rate limit counter:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createRateLimitCounter:', error);
    return false;
  }
};

/**
 * Decrement the tokens in a rate limit counter
 */
export const decrementRateLimitCounter = async (id: string): Promise<boolean> => {
  try {
    // First, get the current counter
    const { data, error: getError } = await (supabase
      .from('rate_limit_counters' as any)
      .select('tokens')
      .eq('id', id)
      .single()) as any;
      
    if (getError) {
      console.error('Error getting rate limit counter:', getError);
      return false;
    }
    
    // Then update with decremented value
    const { error: updateError } = await (supabase
      .from('rate_limit_counters' as any)
      .update({ tokens: Math.max(0, data.tokens - 1) })
      .eq('id', id)) as any;
      
    if (updateError) {
      console.error('Error updating rate limit counter:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in decrementRateLimitCounter:', error);
    return false;
  }
};

/**
 * Refill the tokens in a rate limit counter
 */
export const refillRateLimitCounter = async (id: string, tokens: number): Promise<boolean> => {
  try {
    const { error } = await (supabase
      .from('rate_limit_counters' as any)
      .update({
        tokens: tokens - 1, // Use one token immediately
        last_refill: new Date().toISOString()
      })
      .eq('id', id)) as any;
      
    if (error) {
      console.error('Error refilling rate limit counter:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in refillRateLimitCounter:', error);
    return false;
  }
};
