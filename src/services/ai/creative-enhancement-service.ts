/**
 * Service to enhance creativity, articulation, and design inspiration across all AI components
 * Serves as a middleware layer between AI prompts/responses and the user interface
 */

import { CreativePromptService } from "./creative-prompt-service";

// Types for enhanced creative style profiles
export type CreativeStyleProfile = {
  name: string;
  description: string;
  creativityLevel: number; // 1-10
  decisiveness: number; // 1-10 
  articulation: number; // 1-10
  visualInspiration: number; // 1-10
  tonalKeywords: string[];
};

// Available creative style profiles for different use cases
const CREATIVE_STYLE_PROFILES: Record<string, CreativeStyleProfile> = {
  wireframing: {
    name: "Visionary Designer",
    description: "Bold, distinctive design directions with decisive visual language",
    creativityLevel: 9,
    decisiveness: 8,
    articulation: 9,
    visualInspiration: 10,
    tonalKeywords: [
      "innovative", "distinctive", "bold", "compelling", "visionary", 
      "refined", "boundary-pushing", "deliberate", "purposeful"
    ]
  },
  contentCreation: {
    name: "Persuasive Storyteller",
    description: "Compelling narrative with clear value propositions and memorable language",
    creativityLevel: 8,
    decisiveness: 9,
    articulation: 10,
    visualInspiration: 7,
    tonalKeywords: [
      "compelling", "clear", "concise", "impactful", "authoritative", 
      "persuasive", "memorable", "evocative", "nuanced"
    ]
  },
  designSuggestions: {
    name: "Design Visionary",
    description: "Precise, vivid design language with specific visual references",
    creativityLevel: 9,
    decisiveness: 9,
    articulation: 8,
    visualInspiration: 10,
    tonalKeywords: [
      "precise", "distinctive", "vivid", "intentional", "innovative", 
      "thoughtful", "expert", "insightful", "strategic"
    ]
  },
  feedbackAnalysis: {
    name: "Insightful Analyzer",
    description: "Clear patterns and actionable recommendations from complex data",
    creativityLevel: 6,
    decisiveness: 10,
    articulation: 9,
    visualInspiration: 7,
    tonalKeywords: [
      "insightful", "analytical", "decisive", "strategic", "clear",
      "actionable", "practical", "evidence-based", "focused"
    ]
  },
  default: {
    name: "Balanced Creative",
    description: "Well-balanced creative output with clarity and originality",
    creativityLevel: 7,
    decisiveness: 7,
    articulation: 8,
    visualInspiration: 7,
    tonalKeywords: [
      "balanced", "thoughtful", "creative", "clear", "engaging",
      "professional", "refined", "effective", "considered"
    ]
  }
};

export const CreativeEnhancementService = {
  /**
   * Get a specific creative style profile by name
   */
  getStyleProfile: (profileName: string): CreativeStyleProfile => {
    return CREATIVE_STYLE_PROFILES[profileName] || CREATIVE_STYLE_PROFILES.default;
  },

  /**
   * Enhance a prompt with creative styling based on the selected profile
   */
  enhancePrompt: (
    basePrompt: string, 
    styleProfileName: string = "default",
    context?: Record<string, any>
  ): string => {
    const profile = CreativeEnhancementService.getStyleProfile(styleProfileName);
    
    // Apply basic creative enhancement
    let enhancedPrompt = CreativePromptService.enhancePrompt(
      basePrompt, 
      profile.creativityLevel
    );
    
    // Apply tonal styling based on profile
    const tonalWords = profile.tonalKeywords;
    const selectedTones = [
      tonalWords[Math.floor(Math.random() * tonalWords.length)],
      tonalWords[Math.floor(Math.random() * tonalWords.length)],
      tonalWords[Math.floor(Math.random() * tonalWords.length)]
    ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
    
    // Add style directives based on profile characteristics
    const styleDirectives: string[] = [];
    
    if (profile.decisiveness >= 8) {
      styleDirectives.push("Be decisive and specific in your recommendations");
    }
    
    if (profile.articulation >= 8) {
      styleDirectives.push("Use precise, vivid language to articulate design concepts");
    }
    
    if (profile.visualInspiration >= 8) {
      styleDirectives.push("Provide rich visual descriptions that inspire clear mental imagery");
    }
    
    // Compose the enhanced prompt with directives
    if (styleDirectives.length > 0) {
      enhancedPrompt = `${enhancedPrompt}\n\nApproach this with a ${selectedTones.join(", ")} tone.\n${styleDirectives.join(". ")}.`;
    }
    
    // Add context-specific enhancements if provided
    if (context) {
      if (context.industry) {
        enhancedPrompt += `\nOptimize specifically for the ${context.industry} industry.`;
      }
      
      if (context.audience) {
        enhancedPrompt += `\nDesign with a focus on ${context.audience} as the primary audience.`;
      }
    }
    
    return enhancedPrompt;
  },
  
  /**
   * Enhance the system prompt for AI models with more creative direction
   */
  enhanceSystemPrompt: (
    baseSystemPrompt: string, 
    styleProfileName: string = "default"
  ): string => {
    const profile = CreativeEnhancementService.getStyleProfile(styleProfileName);
    
    // Create profile-specific system prompt enhancement
    const enhancementDirectives = [
      `You are an expert design consultant with the creative profile of a "${profile.name}".`,
      `${profile.description}.`,
      `Your responses should demonstrate ${profile.tonalKeywords.slice(0, 5).join(", ")} qualities.`,
      `Present your ideas with confidence and clarity.`,
      `Be specific rather than general - use concrete examples, specific color values, exact measurements, and precise terminology.`
    ];
    
    // Add creativity-level specific directives
    if (profile.creativityLevel >= 8) {
      enhancementDirectives.push(
        "Push beyond conventional design patterns while maintaining practical usability.",
        "Suggest unexpected creative elements that make designs truly distinctive."
      );
    }
    
    // Add articulation-specific directives
    if (profile.articulation >= 8) {
      enhancementDirectives.push(
        "Use precise terminology and vivid language to communicate design concepts.",
        "Explain your recommendations with clear rationales that demonstrate deep design understanding."
      );
    }
    
    // Combine with base prompt
    return `${baseSystemPrompt}\n\n${enhancementDirectives.join("\n")}`;
  },
  
  /**
   * Process and enhance AI response to improve articulation and specificity
   * (For future ML-based response enhancement)
   */
  enhanceResponse: (response: string, styleProfileName: string = "default"): string => {
    // Future implementation - potentially apply transformations to AI responses
    // For now return unchanged
    return response;
  }
};
