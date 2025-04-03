
import { IntakeFormData } from "@/types/intake-form";
import { AIPromptOptions } from "../types/intake-summary-types";
import { AIFeatureType, selectModelForFeature } from "../../ai-model-selector";

/**
 * Builds prompts for the intake summary generation
 */
export const buildIntakePrompt = (formData: IntakeFormData): AIPromptOptions => {
  // Select appropriate model for content generation
  const model = selectModelForFeature(AIFeatureType.ContentGeneration);
  
  // Create a formatted prompt with all relevant intake form information
  const promptContent = `
    Review this client intake form data and create a professional project brief:
    
    ${Object.entries(formData)
      .filter(([key, value]) => 
        value && 
        typeof value === 'string' && 
        !key.includes('Id') && 
        !key.includes('timestamp') && 
        key !== 'status'
      )
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n\n')}
    
    Please provide:
    1. A concise, friendly project summary written in natural paragraphs with important points highlighted using bold text (but don't use markdown formatting)
    2. Brand tone words and design direction in conversational style
    3. Project priorities written in a natural way as a bulleted list (use "- " prefix for each bullet point)
    4. Draft website copy including a compelling header, engaging subtext, and persuasive call-to-action
  `;
  
  const systemPrompt = `
    You are a skilled creative director who specializes in translating client requirements
    into clear, actionable project briefs for design teams. Your summaries should be written in a 
    natural, conversational tone as if you're speaking directly to a colleague.
    
    For content structure, use the following format:
    - Use "# Title" for main sections (very sparingly)
    - Use "## Subtitle" for important subsections
    - Use "### Point" for key points that need emphasis
    - Use "- " for bullet points
    
    Write in a warm, human voice. For important concepts, use bold text by making the section header larger and bold.
    
    When suggesting copy, make it sound authentic and human-centered, not corporate or AI-generated.
    Focus on creating content that feels like it was written by a professional copywriter.
    
    For example, instead of "Client requires a responsive website with modern aesthetic"
    write something like "I can see that having a responsive website with a modern look is important to you.
    The clean aesthetic you're describing would work well for showcasing your products while maintaining that
    professional edge you mentioned."
  `;
  
  return {
    model,
    temperature: 0.8,
    systemPrompt,
    promptContent
  };
};
