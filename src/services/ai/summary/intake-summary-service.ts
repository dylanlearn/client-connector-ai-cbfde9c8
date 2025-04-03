
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
        Review this client intake form data and create a professional yet conversational summary:
        
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
        1. A concise, friendly summary of what the client is looking for (avoid bullet points or markdown formatting)
        2. Their tone preferences and design direction in a conversational style
        3. Their top priorities written in a natural way
        4. Draft homepage copy including a compelling header, engaging subtext, and persuasive call-to-action
      `;
      
      const systemPrompt = `
        You are a skilled creative director who specializes in translating client requirements
        into clear, actionable insights for design teams. Your summaries should be written in a 
        natural, conversational tone - as if you're speaking directly to a colleague. Avoid technical 
        jargon, markdown formatting, bullets, or numbered lists in your response. Instead, use 
        natural language and paragraphs. When suggesting copy, make it sound authentic and human, 
        not corporate or AI-generated.
      `;
      
      // Call OpenAI via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.8,
          model,
        },
      });
      
      if (error) throw error;
      
      // Process the response to structure it properly
      const response = data.response;
      
      // Parse the structured response - improved parsing approach
      // Split by sections while preserving natural language flow
      const summaryRegex = /summary|overview|client needs/i;
      const toneRegex = /tone|voice|style|personality/i;
      const directionRegex = /direction|design direction|aesthetic|look and feel/i;
      const prioritiesRegex = /priorities|key focus|important aspects|main concerns/i;
      const copyRegex = /copy|content|text|messaging|header|subtext|cta/i;
      
      const sections = response.split(/\n\n+/);
      
      // Find the most relevant sections using the regexes
      const summarySection = sections.find(s => summaryRegex.test(s)) || sections[0] || "";
      const toneSection = sections.find(s => toneRegex.test(s)) || "";
      const directionSection = sections.find(s => directionRegex.test(s)) || "";
      const prioritiesSection = sections.find(s => prioritiesRegex.test(s)) || "";
      const copySection = sections.find(s => copyRegex.test(s)) || sections[sections.length - 1] || "";
      
      // Extract tone more naturally (looking for descriptive words)
      const toneWords = toneSection.match(/\b(professional|friendly|casual|formal|playful|serious|modern|traditional|luxury|minimal|bold|subtle|elegant|sophisticated|approachable|authoritative|conversational|direct|warm|cool)\b/gi);
      // Fix: Add type assertion to ensure string array
      const tone = toneWords 
        ? Array.from(new Set(toneWords.map(w => w.toLowerCase()))) as string[]
        : ['professional', 'approachable'];
      
      // Extract direction more naturally
      let direction = "clean and modern design"; // default
      if (directionSection) {
        // Look for phrases after "direction:" or similar patterns
        const dirMatch = directionSection.match(/(?:direction|aesthetic|look and feel)[:\s]+([^.]+)/i);
        if (dirMatch) {
          direction = dirMatch[1].trim();
        } else {
          // Take the most relevant sentence
          const sentences = directionSection.split(/\.\s+/);
          direction = sentences[0].replace(/^[^a-z]+/i, '');
        }
      }
      
      // Extract priorities more naturally
      let priorities: string[] = ['usability', 'clear messaging'];
      if (prioritiesSection) {
        // Look for list-like patterns or comma-separated values
        const prioMatch = prioritiesSection.match(/(?:priorities|focus on|important)[:\s]+([^.]+)/i);
        if (prioMatch) {
          priorities = prioMatch[1].split(/,|;/).map(p => p.trim()).filter(Boolean);
        } else {
          // Extract key phrases by looking for emphasized words
          const keyPhrases = prioritiesSection.match(/\b(conversion|usability|aesthetics|performance|speed|accessibility|responsiveness|branding|clarity|simplicity|engagement|security|scalability|content|messaging|navigation|consistency|functionality|integration|SEO)[a-z]*/gi);
          if (keyPhrases && keyPhrases.length > 0) {
            // Fix: Add type assertion to ensure string array
            priorities = Array.from(new Set(keyPhrases.map(p => p.toLowerCase()))).slice(0, 5) as string[];
          }
        }
      }
      
      // Extract copy elements more naturally
      let header = "Welcome to Our Website";
      let subtext = "We create solutions that work for you";
      let cta = "Get Started";
      
      // Look for header patterns
      const headerMatch = copySection.match(/(?:header|headline|title)[:\s]+"?([^"\.]+)"?/i);
      if (headerMatch) {
        header = headerMatch[1].trim();
      }
      
      // Look for subtext patterns
      const subtextMatch = copySection.match(/(?:subtext|description|tagline|subtitle)[:\s]+"?([^"\.]+)"?/i);
      if (subtextMatch) {
        subtext = subtextMatch[1].trim();
      }
      
      // Look for CTA patterns
      const ctaMatch = copySection.match(/(?:cta|call to action|button)[:\s]+"?([^"\.]+)"?/i);
      if (ctaMatch) {
        cta = ctaMatch[1].trim();
      }
      
      // Clean up any markdown formatting or special characters from the summary
      const cleanedSummary = summarySection
        .replace(/#{1,6}\s/g, '')  // Remove markdown headers
        .replace(/\*\*/g, '')      // Remove bold markers
        .replace(/\*/g, '')        // Remove italic markers
        .replace(/^\s*[-*•]\s*/gm, '') // Remove bullet points
        .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered lists
        .trim();
      
      return {
        summary: cleanedSummary,
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
      // Provide a more human-friendly fallback response
      return {
        summary: "We couldn't generate a summary at the moment. This might be due to a temporary issue with our AI service.",
        tone: ["professional", "friendly"],
        direction: "clean and modern design with intuitive user experience",
        priorities: ["clear communication", "user-friendly navigation", "visual appeal"],
        draftCopy: {
          header: "Building Your Vision Together",
          subtext: "We're excited to bring your ideas to life with a thoughtfully designed digital experience.",
          cta: "Let's Begin"
        }
      };
    }
  }
};
