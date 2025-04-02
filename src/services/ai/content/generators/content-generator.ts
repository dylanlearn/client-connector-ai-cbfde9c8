
import { supabase } from "@/integrations/supabase/client";
import { BaseContentGenerator, BaseContentOptions } from "./base-generator";
import { AIFeatureType, selectModelForFeature } from "../../ai-model-selector";

export interface ContentGenerationOptions extends BaseContentOptions {
  type: 'header' | 'tagline' | 'cta' | 'description';
  tone?: string;
  context?: string;
  keywords?: string[];
  testVariantId?: string; // For A/B testing
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
        cacheKey,
        testVariantId
      } = options;
      
      // Generate cache key if not provided
      const effectiveCacheKey = cacheKey || 
        `${type}-${tone}-${context}-${keywords.join(',')}-${maxLength}-${testVariantId || 'default'}`;
      
      // Check database cache first
      const cachedContent = await this.checkCache(effectiveCacheKey);
      if (cachedContent) {
        return cachedContent;
      }
      
      // If we have a test variant ID, fetch the prompt from the A/B testing system
      let promptContent = '';
      let systemPrompt = '';
      
      if (testVariantId && testVariantId !== 'default') {
        // Fetch the specific variant by ID
        const { data: variantData, error: variantError } = await supabase
          .from('ai_prompt_variants')
          .select('*')
          .eq('id', testVariantId)
          .single();
        
        if (!variantError && variantData) {
          promptContent = variantData.prompt_text
            .replace('{{type}}', type)
            .replace('{{tone}}', tone)
            .replace('{{context}}', context)
            .replace('{{keywords}}', keywords.join(', '))
            .replace('{{maxLength}}', maxLength.toString());
          
          systemPrompt = variantData.system_prompt || this.getDefaultSystemPrompt();
        } else {
          // Fallback to default prompt
          promptContent = this.getDefaultPrompt(type, tone, context, keywords, maxLength);
          systemPrompt = this.getDefaultSystemPrompt();
        }
      } else {
        // Use default prompt
        promptContent = this.getDefaultPrompt(type, tone, context, keywords, maxLength);
        systemPrompt = this.getDefaultSystemPrompt();
      }
      
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
            { tone, context, keywords, testVariantId }
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

  /**
   * Get the default prompt template
   */
  private getDefaultPrompt(
    type: string, 
    tone: string, 
    context: string, 
    keywords: string[], 
    maxLength: number
  ): string {
    return `
      Generate a ${type} with the following specifications:
      - Tone: ${tone}
      - Context: ${context}
      - Keywords to include: ${keywords.join(', ')}
      - Maximum length: ${maxLength} characters
      
      Create a compelling ${type} that would resonate with the target audience.
      Provide an example that demonstrates best practices and clarity.
      Make the response concise, helpful, and directly applicable to a web form context.
    `;
  }

  /**
   * Get the default system prompt
   */
  private getDefaultSystemPrompt(): string {
    return `You are an expert copywriter specialized in creating compelling web content.
      You create concise, engaging copy that matches the specified tone and incorporates required keywords.
      For form field examples, be specific, clear, and provide realistic examples that users might actually input.
      Keep responses under the specified maximum length and focus on practical, helpful content.`;
  }
}
