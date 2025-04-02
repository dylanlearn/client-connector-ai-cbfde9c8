
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

// Cache for storing recently generated content
type CacheEntry = {
  content: string;
  timestamp: number;
  expiresAt: number;
};

// In-memory cache with expiration
class ContentCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

  get(key: string): string | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if entry is expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.content;
  }

  set(key: string, content: string, ttl: number = this.DEFAULT_TTL): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + ttl;
    
    this.cache.set(key, { content, timestamp, expiresAt });
    
    // Cleanup old entries periodically
    if (this.cache.size % 10 === 0) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton cache instance
const contentCache = new ContentCache();

/**
 * Service for generating AI-powered content with caching and performance optimizations
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
      
      // Check cache first
      const cachedContent = contentCache.get(effectiveCacheKey);
      if (cachedContent) {
        console.log('Cache hit for content generation:', effectiveCacheKey);
        return cachedContent;
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
      const featureType = isComplexRequest 
        ? AIFeatureType.ComplexContentGeneration 
        : AIFeatureType.ContentGeneration;
      
      const model = selectModelForFeature(featureType);
      
      // Add timeout for the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
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
        
        // Store in cache
        contentCache.set(effectiveCacheKey, generatedContent);
        
        return generatedContent;
      } catch (timeoutError) {
        clearTimeout(timeoutId);
        console.error("AI generation timed out:", timeoutError);
        throw new Error("AI generation timed out. Please try again.");
      }
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
