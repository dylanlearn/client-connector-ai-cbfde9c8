
// Intent extractor module for the advanced wireframe generator
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";

interface IntentData {
  primaryPurpose: string;
  targetAudience: string;
  keyElements: string[];
  suggestedLayout: string;
  contentTypes: string[];
  callToAction: string;
  visualTone: string;
  specialRequirements?: string[];
  techStack?: string[];
}

export async function extractIntent(userInput: string, styleToken?: string): Promise<IntentData> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable in your Supabase project settings.");
    }

    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    // Enhanced system prompt for better intent extraction
    const systemPrompt = `You are a specialist in UI/UX design and web development requirements analysis.
Your task is to extract key design intents from the user's description to guide the wireframe generation process.
Return ONLY a JSON object with no additional text. The JSON should contain these fields:
- primaryPurpose: The main goal of the page or application described
- targetAudience: The intended users
- keyElements: Array of key UI elements that must be included
- suggestedLayout: A layout pattern recommendation (e.g., Z-pattern, F-pattern, cards, etc.)
- contentTypes: Array of content types needed (e.g., text, images, videos, forms)
- callToAction: Main CTA for the page
- visualTone: Overall visual style (e.g., minimalist, bold, corporate, playful)
- specialRequirements: Optional array of special requirements or constraints
- techStack: Optional array of technology requirements if mentioned`;

    // Add style token if provided
    const userPrompt = styleToken 
      ? `${userInput}\n\nPreferred visual style: ${styleToken}` 
      : userInput;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
    });

    // Get the assistant's message content
    const assistantMessage = response.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error("Failed to get a complete response from OpenAI");
    }

    console.log("Raw intent data:", assistantMessage);

    // Parse the JSON response
    try {
      const intentData = JSON.parse(assistantMessage) as IntentData;
      return intentData;
    } catch (parseError) {
      console.error("Failed to parse intent data JSON:", parseError);
      console.log("Raw content that failed parsing:", assistantMessage);
      
      // Provide a simplified fallback
      return {
        primaryPurpose: "Website or application page",
        targetAudience: "General users",
        keyElements: ["Header", "Content section", "Footer"],
        suggestedLayout: "Standard layout",
        contentTypes: ["Text", "Images"],
        callToAction: "Primary action",
        visualTone: styleToken || "Modern"
      };
    }
  } catch (error) {
    console.error("Error in extractIntent:", error);
    
    // Check for API key related errors
    if (error.message && error.message.includes("API key")) {
      throw error; // Rethrow API key errors for proper handling
    }
    
    // Return fallback data for other errors
    return {
      primaryPurpose: "Website or application page",
      targetAudience: "General users",
      keyElements: ["Header", "Content section", "Footer"],
      suggestedLayout: "Standard layout",
      contentTypes: ["Text", "Images"],
      callToAction: "Primary action",
      visualTone: styleToken || "Modern"
    };
  }
}
