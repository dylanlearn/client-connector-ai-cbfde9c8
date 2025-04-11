
import { callOpenAI } from "./openai-client.ts";

// Define the DesignIntent interface
export interface DesignIntent {
  purpose: string;
  targetAudience: string[];
  keyFeatures: string[];
  contentPriorities: string[];
  visualTone: string;
  brandPersonality?: string[];
  industryCategory?: string;
  interactionPatterns?: string[];
  inspirationalReferences?: string[];
  colorPreferences?: string[];
  functionalRequirements?: string[];
}

// Default design intent template
const defaultIntent: DesignIntent = {
  purpose: "General website",
  targetAudience: ["General users"],
  keyFeatures: ["Information display"],
  contentPriorities: ["Clarity", "Readability"],
  visualTone: "modern",
  brandPersonality: ["Professional"],
  industryCategory: "General",
  interactionPatterns: ["Standard navigation"],
  inspirationalReferences: [],
  colorPreferences: [],
  functionalRequirements: []
};

/**
 * Extract design intent from the user's input
 */
export async function extractIntent(
  userInput: string,
  styleHint?: string
): Promise<DesignIntent> {
  console.log("Extracting design intent from input");
  
  try {
    const prompt = `
Analyze this wireframe request and extract the design intent:

"${userInput}"

${styleHint ? `The user has indicated a style preference of: "${styleHint}"` : ''}

Extract the following information:
1. Purpose: What is the main purpose of this website/app?
2. Target audience: Who will use this wireframe?
3. Key features: What are the main features or sections needed?
4. Content priorities: What content should be emphasized?
5. Visual tone: What visual style is appropriate (modern, minimal, playful, etc.)?
6. Brand personality: What traits should the design convey?
7. Industry category: What industry is this for?
8. Interaction patterns: What user interactions are important?
9. Inspirational references: Any references mentioned?
10. Color preferences: Any color preferences mentioned?
11. Functional requirements: Any specific functional needs?

Return ONLY a valid JSON object with these properties. Do not include ANY explanatory text or notes.
`;

    const response = await callOpenAI(prompt, {
      systemMessage: "You are an expert UX researcher specializing in analyzing design requirements and extracting intent.",
      temperature: 0.4,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    // Parse the response 
    let extractedIntent: DesignIntent;
    try {
      extractedIntent = JSON.parse(response);
    } catch (parseError) {
      // Try to extract JSON if direct parsing fails
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
      if (!jsonMatch || !jsonMatch[0]) {
        console.error("Failed to extract JSON from OpenAI response");
        throw new Error("Failed to parse intent extraction response");
      }
      
      try {
        extractedIntent = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      } catch (innerParseError) {
        console.error("Error parsing intent JSON:", innerParseError);
        throw new Error("Failed to parse intent data");
      }
    }
    
    console.log("Intent extraction successful");
    
    // Merge with defaults to ensure all properties exist
    return {
      ...defaultIntent,
      ...extractedIntent,
      // If style hint is provided and no visual tone was extracted, use the hint
      visualTone: extractedIntent.visualTone || styleHint || defaultIntent.visualTone
    };
  } catch (error) {
    console.error("Error extracting intent:", error);
    
    // Return default intent with style hint if available
    return {
      ...defaultIntent,
      visualTone: styleHint || defaultIntent.visualTone
    };
  }
}
