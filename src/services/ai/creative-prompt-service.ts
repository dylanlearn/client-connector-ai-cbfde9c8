
import { AIPromptOptions } from "./summary/types/intake-summary-types";

/**
 * Service for enhancing prompts to produce more creative AI outputs
 */
export const CreativePromptService = {
  /**
   * Transform a standard prompt into a more creative version
   * @param basePrompt The original prompt
   * @param creativityLevel How creative the output should be (0-10)
   * @returns Enhanced prompt for more creative results
   */
  enhancePrompt: (basePrompt: string, creativityLevel: number = 7): string => {
    if (creativityLevel <= 5) {
      return basePrompt; // Return original for low creativity requests
    }
    
    const creativityPrefixes = [
      "Create a highly innovative and original",
      "Imagine the most creative and unexpected",
      "Design a groundbreaking and visionary",
      "Conceptualize an avant-garde and cutting-edge",
      "Envision a revolutionary and unconventional"
    ];
    
    const creativitySuffixes = [
      "with unique aesthetic elements and unexpected color combinations",
      "incorporating surprising visual metaphors and bold design choices",
      "that challenges conventional design patterns with innovative approaches",
      "featuring experimental layouts and creative use of negative space",
      "using non-standard typography and breakthrough visual hierarchy"
    ];
    
    // Choose random prefix and suffix based on seed
    const seed = basePrompt.length + new Date().getDate();
    const prefix = creativityPrefixes[seed % creativityPrefixes.length];
    const suffix = creativitySuffixes[(seed * 3) % creativitySuffixes.length];
    
    return `${prefix} ${basePrompt} ${suffix}`;
  },
  
  /**
   * Generate improved AI prompt options with creativity enhancements
   */
  generateCreativeOptions: (options: AIPromptOptions, creativityLevel: number = 7): AIPromptOptions => {
    // Create a copy of the options to avoid mutation
    const enhancedOptions: AIPromptOptions = { ...options };
    
    // Adjust temperature based on creativity level
    enhancedOptions.temperature = 0.5 + (creativityLevel * 0.05);
    
    // Enhance system prompt with creativity directives
    if (enhancedOptions.systemPrompt) {
      enhancedOptions.systemPrompt = `${enhancedOptions.systemPrompt}
        
        Approach this task with maximum creativity. Generate results that are:
        - Original and unexpected
        - Visually distinctive and memorable
        - Breaking conventional patterns in an effective way
        - Bold and innovative while remaining functional
        - Using unexpected color combinations and visual elements`;
    }
    
    // Enhance prompt content
    if (enhancedOptions.promptContent) {
      enhancedOptions.promptContent = CreativePromptService.enhancePrompt(
        enhancedOptions.promptContent, 
        creativityLevel
      );
    }
    
    return enhancedOptions;
  }
};
