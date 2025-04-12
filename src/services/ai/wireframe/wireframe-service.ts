
import { v4 as uuidv4 } from 'uuid';
import { 
  generateWireframeFromPrompt, 
  generateWireframeVariation 
} from './api/wireframe-generator';
import { getSuggestedCopy } from './content/copy-suggestions';
import { getCombinedAIMemory } from './wireframe-memory-service';
import { WireframeData, WireframeGenerationParams, WireframeGenerationResult, WireframeSection } from './wireframe-types';

/**
 * Generate a new wireframe based on a description
 */
export const generateWireframe = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  try {
    console.log('Wireframe generation request:', params);
    
    // Process style if it's a string
    let processedStyle: Record<string, any> = {};
    if (params.style) {
      if (typeof params.style === 'object') {
        processedStyle = params.style;
      } else if (typeof params.style === 'string') {
        try {
          // Try to parse as JSON if it's a string
          processedStyle = JSON.parse(params.style);
        } catch (e) {
          // If not valid JSON, use it as a style description
          processedStyle = {
            description: params.style
          };
        }
      }
    }
    
    // Get previous context if available
    const memory = await getCombinedAIMemory();
    
    // Extract sections from description
    const sections = extractSectionsFromDescription(params.description);
    
    // Create wireframe data
    const wireframe: WireframeData = {
      id: uuidv4(),
      title: params.description ? `Wireframe: ${params.description.substring(0, 30)}...` : 'New Wireframe',
      description: params.description || 'Generated wireframe',
      sections: sections,
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827'
      },
      typography: {
        headings: 'Inter',
        body: 'Inter'
      }
    };
    
    // Add copy suggestions to the sections
    const wireframeWithCopy: WireframeData = {
      ...wireframe,
      sections: wireframe.sections.map((section) => {
        return {
          ...section,
          copySuggestions: getSuggestedCopy(section.sectionType)
        };
      })
    };
    
    return {
      wireframe: wireframeWithCopy,
      success: true,
      message: 'Wireframe generated successfully'
    };
  } catch (error) {
    console.error('Error in wireframe generation:', error);
    return {
      wireframe: null,
      success: false,
      message: `Error generating wireframe: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Extract sections from the description
 */
const extractSectionsFromDescription = (description: string): WireframeSection[] => {
  // If description is empty, return default sections
  if (!description) {
    return getDefaultSections();
  }
  
  // Try to identify sections based on common keywords
  const sectionTypes = [
    { keyword: /navigation|nav\s+bar|navbar|header/i, type: 'navigation', name: 'Navigation' },
    { keyword: /hero|banner|intro|introduction/i, type: 'hero', name: 'Hero' },
    { keyword: /feature|features/i, type: 'features', name: 'Features' },
    { keyword: /testimonial|review|testimonials/i, type: 'testimonials', name: 'Testimonials' },
    { keyword: /pricing|plans|subscription|package/i, type: 'pricing', name: 'Pricing Plans' },
    { keyword: /faq|questions|accordion/i, type: 'faq', name: 'FAQ' },
    { keyword: /contact|form|get in touch/i, type: 'contact', name: 'Contact' },
    { keyword: /footer/i, type: 'footer', name: 'Footer' },
    { keyword: /cta|call to action/i, type: 'cta', name: 'Call To Action' }
  ];
  
  // Start with an empty array for extracted sections
  const extractedSections: WireframeSection[] = [];
  
  // Look for each section type in the description
  sectionTypes.forEach(({ keyword, type, name }) => {
    if (keyword.test(description)) {
      extractedSections.push({
        id: uuidv4(),
        name: name,
        sectionType: type,
        description: `${name} section`,
        componentVariant: getVariantForType(type),
        components: []
      });
    }
  });
  
  // If no sections were found, return default sections
  if (extractedSections.length === 0) {
    return getDefaultSections();
  }
  
  return extractedSections;
};

/**
 * Get default sections for a wireframe
 */
const getDefaultSections = (): WireframeSection[] => {
  return [
    {
      id: uuidv4(),
      name: 'Navigation',
      sectionType: 'navigation',
      description: 'Main navigation bar',
      componentVariant: 'horizontal',
      components: []
    },
    {
      id: uuidv4(),
      name: 'Hero',
      sectionType: 'hero',
      description: 'Hero section with headline and call to action',
      componentVariant: 'centered',
      components: []
    },
    {
      id: uuidv4(),
      name: 'Features',
      sectionType: 'features',
      description: 'Key product features',
      componentVariant: 'grid',
      components: []
    }
  ];
};

/**
 * Get the default variant for a section type
 */
const getVariantForType = (sectionType: string): string => {
  switch (sectionType) {
    case 'navigation':
      return 'horizontal';
    case 'hero':
      return 'split';
    case 'features':
      return 'grid';
    case 'testimonials':
      return 'cards';
    case 'pricing':
      return 'columns';
    case 'faq':
      return 'accordion';
    case 'contact':
      return 'simple';
    case 'footer':
      return 'columns';
    case 'cta':
      return 'centered';
    default:
      return 'standard';
  }
};

/**
 * Generate a variation of an existing wireframe
 */
export const generateWireframeVariationWithStyle = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  try {
    console.log('Wireframe variation request:', params);
    
    // Generate the variation
    const result = await generateWireframeVariation(params);
    
    if (!result.success || !result.wireframe) {
      throw new Error(result.message || 'Failed to generate wireframe variation');
    }
    
    const wireframeVariation = result.wireframe;
    
    // Add copy suggestions to the sections
    const wireframeWithCopy: WireframeData = {
      ...wireframeVariation,
      sections: wireframeVariation.sections.map((section) => {
        return {
          ...section,
          copySuggestions: getSuggestedCopy(section.sectionType)
        };
      })
    };
    
    return {
      wireframe: wireframeWithCopy,
      success: true,
      message: 'Wireframe variation generated successfully'
    };
  } catch (error) {
    console.error('Error in wireframe variation generation:', error);
    return {
      wireframe: null,
      success: false,
      message: `Error generating wireframe variation: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Quick method to create an empty wireframe for testing/development
 */
export const createDefaultWireframe = (): WireframeData => {
  return {
    id: uuidv4(),
    title: 'Default Wireframe',
    description: 'A default wireframe for testing',
    sections: [
      {
        id: uuidv4(),
        name: 'Hero Section',
        sectionType: 'hero',
        components: []
      }
    ],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#000000'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };
};

/**
 * Create a minimal wireframe data object from partial data
 */
export const createMinimalWireframeData = (partialData: Partial<WireframeData> = {}): WireframeData => {
  const defaultWireframe = createDefaultWireframe();
  return {
    ...defaultWireframe,
    ...partialData,
    id: partialData.id || defaultWireframe.id,
    title: partialData.title || defaultWireframe.title,
    description: partialData.description || defaultWireframe.description,
    sections: partialData.sections || defaultWireframe.sections
  };
};

// Export as a named wireframeService object
export const wireframeService = {
  generateWireframe,
  generateWireframeVariationWithStyle,
  createDefaultWireframe,
  createMinimalWireframeData
};

export default wireframeService;
