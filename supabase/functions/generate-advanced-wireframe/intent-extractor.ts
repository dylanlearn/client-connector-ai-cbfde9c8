
import { callOpenAI } from "./openai-client.ts";

/**
 * Interface for design intent extracted from user input
 */
export interface DesignIntent {
  purpose: string;
  target: string;
  visualTone: string;
  layout?: string;
  content?: string[];
  specialRequirements?: string[];
  colorPreferences?: string[];
  typographyPreferences?: string[];
  accessibilityRequirements?: string[];
  conversionGoals?: string[];
  devicePriorities?: string[];
  [key: string]: any;
}

/**
 * Extract design intent from user input
 */
export async function extractIntent(userInput: string, styleToken?: string): Promise<DesignIntent> {
  console.log("Extracting design intent from user input");
  
  const prompt = `
Analyze this wireframe request to extract the design intent:

"${userInput}"

Extract the following information:
- Primary purpose of the website/app (e.g., ecommerce, portfolio, blog)
- Target audience
- Visual tone/style (unless a style token is provided)
- Layout preferences (if mentioned)
- Content needs
- Special features or requirements
- Color preferences (if mentioned)
- Typography preferences (if mentioned)
- Accessibility requirements (if mentioned)
- Conversion goals (what actions should users take)
- Device priorities (e.g., mobile-first, desktop-focused)

Return a structured JSON object with these fields, using null for any information not provided.
${styleToken ? `Note: The style token "${styleToken}" has been selected, so use this for the visual tone.` : ''}
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UX researcher who specializes in understanding user requirements and extracting design intent.',
      temperature: 0.3, // Lower temperature for more focused analysis
      model: "gpt-4o-mini"
    });
    
    // Extract the JSON object from the response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      throw new Error("Failed to extract intent data from AI response");
    }

    let intentData: DesignIntent;
    try {
      intentData = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing intent data JSON:", parseError);
      throw new Error("Failed to parse intent data");
    }
    
    // If style token is provided, override the visual tone
    if (styleToken) {
      intentData.visualTone = styleToken;
    }
    
    // Ensure required fields are present
    return {
      purpose: intentData.purpose || "general website",
      target: intentData.target || "general audience",
      visualTone: intentData.visualTone || styleToken || "modern",
      layout: intentData.layout || undefined,
      content: intentData.content || [],
      specialRequirements: intentData.specialRequirements || [],
      colorPreferences: intentData.colorPreferences || [],
      typographyPreferences: intentData.typographyPreferences || [],
      accessibilityRequirements: intentData.accessibilityRequirements || [],
      conversionGoals: intentData.conversionGoals || [],
      devicePriorities: intentData.devicePriorities || ["desktop", "mobile", "tablet"]
    };
    
  } catch (error) {
    console.error("Error extracting intent:", error);
    // Provide fallback intent if extraction fails
    return {
      purpose: "general website",
      target: "general audience",
      visualTone: styleToken || "modern",
      content: ["header", "hero", "features", "about", "contact", "footer"],
      specialRequirements: [],
      devicePriorities: ["desktop", "mobile", "tablet"]
    };
  }
}
