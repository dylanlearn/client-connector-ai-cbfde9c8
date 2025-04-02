
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

export interface ContentGenerationOptions {
  type: 'header' | 'tagline' | 'cta' | 'description';
  tone?: string;
  context?: string;
  keywords?: string[];
  maxLength?: number;
  cacheKey?: string; // Added for cache identification
}

/**
 * Service for generating AI-powered content with database caching and performance optimizations
 */
export const AIContentGenerationService = {
  /**
   * Generates content based on type and specifications with caching support
   */
  generateContent: async (options: ContentGenerationOptions): Promise<string> => {
    try {
      const { 
        type, 
        tone = 'professional', 
        context = '', 
        keywords = [], 
        maxLength = 100,
        cacheKey
      } = options;
      
      // Generate cache key if not provided
      const effectiveCacheKey = cacheKey || 
        `${type}-${tone}-${context}-${keywords.join(',')}-${maxLength}`;
      
      // Check database cache first using maybeSingle() to avoid errors if not found
      const { data: cachedContent, error: cacheError } = await supabase
        .from('ai_content_cache')
        .select('content')
        .eq('cache_key', effectiveCacheKey)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
      
      if (!cacheError && cachedContent) {
        console.log('Cache hit for content generation:', effectiveCacheKey);
        return cachedContent.content;
      }
      
      console.log('Cache miss for content generation:', effectiveCacheKey);
      
      // Prepare prompt with more detailed instructions for better results
      const promptContent = `
        Generate a ${type} with the following specifications:
        - Tone: ${tone}
        - Context: ${context}
        - Keywords to include: ${keywords.join(', ')}
        - Maximum length: ${maxLength} characters
        
        Create a compelling ${type} that would resonate with the target audience.
        Provide an example that demonstrates best practices and clarity.
        Make the response concise, helpful, and directly applicable to a web form context.
      `;
      
      // Enhanced system prompt for better quality generations
      const systemPrompt = `You are an expert copywriter specialized in creating compelling web content.
        You create concise, engaging copy that matches the specified tone and incorporates required keywords.
        For form field examples, be specific, clear, and provide realistic examples that users might actually input.
        Keep responses under the specified maximum length and focus on practical, helpful content.`;
      
      // Select the appropriate model based on the complexity of the request
      const isComplexRequest = context.length > 100 || keywords.length > 5;
      
      // Use ContentGeneration for all cases, but we might want to use a more powerful model for complex requests
      const featureType = isComplexRequest 
        ? AIFeatureType.ContentGeneration 
        : AIFeatureType.ContentGeneration;
      
      const model = selectModelForFeature(featureType);
      
      // Record the start time for latency tracking
      const startTime = Date.now();
      
      // Add timeout for the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout (increased from 5s)
      
      // Implement retry logic for transient errors
      const MAX_RETRIES = 2;
      let retryCount = 0;
      let lastError: Error | null = null;
      
      while (retryCount <= MAX_RETRIES) {
        try {
          const { data, error } = await supabase.functions.invoke("generate-with-openai", {
            body: {
              messages: [{
                role: "user",
                content: promptContent
              }],
              systemPrompt,
              temperature: 0.7,
              model,
              maxTokens: Math.min(maxLength * 2, 500), // Limit token usage
            },
          });
          
          clearTimeout(timeoutId);
          
          if (error) throw error;
          
          const generatedContent = data.response.trim();
          const endTime = Date.now();
          const latencyMs = endTime - startTime;
          
          // Store in database cache with 30-minute expiration
          const expiresAt = new Date();
          expiresAt.setMinutes(expiresAt.getMinutes() + 30);
          
          // Get user ID if logged in
          const session = await supabase.auth.getSession();
          const userId = session.data.session?.user.id;
          
          // Insert into cache with error handling
          try {
            await supabase.from('ai_content_cache').insert({
              cache_key: effectiveCacheKey,
              content: generatedContent,
              content_type: type,
              expires_at: expiresAt.toISOString(),
              user_id: userId,
              metadata: { tone, context, keywords }
            });
          } catch (cacheError) {
            console.error("Failed to store in cache, but continuing:", cacheError);
            // Non-critical error, continue without failing
          }
          
          // Log metrics for analytics (also non-critical)
          if (userId) {
            try {
              await supabase.from('ai_generation_metrics').insert({
                feature_type: featureType,
                model_used: model,
                latency_ms: latencyMs,
                success: true,
                user_id: userId,
                prompt_tokens: data.usage?.prompt_tokens,
                completion_tokens: data.usage?.completion_tokens,
                total_tokens: data.usage?.total_tokens
              });
            } catch (metricsError) {
              console.error("Failed to log metrics, but continuing:", metricsError);
              // Non-critical error, continue without failing
            }
          }
          
          return generatedContent;
        } catch (error) {
          clearTimeout(timeoutId);
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.error(`AI generation attempt ${retryCount + 1} failed:`, error);
          
          if (retryCount < MAX_RETRIES) {
            // Exponential backoff: 1s, 2s, 4s
            const delayMs = 1000 * Math.pow(2, retryCount);
            console.log(`Retrying in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            retryCount++;
          } else {
            // Log error metrics if user is logged in (non-critical)
            try {
              const session = await supabase.auth.getSession();
              const userId = session.data.session?.user.id;
              
              if (userId) {
                await supabase.from('ai_generation_metrics').insert({
                  feature_type: featureType,
                  model_used: model,
                  latency_ms: Date.now() - startTime,
                  success: false,
                  error_type: error.name || 'unknown',
                  error_message: error.message,
                  user_id: userId
                });
              }
            } catch (metricsError) {
              console.error("Failed to log error metrics:", metricsError);
            }
            
            // Break out of the retry loop after maximum retries
            break;
          }
        }
      }
      
      // If we've exhausted all retries, throw the last error
      if (lastError) {
        throw lastError;
      }
      
      throw new Error("Unknown error during content generation");
    } catch (error) {
      console.error("Error generating content:", error);
      // Return a more helpful fallback based on the type
      const fallbacks = {
        header: `Example ${options.type || 'header'}`,
        tagline: "Brief, compelling tagline example",
        cta: "Sign up for free",
        description: `Sample description for ${options.context || 'this field'}`
      };
      return fallbacks[options.type] || `[Error generating ${options.type}]`;
    }
  }
};
