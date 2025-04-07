
import { Blueprint } from "./blueprint-generator.ts";
import { callOpenAI } from "./openai-client.ts";

/**
 * Applies style modifiers to the wireframe
 */
export async function applyStyleModifiers(wireframe: Blueprint, styleToken: string = 'modern'): Promise<Blueprint> {
  if (!wireframe || typeof wireframe !== 'object') {
    throw new Error('Valid wireframe data is required for style modification');
  }

  const prompt = `
Apply a unified visual style across this layout: ${styleToken}.
Style options include: brutalist, soft, glassy, corporate, playful, editorial, tech-forward.

Current wireframe: ${JSON.stringify(wireframe)}

Adjust layout spacing, text hierarchy, borders, backgrounds, and shadows to match the style.
Return the wireframe with style properties added to each section.

For each section, add:
- styleProperties (color scheme, spacing, typography, shadows, etc.)
- visualPlaceholders (placeholder guidance for images, icons, etc.)
- designTokens (specific CSS-like values that reflect the style)

Return a JSON object with the original wireframe structure but with these style enhancements.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI stylist. Apply cohesive visual styles to wireframes.'
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      const styledWireframe = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      
      // Add the style token to the wireframe
      return {
        ...styledWireframe,
        styleToken: styleToken,
        title: wireframe.title || `${styleToken.charAt(0).toUpperCase() + styleToken.slice(1)} Wireframe`,
        description: wireframe.description || `A ${styleToken} style wireframe with multiple sections`
      };
    }
    
    // If we can't parse the response, add minimal style information
    return {
      ...wireframe,
      styleToken: styleToken,
      title: wireframe.title || `${styleToken.charAt(0).toUpperCase() + styleToken.slice(1)} Wireframe`,
      description: wireframe.description || `A ${styleToken} style wireframe with multiple sections`
    };
  } catch (error) {
    console.error("Error parsing style modifiers:", error);
    // Return original with minimal style information
    return {
      ...wireframe,
      styleToken: styleToken
    };
  }
}
