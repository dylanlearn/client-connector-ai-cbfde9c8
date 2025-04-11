
import { callOpenAI } from "./openai-client.ts";

/**
 * Select appropriate component variants for each section in the wireframe
 */
export async function selectComponentVariants(blueprint: any): Promise<any> {
  if (!blueprint || !blueprint.sections || blueprint.sections.length === 0) {
    return blueprint;
  }
  
  // Prepare a deep copy to avoid modifying the original blueprint
  const enhancedBlueprint = JSON.parse(JSON.stringify(blueprint));
  
  // Process each section to add appropriate component variants
  for (let i = 0; i < enhancedBlueprint.sections.length; i++) {
    const section = enhancedBlueprint.sections[i];
    
    // Only process sections that don't already have a componentVariant
    if (!section.componentVariant) {
      section.componentVariant = selectVariantForSectionType(section.sectionType);
    }
    
    // Add copySuggestions if not present
    if (!section.copySuggestions) {
      section.copySuggestions = generateCopySuggestions(section);
    }
  }
  
  return enhancedBlueprint;
}

/**
 * Select an appropriate component variant based on section type
 */
function selectVariantForSectionType(sectionType: string): string {
  const variantMappings: Record<string, string[]> = {
    'hero': ['centered', 'split', 'fullscreen', 'minimal', 'animated'],
    'features': ['grid', 'cards', 'list', 'alternating', 'tabbed'],
    'testimonials': ['carousel', 'grid', 'masonry', 'quotes', 'cards'],
    'pricing': ['comparative', 'cards', 'tiered', 'simple', 'toggle'],
    'contact': ['simple', 'split', 'map', 'fullWidth', 'boxed'],
    'footer': ['simple', 'multiColumn', 'minimal', 'centered', 'social'],
    'navigation': ['horizontal', 'sticky', 'hamburger', 'sidebar', 'transparent'],
    'cta': ['centered', 'banner', 'split', 'floating', 'fullWidth'],
    'gallery': ['grid', 'masonry', 'carousel', 'fullscreen', 'lightbox'],
    'about': ['team', 'story', 'timeline', 'values', 'mission'],
    'faq': ['accordion', 'tabs', 'grid', 'simple', 'searchable']
  };
  
  // Get available variants for this section type or use a default set
  const variants = variantMappings[sectionType] || ['standard', 'minimal', 'detailed', 'custom'];
  
  // Select a random variant from the available options
  const randomIndex = Math.floor(Math.random() * variants.length);
  return variants[randomIndex];
}

/**
 * Generate copy suggestions based on the section type and purpose
 */
function generateCopySuggestions(section: any): Record<string, string> {
  const suggestions: Record<string, string> = {};
  
  // Add default heading based on section name
  suggestions.heading = section.name;
  
  switch (section.sectionType) {
    case 'hero':
      suggestions.subheading = "Discover what makes us different";
      suggestions.ctaText = "Get Started";
      break;
    case 'features':
      suggestions.subheading = "Our key features and benefits";
      break;
    case 'testimonials':
      suggestions.heading = "What Our Clients Say";
      suggestions.subheading = "Trusted by businesses worldwide";
      break;
    case 'pricing':
      suggestions.heading = "Simple, Transparent Pricing";
      suggestions.subheading = "No hidden fees. Choose the plan that works for you.";
      break;
    case 'contact':
      suggestions.heading = "Get In Touch";
      suggestions.subheading = "We'd love to hear from you";
      break;
    case 'cta':
      suggestions.heading = "Ready to Get Started?";
      suggestions.ctaText = "Join Now";
      break;
    default:
      suggestions.subheading = "Learn more about " + (section.name || section.sectionType);
      break;
  }
  
  return suggestions;
}
