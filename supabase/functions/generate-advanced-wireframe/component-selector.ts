import { callOpenAI } from "./openai-client.ts";

/**
 * Select appropriate component variants for the wireframe based on its purpose and style
 */
export async function selectComponentVariants(blueprint: any): Promise<any> {
  console.log("Selecting component variants...");
  
  // If no sections, return blueprint as is
  if (!blueprint || !blueprint.sections || blueprint.sections.length === 0) {
    console.log("No sections found in blueprint for component selection");
    return blueprint;
  }
  
  // Define component variants for common section types
  const componentVariantLibrary = {
    hero: ["centered", "split", "background-image", "video-background", "animated", "minimal"],
    features: ["grid", "cards", "icons", "tabs", "accordion", "carousel"],
    testimonials: ["quotes", "cards", "slider", "grid", "video"],
    pricing: ["columns", "toggle", "cards", "table", "tiered"],
    cta: ["centered", "split", "banner", "popup", "floating"],
    footer: ["simple", "multi-column", "social-focused", "newsletter", "map"],
    nav: ["horizontal", "vertical", "hamburger", "mega-menu", "transparent"],
    gallery: ["grid", "masonry", "carousel", "lightbox", "filterable"],
    contact: ["inline", "split", "map", "multi-step", "floating"],
    team: ["grid", "cards", "list", "carousel", "directory"],
    faq: ["accordion", "tabs", "grouped", "search", "categories"],
  };
  
  try {
    // If the blueprint already has appropriate component variants defined, just validate and return
    let allSectionsHaveVariants = true;
    const sectionsWithMissingVariants = [];
    
    for (const section of blueprint.sections) {
      const sectionType = section.sectionType?.toLowerCase() || "";
      if (!section.componentVariant) {
        allSectionsHaveVariants = false;
        sectionsWithMissingVariants.push(section);
      }
    }
    
    // If all sections have variants, return as is
    if (allSectionsHaveVariants) {
      return blueprint;
    }
    
    // For sections missing variants, automatically assign the most appropriate one
    for (const section of sectionsWithMissingVariants) {
      const sectionType = section.sectionType?.toLowerCase() || "";
      
      // Extract base type (e.g., "hero-centered" -> "hero")
      const baseType = Object.keys(componentVariantLibrary).find(type => 
        sectionType === type || sectionType.startsWith(`${type}-`)
      );
      
      if (baseType && componentVariantLibrary[baseType]) {
        // If section type already includes variant (e.g., "hero-centered"), extract it
        const variantMatch = sectionType.match(new RegExp(`${baseType}-(.+)`));
        if (variantMatch && variantMatch[1]) {
          section.componentVariant = variantMatch[1];
        } else {
          // Otherwise assign the first/default variant
          section.componentVariant = componentVariantLibrary[baseType][0];
        }
      }
    }
    
    // For more complex or ambiguous cases, use AI to suggest variants
    const prompt = `
Analyze this wireframe blueprint and select the most appropriate component variant for each section:

${JSON.stringify(blueprint, null, 2)}

For each section in the wireframe:
1. Identify the section type (e.g., hero, features, testimonials)
2. Select the most appropriate component variant based on:
   - The purpose of the website/page
   - Target audience
   - Visual style/tone
   - Content needs
3. Update the section's "componentVariant" property with the selected variant

Available component variants:
${JSON.stringify(componentVariantLibrary, null, 2)}

Return the updated blueprint with component variants selected for all sections.
Return only valid JSON without any explanations or comments.
`;

    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI component specialist who selects the most appropriate component variants for wireframes.',
      temperature: 0.4,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    // Extract the JSON object from the response
    let updatedBlueprint;
    try {
      updatedBlueprint = JSON.parse(response);
    } catch (parseError) {
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
      if (!jsonMatch || !jsonMatch[0]) {
        console.error("Failed to extract component variants from AI response");
        return blueprint; // Return original blueprint if we couldn't parse the response
      }

      try {
        updatedBlueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      } catch (innerParseError) {
        console.error("Error parsing component variants JSON:", innerParseError);
        return blueprint; // Return original blueprint if we couldn't parse the response
      }
    }
    
    console.log("Component variant selection successful");
    return updatedBlueprint;
    
  } catch (error) {
    console.error("Error selecting component variants:", error);
    
    // If AI selection fails, manually assign default variants
    for (const section of blueprint.sections) {
      const sectionType = section.sectionType?.toLowerCase() || "";
      
      // Extract base type (e.g., "hero-centered" -> "hero")
      for (const baseType of Object.keys(componentVariantLibrary)) {
        if (sectionType === baseType || sectionType.startsWith(`${baseType}-`)) {
          if (!section.componentVariant) {
            section.componentVariant = componentVariantLibrary[baseType][0];
          }
          break;
        }
      }
      
      // If no match found, assign a generic variant
      if (!section.componentVariant) {
        section.componentVariant = "standard";
      }
    }
    
    return blueprint; // Return blueprint with fallback variants
  }
}
