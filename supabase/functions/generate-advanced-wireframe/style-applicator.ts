
import { callOpenAI } from "./openai-client.ts";

// Style tokens and their corresponding CSS properties
const styleTokens = {
  "modern": {
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    colorPrimary: "#3B82F6",
    colorSecondary: "#10B981",
    colorAccent: "#F59E0B",
  },
  "minimal": {
    fontFamily: "system-ui, sans-serif",
    borderRadius: "0.25rem",
    boxShadow: "none",
    colorPrimary: "#000000",
    colorSecondary: "#666666",
    colorAccent: "#3B82F6",
  },
  "corporate": {
    fontFamily: "Arial, sans-serif",
    borderRadius: "0.35rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    colorPrimary: "#1E40AF",
    colorSecondary: "#374151",
    colorAccent: "#D97706",
  },
  "playful": {
    fontFamily: "Poppins, sans-serif",
    borderRadius: "1rem",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    colorPrimary: "#8B5CF6",
    colorSecondary: "#EC4899",
    colorAccent: "#F59E0B",
  },
  "elegant": {
    fontFamily: "Georgia, serif",
    borderRadius: "0.25rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    colorPrimary: "#1F2937",
    colorSecondary: "#4B5563",
    colorAccent: "#D1D5DB",
  },
  "brutalist": {
    fontFamily: "monospace",
    borderRadius: "0",
    boxShadow: "4px 4px 0px rgba(0, 0, 0, 1)",
    colorPrimary: "#000000",
    colorSecondary: "#000000",
    colorAccent: "#FF0000",
  },
  "retro": {
    fontFamily: "Courier, monospace",
    borderRadius: "0",
    boxShadow: "3px 3px 0px rgba(0, 0, 0, 1)",
    colorPrimary: "#FFA500",
    colorSecondary: "#FF4500",
    colorAccent: "#32CD32",
  }
};

/**
 * Apply style modifiers to the wireframe based on the style token
 */
export async function applyStyleModifiers(blueprint: any, styleToken: string = "modern"): Promise<any> {
  console.log(`Applying style modifiers: ${styleToken}`);
  
  // If no blueprint, return as is
  if (!blueprint) {
    console.log("No blueprint provided for style modification");
    return blueprint;
  }
  
  // Normalize style token
  const normalizedStyleToken = styleToken?.toLowerCase() || "modern";
  
  // Find the closest matching style token
  const matchingToken = Object.keys(styleTokens).find(
    token => normalizedStyleToken.includes(token) || token.includes(normalizedStyleToken)
  ) || "modern";
  
  // Get the style properties for the matching token
  const styleProperties = styleTokens[matchingToken as keyof typeof styleTokens] || styleTokens.modern;
  
  try {
    // Update the blueprint with the style properties
    if (!blueprint.colorScheme) {
      blueprint.colorScheme = {};
    }
    
    // Apply the color scheme based on style token
    blueprint.colorScheme.primary = blueprint.colorScheme.primary || styleProperties.colorPrimary;
    blueprint.colorScheme.secondary = blueprint.colorScheme.secondary || styleProperties.colorSecondary;
    blueprint.colorScheme.accent = blueprint.colorScheme.accent || styleProperties.colorAccent;
    blueprint.colorScheme.background = blueprint.colorScheme.background || "#FFFFFF";
    blueprint.colorScheme.text = blueprint.colorScheme.text || "#111827";
    
    // Apply typography if not already specified
    if (!blueprint.typography) {
      blueprint.typography = {
        headings: styleProperties.fontFamily,
        body: styleProperties.fontFamily
      };
    }
    
    // Add design tokens
    if (!blueprint.designTokens) {
      blueprint.designTokens = {};
    }
    
    blueprint.designTokens.borderRadius = blueprint.designTokens.borderRadius || styleProperties.borderRadius;
    blueprint.designTokens.boxShadow = blueprint.designTokens.boxShadow || styleProperties.boxShadow;
    
    // Add styleToken to the blueprint
    blueprint.styleToken = matchingToken;
    
    // For more complex style applications, use AI to enhance the styling
    const prompt = `
Apply the "${matchingToken}" style to this wireframe blueprint.

Enhance these sections with appropriate styling:
${JSON.stringify(blueprint.sections?.map((s: any) => s.name) || [], null, 2)}

The style properties to apply are:
${JSON.stringify(styleProperties, null, 2)}

For each section:
1. Add appropriate style properties based on the section type and styleToken
2. Ensure consistent visual styling across the wireframe
3. Adjust component variants to match the styleToken where appropriate
4. Keep the existing structure and content

Make the wireframe visually appealing while maintaining the "${matchingToken}" style theme.
Return only the updated blueprint as valid JSON.
`;

    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI designer specializing in applying consistent styles to wireframes.',
      temperature: 0.5,
      model: "gpt-4o-mini"
    });
    
    // Try to extract and parse the JSON from the response
    try {
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                        response.match(/\{[\s\S]*\}/);
                        
      if (jsonMatch && jsonMatch[0]) {
        const enhancedBlueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
        console.log("Style modifiers successfully applied with AI assistance");
        return enhancedBlueprint;
      }
    } catch (parseError) {
      console.error("Error parsing style-enhanced blueprint:", parseError);
      // Continue with manually styled blueprint if parsing fails
    }
    
    console.log("Style modifiers applied successfully (manual method)");
    return blueprint;
    
  } catch (error) {
    console.error("Error applying style modifiers:", error);
    return blueprint; // Return original blueprint if styling fails
  }
}
