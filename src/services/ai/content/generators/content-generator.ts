
import { supabase } from "@/integrations/supabase/client";
import { BaseContentGenerator, BaseContentOptions } from "./base-generator";
import { AIFeatureType, selectModelForFeature } from "../../ai-model-selector";

export interface ContentGenerationOptions extends BaseContentOptions {
  type: 'header' | 'tagline' | 'cta' | 'description';
  tone?: string;
  context?: string;
  keywords?: string[];
}

/**
 * Specialized generator for web content (headers, taglines, CTAs, descriptions)
 */
export class ContentGenerator extends BaseContentGenerator<ContentGenerationOptions> {
  /**
   * Generate web content based on type and specifications
   */
  public async generate(options: ContentGenerationOptions): Promise<string> {
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
      
      // Check database cache first
      const cachedContent = await this.checkCache(effectiveCacheKey);
      if (cachedContent) {
        return cachedContent;
      }
      
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
          
          if (error) throw error;
          
          const generatedContent = data.response.trim();
          const endTime = Date.now();
          const latencyMs = endTime - startTime;
          
          // Store in database cache with 30-minute expiration
          await this.storeInCache(
            effectiveCacheKey,
            generatedContent,
            type,
            30,
            { tone, context, keywords }
          );
          
          // Log metrics
          await this.logMetrics(
            featureType,
            model,
            latencyMs,
            true,
            data
          );
          
          return generatedContent;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.error(`AI generation attempt ${retryCount + 1} failed:`, error);
          
          if (retryCount < MAX_RETRIES) {
            // Exponential backoff: 1s, 2s, 4s
            const delayMs = 1000 * Math.pow(2, retryCount);
            console.log(`Retrying in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            retryCount++;
          } else {
            // Log error metrics
            await this.logMetrics(
              featureType,
              model,
              Date.now() - startTime,
              false,
              undefined,
              lastError
            );
            
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
      return this.generateFallbackContent(options);
    }
  }

  /**
   * Generate fallback content based on the content type
   */
  protected generateFallbackContent(options: ContentGenerationOptions): string {
    const fallbacks = {
      header: `Example ${options.type || 'header'}`,
      tagline: "Brief, compelling tagline example",
      cta: "Sign up for free",
      description: `Sample description for ${options.context || 'this field'}`
    };
    return fallbacks[options.type] || `[Error generating ${options.type}]`;
  }
}
