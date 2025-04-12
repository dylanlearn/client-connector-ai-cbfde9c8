
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeGenerationParams,
  WireframeGenerationResult,
  WireframeData,
  WireframeSection
} from './wireframe-types';
import { wireframeApiService } from './api/wireframe-api-service';

/**
 * Generate a wireframe from input parameters
 */
export const generateWireframe = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  try {
    console.log('Generating wireframe with params:', params);
    
    // Extract sections from the description
    const sections = extractSectionsFromPrompt(params.description);
    
    // Create a wireframe with the extracted sections
    const wireframe: WireframeData = {
      id: uuidv4(),
      title: `Wireframe: ${params.description.substring(0, 30)}...`,
      description: params.description || 'Generated wireframe',
      sections: sections,
      colorScheme: params.colorScheme || {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1a202c'
      },
      typography: {
        headings: 'Inter',
        body: 'Inter'
      }
    };

    return {
      wireframe,
      success: true,
      message: 'Wireframe generated successfully'
    };
  } catch (error) {
    console.error('Error generating wireframe:', error);
    return {
      wireframe: null,
      success: false,
      message: `Failed to generate wireframe: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Generate a variation of a wireframe with style changes
 */
export const generateWireframeVariationWithStyle = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  try {
    console.log('Generating wireframe variation with params:', params);
    
    // For variations, we'll use the same approach but modify some aspects
    return generateWireframe({
      ...params,
      description: `Variation of: ${params.description}`
    });
  } catch (error) {
    console.error('Error generating wireframe variation:', error);
    return {
      wireframe: null,
      success: false,
      message: `Failed to generate variation: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Extract sections from a prompt description
 */
function extractSectionsFromPrompt(prompt: string): WireframeSection[] {
  const sections: WireframeSection[] = [];
  
  // Common section types to look for in prompts
  const sectionTypes = [
    { 
      name: 'Navigation', 
      type: 'navigation',
      keywords: ['navigation', 'navbar', 'nav', 'header', 'menu']
    },
    { 
      name: 'Hero', 
      type: 'hero',
      keywords: ['hero', 'header section', 'main banner', 'banner']
    },
    { 
      name: 'Features', 
      type: 'features',
      keywords: ['feature', 'features', 'key points', 'highlights']
    },
    { 
      name: 'Testimonials', 
      type: 'testimonials',
      keywords: ['testimonial', 'review', 'quote', 'customer story']
    },
    { 
      name: 'Pricing', 
      type: 'pricing',
      keywords: ['pricing', 'plans', 'packages', 'subscription']
    },
    { 
      name: 'FAQ', 
      type: 'faq',
      keywords: ['faq', 'accordion', 'questions', 'answers']
    },
    { 
      name: 'CTA', 
      type: 'cta',
      keywords: ['cta', 'call to action', 'action']
    },
    { 
      name: 'Footer', 
      type: 'footer',
      keywords: ['footer', 'bottom']
    }
  ];
  
  // If we detect specific sections in the prompt, add them
  for (const sectionDef of sectionTypes) {
    for (const keyword of sectionDef.keywords) {
      if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
        sections.push({
          id: uuidv4(),
          name: sectionDef.name,
          sectionType: sectionDef.type,
          description: `${sectionDef.name} section`,
          componentVariant: 'standard'
        });
        // Break after finding the first keyword match for this section type
        break;
      }
    }
  }
  
  // If no sections were detected, create some default ones
  if (sections.length === 0) {
    sections.push(
      {
        id: uuidv4(),
        name: 'Navigation',
        sectionType: 'navigation',
        description: 'Main navigation bar',
        componentVariant: 'standard'
      },
      {
        id: uuidv4(),
        name: 'Hero',
        sectionType: 'hero',
        description: 'Hero section with headline and call to action',
        componentVariant: 'standard'
      },
      {
        id: uuidv4(),
        name: 'Content',
        sectionType: 'content',
        description: 'Main content area',
        componentVariant: 'standard'
      }
    );
  }
  
  return sections;
}

// Export for use in other files
export const wireframeService = {
  generateWireframe,
  generateWireframeVariationWithStyle
};

export default wireframeService;
