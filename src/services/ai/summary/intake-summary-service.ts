
import { supabase } from "@/integrations/supabase/client";
import { IntakeFormData } from "@/types/intake-form";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

export interface IntakeSummaryResult {
  summary: string;
  tone: string[];
  direction: string;
  priorities: string[];
  draftCopy: {
    header: string;
    subtext: string;
    cta: string;
  };
}

/**
 * Service for summarizing client intake form data with AI-powered analysis
 */
export const IntakeSummaryService = {
  /**
   * Generate a comprehensive summary of client intake form data
   */
  summarizeIntakeForm: async (formData: IntakeFormData): Promise<IntakeSummaryResult> => {
    try {
      // Select appropriate model for content generation
      const model = selectModelForFeature(AIFeatureType.ContentGeneration);
      
      // Create a formatted prompt with all relevant intake form information
      const promptContent = `
        Analyze this client intake form data and create a professional summary:
        
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
        1. A concise summary of what the client wants
        2. Highlight their tone preferences, design direction, and top priorities
        3. Generate draft homepage copy including a header, subtext, and call-to-action
      `;
      
      const systemPrompt = `
        You are an expert web design strategist who specializes in analyzing client requirements
        and translating them into clear, actionable insights for design teams. Your summaries
        should be professional, concise, and highlight the most important aspects of the client's
        needs while suggesting appropriate copy that matches their tone and objectives.
      `;
      
      // Call OpenAI via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.7,
          model,
        },
      });
      
      if (error) throw error;
      
      // Process the response to structure it properly
      const response = data.response;
      
      // Parse the structured response
      // Note: In a production environment, we'd use a more robust parsing approach
      // This is a simplified example
      const sections = response.split(/\n\d+\.\s/).filter(Boolean);
      
      const summarySection = sections[0] || "";
      const highlightsSection = sections[1] || "";
      const copySection = sections[2] || "";
      
      // Extract tone from highlights section
      const toneMatch = highlightsSection.match(/tone:?\s*([^,.]+)/i);
      const tone = toneMatch ? 
        toneMatch[1].split(',').map((t: string) => t.trim()).filter(Boolean) : 
        ['professional'];
        
      // Extract direction
      const directionMatch = highlightsSection.match(/direction:?\s*([^,.]+)/i);
      const direction = directionMatch ? directionMatch[1].trim() : 'clean and modern';
      
      // Extract priorities
      const prioritiesMatch = highlightsSection.match(/priorities:?\s*([^.]+)/i);
      const priorities = prioritiesMatch ? 
        prioritiesMatch[1].split(',').map((p: string) => p.trim()).filter(Boolean) : 
        ['usability', 'clear messaging'];
      
      // Extract copy elements
      const headerMatch = copySection.match(/header:?\s*"([^"]+)"/i);
      const header = headerMatch ? headerMatch[1].trim() : "Welcome to Our Website";
      
      const subtextMatch = copySection.match(/subtext:?\s*"([^"]+)"/i);
      const subtext = subtextMatch ? subtextMatch[1].trim() : "We create solutions that work for you";
      
      const ctaMatch = copySection.match(/call-to-action:?\s*"([^"]+)"/i);
      const cta = ctaMatch ? ctaMatch[1].trim() : "Get Started Today";
      
      return {
        summary: summarySection.trim(),
        tone,
        direction,
        priorities,
        draftCopy: {
          header,
          subtext,
          cta
        }
      };
    } catch (error) {
      console.error("Error generating intake summary:", error);
      // Provide a fallback response in case of error
      return {
        summary: "We were unable to generate a summary. Please try again later.",
        tone: ["professional"],
        direction: "modern",
        priorities: ["user experience"],
        draftCopy: {
          header: "Welcome",
          subtext: "Thanks for your submission",
          cta: "Get Started"
        }
      };
    }
  }
};
