
import { callOpenAI } from "./openai-client.ts";

export interface DesignIntent {
  pageType: string;
  industryCategory: string;
  targetAudience: string;
  coreFunctionality: string[];
  keyFeatures: string[];
  contentPriorities: string[];
  visualTone: string;
  brandPersonality: string[];
  callToActionType: string;
  userGoals: string[];
  businessGoals: string[];
  usabilityConsiderations: string[];
  accessibilityNeeds: string[];
}

/**
 * Extract design intent from user input to guide wireframe generation
 */
export async function extractIntent(
  userInput: string,
  styleToken?: string
): Promise<DesignIntent> {
  console.log("Extracting design intent from input...");

  const prompt = `
Analyze this design request and extract the design intent in a structured format:

"${userInput}"

Extract and infer the following information (make reasonable assumptions for anything not explicitly stated):
- Page type (landing page, product page, dashboard, etc.)
- Industry category
- Target audience
- Core functionality needs
- Key features required
- Content priorities
- Visual tone/style ${styleToken ? `(considering the specified style: "${styleToken}")` : ''}
- Brand personality traits
- Call-to-action types
- User goals
- Business objectives
- Usability considerations
- Accessibility needs

Return a JSON object with these fields:
{
  "pageType": "",
  "industryCategory": "",
  "targetAudience": "",
  "coreFunctionality": [""],
  "keyFeatures": [""],
  "contentPriorities": [""],
  "visualTone": "",
  "brandPersonality": [""],
  "callToActionType": "",
  "userGoals": [""],
  "businessGoals": [""],
  "usabilityConsiderations": [""],
  "accessibilityNeeds": [""]
}

Only return valid JSON without any explanations or comments.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UX researcher who extracts design intent from client requirements.',
      temperature: 0.2,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    try {
      // Parse the JSON response
      let intent: DesignIntent;
      try {
        intent = JSON.parse(response);
      } catch (parseError) {
        // If direct parsing fails, attempt to extract JSON from a potentially text response
        const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                          response.match(/\{[\s\S]*\}/);
                          
        if (!jsonMatch || !jsonMatch[0]) {
          throw new Error("Failed to extract intent data from AI response");
        }
        
        intent = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      }
      
      console.log("Intent extraction successful");
      return intent;
    } catch (parseError) {
      console.error("Error parsing intent JSON:", parseError);
      throw new Error("Failed to parse intent data from AI response");
    }
  } catch (error) {
    console.error("Error extracting intent:", error);
    
    // Provide a fallback intent structure if extraction fails
    return {
      pageType: "generic website",
      industryCategory: "general",
      targetAudience: "general audience",
      coreFunctionality: ["information display"],
      keyFeatures: ["content sections"],
      contentPriorities: ["clear information hierarchy"],
      visualTone: styleToken || "professional",
      brandPersonality: ["reliable"],
      callToActionType: "learn more",
      userGoals: ["find information"],
      businessGoals: ["present information clearly"],
      usabilityConsiderations: ["intuitive navigation"],
      accessibilityNeeds: ["screen reader compatible"]
    };
  }
}
