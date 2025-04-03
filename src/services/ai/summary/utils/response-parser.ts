
import { IntakeSummaryResult } from "../types/intake-summary-types";

/**
 * Parses and structures AI responses into a formatted summary result
 */
export const parseAIResponse = (response: string): IntakeSummaryResult => {
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
};
