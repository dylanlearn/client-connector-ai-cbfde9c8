import { v4 as uuidv4 } from 'uuid';
import { 
  generateWireframeFromPrompt, 
  generateWireframeVariation 
} from './api/wireframe-generator';
import { getSuggestedCopy } from './content/copy-suggestions';
import { getCombinedAIMemory } from './wireframe-memory-service';
import { WireframeData, WireframeGenerationParams, WireframeGenerationResult } from './wireframe-types';

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
    
    // Simulate wireframe generation for now to avoid API calls
    const wireframe: WireframeData = {
      id: uuidv4(),
      title: params.description ? `Wireframe: ${params.description.substring(0, 30)}...` : 'New Wireframe',
      description: params.description || 'Generated wireframe',
      sections: [
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
      ],
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
