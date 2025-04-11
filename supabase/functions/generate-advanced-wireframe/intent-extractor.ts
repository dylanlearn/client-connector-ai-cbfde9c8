
import { callOpenAI } from "./openai-client.ts";

/**
 * Extract design intent from user input for wireframe generation
 */
export async function extractIntent(userInput: string, styleToken?: string): Promise<any> {
  const systemPrompt = `You are an expert UX/UI designer who analyzes user requirements and extracts clear design intent. 
  Extract the following information from the user's wireframe request:
  1. Page Purpose: What is this page for?
  2. Target Audience: Who will use this page?
  3. Key Sections: What are the main content sections needed?
  4. Visual Tone: What visual style is appropriate?
  5. Color Preferences: Any color preferences mentioned?
  6. Functionality: What interactive elements are needed?
  
  Format your response as a valid JSON object with these keys.`;

  const userPrompt = `Analyze this wireframe request and extract the design intent:
  "${userInput}"
  ${styleToken ? `Style preference: ${styleToken}` : ''}
  `;

  try {
    const response = await callOpenAI(userPrompt, {
      systemMessage: systemPrompt,
      temperature: 0.3,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });

    // Parse the response into a JSON object
    let intentData;
    try {
      intentData = JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse intent data JSON:", error);
      // Try to extract JSON if it's wrapped in markdown code blocks or text
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                         response.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        intentData = JSON.parse(jsonMatch[1].trim());
      } else {
        // Provide a basic fallback
        intentData = {
          pagePurpose: "Website page based on user request",
          targetAudience: "Website visitors",
          keySections: ["Main content section"],
          visualTone: styleToken || "professional",
          colorPreferences: [],
          functionality: []
        };
      }
    }

    // Add a timestamp
    intentData.extractedAt = new Date().toISOString();
    
    // Add the original style token if provided
    if (styleToken) {
      intentData.styleToken = styleToken;
    }

    return intentData;
  } catch (error) {
    console.error("Error extracting intent:", error);
    // Return a basic fallback
    return {
      pagePurpose: "Website page based on user request",
      targetAudience: "Website visitors",
      keySections: ["Main content section"],
      visualTone: styleToken || "professional",
      colorPreferences: [],
      functionality: [],
      error: error.message
    };
  }
}
