
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
        natural, conversational tone - as if you're speaking directly to a colleague. 
        
        IMPORTANT: Do not use any markdown formatting like headings (###) or bullet points (*). 
        Write in natural paragraphs with a warm, human voice.
        
        When suggesting copy, make it sound authentic and human, not corporate or AI-generated.
        Avoid using technical jargon or complex terminology.
        
        For example, instead of:
        "### Summary
        * Client requires a responsive website
        * Modern aesthetic is preferred
        * Focus on conversion"
        
        Write it as:
        "From what I can see, this client is looking for a responsive website with a modern aesthetic. 
        They're particularly focused on conversion rates."
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
      const summaryRegex = /summary|overview|client needs|from what i can see|looking at|based on|after reviewing/i;
      const toneRegex = /tone|voice|style|feel|personality|sound|appear|impression|vibe/i;
      const directionRegex = /direction|design direction|aesthetic|look and feel|visual|appearance/i;
      const prioritiesRegex = /priorities|key focus|important aspects|main concerns|focus on|emphasis/i;
      const copyRegex = /copy|content|text|messaging|header|subtext|cta|headline|call to action/i;
      
      // Split by paragraphs to preserve natural flow
      const paragraphs = response.split(/\n\n+/);
      
      // Find the most relevant sections using the regexes
      const summaryParagraph = paragraphs.find(p => summaryRegex.test(p)) || paragraphs[0] || "";
      const toneParagraph = paragraphs.find(p => toneRegex.test(p)) || "";
      const directionParagraph = paragraphs.find(p => directionRegex.test(p)) || "";
      const prioritiesParagraph = paragraphs.find(p => prioritiesRegex.test(p)) || "";
      const copyParagraph = paragraphs.find(p => copyRegex.test(p)) || paragraphs[paragraphs.length - 1] || "";
      
      // Extract tone more naturally (looking for descriptive words)
      const toneWords = toneParagraph.match(/\b(professional|friendly|casual|formal|playful|serious|modern|traditional|luxury|minimal|bold|subtle|elegant|sophisticated|approachable|authoritative|conversational|direct|warm|cool)\b/gi);
      // Fix: Add type assertion to ensure string array
      const tone = toneWords 
        ? Array.from(new Set(toneWords.map(w => w.toLowerCase()))) as string[]
        : ['professional', 'approachable'];
      
      // Extract direction more naturally
      let direction = "clean and modern design"; // default
      if (directionParagraph) {
        // Look for phrases after key terms
        const dirMatch = directionParagraph.match(/(?:direction|aesthetic|look and feel|visual|design)[:\s]+([^.]+)/i);
        if (dirMatch) {
          direction = dirMatch[1].trim();
        } else {
          // Take the most relevant sentence
          const sentences = directionParagraph.split(/\.\s+/);
          direction = sentences[0].replace(/^[^a-z]+/i, '');
        }
      }
      
      // Extract priorities more naturally
      let priorities: string[] = ['usability', 'clear messaging'];
      if (prioritiesParagraph) {
        // Look for natural language lists or key phrases
        const prioMatch = prioritiesParagraph.match(/(?:priorities|focus on|important)[:\s]+([^.]+)/i);
        if (prioMatch) {
          priorities = prioMatch[1].split(/,|;/).map(p => p.trim()).filter(Boolean);
        } else {
          // Extract key phrases by looking for emphasized words
          const keyPhrases = prioritiesParagraph.match(/\b(conversion|usability|aesthetics|performance|speed|accessibility|responsiveness|branding|clarity|simplicity|engagement|security|scalability|content|messaging|navigation|consistency|functionality|integration|SEO)[a-z]*/gi);
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
      
      // Look for natural language patterns for copy elements
      if (copyParagraph) {
        // Header
        const headerMatch = copyParagraph.match(/(?:header|headline|title|heading)[:\s]+"?([^"\.]+)"?/i) || 
                           copyParagraph.match(/suggest (?:using|going with) "([^"]+)"/i);
        if (headerMatch) {
          header = headerMatch[1].trim();
        }
        
        // Subtext
        const subtextMatch = copyParagraph.match(/(?:subtext|description|tagline|subtitle)[:\s]+"?([^"\.]+)"?/i) || 
                            copyParagraph.match(/followed by "([^"]+)"/i);
        if (subtextMatch) {
          subtext = subtextMatch[1].trim();
        }
        
        // CTA
        const ctaMatch = copyParagraph.match(/(?:cta|call to action|button)[:\s]+"?([^"\.]+)"?/i) || 
                         copyParagraph.match(/button (?:saying|reading) "([^"]+)"/i);
        if (ctaMatch) {
          cta = ctaMatch[1].trim();
        }
      }
      
      // Clean up any markdown formatting or special characters from the summary
      const cleanedSummary = summaryParagraph
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
