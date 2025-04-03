
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
      
      // Split by paragraphs to preserve natural flow
      const paragraphs = response.split(/\n\n+/);
      
      // Define regex patterns for finding relevant sections
      const summaryRegex = /summary|overview|client needs|from what i can see|looking at|based on|after reviewing/i;
      const toneRegex = /tone|voice|style|feel|personality|sound|appear|impression|vibe/i;
      const directionRegex = /direction|design direction|aesthetic|look and feel|visual|appearance/i;
      const prioritiesRegex = /priorities|key focus|important aspects|main concerns|focus on|emphasis/i;
      const copyRegex = /copy|content|text|messaging|header|subtext|cta|headline|call to action/i;
      
      // Find the most relevant sections using the regexes
      const summaryParagraph = paragraphs.find(p => summaryRegex.test(p)) || paragraphs[0] || "";
      const toneParagraph = paragraphs.find(p => toneRegex.test(p)) || "";
      const directionParagraph = paragraphs.find(p => directionRegex.test(p)) || "";
      const prioritiesParagraph = paragraphs.find(p => prioritiesRegex.test(p)) || "";
      const copyParagraph = paragraphs.find(p => copyRegex.test(p)) || paragraphs[paragraphs.length - 1] || "";
      
      // Extract tone words naturally (looking for descriptive words)
      const toneWords = toneParagraph.match(/\b(professional|friendly|casual|formal|playful|serious|modern|traditional|luxury|minimal|bold|subtle|elegant|sophisticated|approachable|authoritative|conversational|direct|warm|cool)\b/gi);
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
            priorities = Array.from(new Set(keyPhrases.map(p => p.toLowerCase()))).slice(0, 5) as string[];
          }
        }
      }
      
      // Extract copy elements more naturally
      let header = "Building Your Vision Together";
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
      
      // Format the summary with appropriate heading styles and bullet points
      const formattedSummary = response
        .replace(/^#+\s+(.+)$/gm, '### $1') // Standardize all headings to level 3
        .replace(/^\s*[-*•]\s*/gm, '- ') // Standardize bullet points
        .replace(/\*\*([^*]+)\*\*/g, '### $1'); // Convert bold text to headers
      
      return {
        summary: formattedSummary,
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
        summary: "### I couldn't generate a complete summary right now\n\nThis might be due to a temporary issue with our AI service. The good news is that we've saved all your responses, so we can try again in a moment.",
        tone: ["professional", "friendly"],
        direction: "clean and modern design with intuitive user experience",
        priorities: ["clear communication", "user-friendly navigation", "visual appeal"],
        draftCopy: {
          header: "Building Your Vision Together",
          subtext: "We're excited to bring your ideas to life with a thoughtfully designed digital experience that reflects your unique brand.",
          cta: "Let's Begin"
        }
      };
    }
  }
};
