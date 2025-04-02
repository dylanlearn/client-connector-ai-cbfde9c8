
import { supabase } from "@/integrations/supabase/client";

export interface BaseContentOptions {
  cacheKey?: string;
  maxLength?: number;
}

/**
 * Base generator with common functionality for all content generators
 */
export abstract class BaseContentGenerator<T extends BaseContentOptions> {
  /**
   * Store content in the database cache
   */
  protected async storeInCache(
    cacheKey: string,
    content: string,
    contentType: string,
    expirationMinutes: number = 30,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Calculate expiration time
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
      
      // Get user ID if logged in
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      // Insert into cache
      await supabase.from('ai_content_cache').insert({
        cache_key: cacheKey,
        content: content,
        content_type: contentType,
        expires_at: expiresAt.toISOString(),
        user_id: userId,
        metadata
      });
    } catch (cacheError) {
      console.error("Failed to store in cache:", cacheError);
      // Non-critical error, continue without failing
    }
  }

  /**
   * Check if content exists in the cache
   */
  protected async checkCache(cacheKey: string): Promise<string | null> {
    try {
      const { data: cachedContent, error: cacheError } = await supabase
        .from('ai_content_cache')
        .select('content')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
      
      if (!cacheError && cachedContent) {
        console.log('Cache hit for content generation:', cacheKey);
        return cachedContent.content;
      }
      
      console.log('Cache miss for content generation:', cacheKey);
      return null;
    } catch (error) {
      console.error("Error checking cache:", error);
      return null;
    }
  }

  /**
   * Log metrics for analytics
   */
  protected async logMetrics(
    featureType: string,
    model: string, 
    latencyMs: number, 
    success: boolean,
    data?: any,
    error?: Error
  ): Promise<void> {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) return;

      const metricsData: Record<string, any> = {
        feature_type: featureType,
        model_used: model,
        latency_ms: latencyMs,
        success: success,
        user_id: userId
      };

      // Add usage data if available
      if (data?.usage) {
        metricsData.prompt_tokens = data.usage.prompt_tokens;
        metricsData.completion_tokens = data.usage.completion_tokens;
        metricsData.total_tokens = data.usage.total_tokens;
      }

      // Add error info if available
      if (error) {
        metricsData.error_type = error.name || 'unknown';
        metricsData.error_message = error.message;
      }

      await supabase.from('ai_generation_metrics').insert(metricsData);
    } catch (metricsError) {
      console.error("Failed to log metrics:", metricsError);
      // Non-critical error, continue without failing
    }
  }

  /**
   * Generate fallback content for error cases
   */
  protected abstract generateFallbackContent(options: T): string;

  /**
   * Abstract method to be implemented by specific generators
   */
  public abstract generate(options: T): Promise<string>;
}
