
import { v4 as uuidv4 } from 'uuid';
import {
  WireframeData,
  WireframeSection,
  WireframeGenerationParams,
  WireframeGenerationResult,
  normalizeWireframeGenerationParams,
  isWireframeData
} from './wireframe-types';

/**
 * Generate a wireframe based on the provided parameters
 */
export async function generateWireframe(params: WireframeGenerationParams): Promise<WireframeGenerationResult> {
  try {
    console.log('Generating wireframe with params:', JSON.stringify(params, null, 2));
    
    // Normalize parameters to ensure consistent format
    const normalizedParams = normalizeWireframeGenerationParams(params);
    
    // Validate required parameters
    if (!normalizedParams.description || normalizedParams.description.trim().length === 0) {
      throw new Error('Description is required for wireframe generation');
    }
    
    // In a real implementation, this would call the API or edge function
    // For now, we create a mock wireframe
    const wireframe: WireframeData = {
      id: normalizedParams.projectId ? `${normalizedParams.projectId}-${uuidv4()}` : uuidv4(),
      title: `Wireframe: ${normalizedParams.description.substring(0, 30)}...`,
      description: normalizedParams.description,
      sections: generateMockSections(normalizedParams.description),
      colorScheme: normalizedParams.colorScheme || {
        primary: '#3182ce',
        secondary: '#805ad5',
        accent: '#ed8936',
        background: '#ffffff',
        text: '#1a202c'
      },
      typography: {
        headings: 'Inter',
        body: 'Inter'
      },
      designReasoning: 'Auto-generated wireframe based on user description'
    };
    
    // Validate the generated wireframe
    const validationResult = await validateWireframe(wireframe);
    
    if (!validationResult.isValid) {
      console.error('Generated wireframe validation failed:', validationResult.errors);
      return {
        wireframe: null,
        success: false,
        message: `Generated wireframe is invalid: ${validationResult.errors.join(', ')}`,
        errors: validationResult.errors
      };
    }
    
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
      message: error instanceof Error ? error.message : 'Unknown error generating wireframe',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Generate a variation of an existing wireframe with style changes
 */
export async function generateWireframeVariationWithStyle(
  baseWireframe: WireframeData,
  styleChanges: string,
  enhancedCreativity: boolean = false
): Promise<WireframeGenerationResult> {
  try {
    console.log('Generating wireframe variation with style changes:', styleChanges);
    
    if (!isWireframeData(baseWireframe)) {
      throw new Error('Invalid base wireframe data');
    }
    
    // In a real implementation, this would call the API or edge function
    // For now, we create a simple variation of the existing wireframe
    const variation: WireframeData = {
      ...baseWireframe,
      id: `variation-${uuidv4()}`,
      title: `${baseWireframe.title} (Variation)`,
      colorScheme: {
        ...baseWireframe.colorScheme,
        // Modify a color to simulate style change
        primary: enhancedCreativity ? '#4f46e5' : '#3182ce'
      },
      description: `${baseWireframe.description} (with style: ${styleChanges})`,
      // Mark as a variation
      metadata: {
        ...(baseWireframe.metadata || {}),
        isVariation: true,
        originalWireframeId: baseWireframe.id,
        styleChanges
      }
    };
    
    return {
      wireframe: variation,
      success: true,
      message: 'Wireframe variation generated successfully'
    };
  } catch (error) {
    console.error('Error generating wireframe variation:', error);
    return {
      wireframe: null,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error generating wireframe variation',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Generate mock sections for a wireframe based on the description
 */
function generateMockSections(description: string): WireframeSection[] {
  const sections: WireframeSection[] = [
    {
      id: uuidv4(),
      name: 'Header',
      sectionType: 'header',
      description: 'Main header section with navigation',
      position: { x: 0, y: 0 },
      dimensions: { width: '100%', height: 80 }
    },
    {
      id: uuidv4(),
      name: 'Hero',
      sectionType: 'hero',
      description: 'Hero section with main message',
      position: { x: 0, y: 80 },
      dimensions: { width: '100%', height: 500 }
    },
    {
      id: uuidv4(),
      name: 'Features',
      sectionType: 'features',
      description: 'Features showcase',
      position: { x: 0, y: 580 },
      dimensions: { width: '100%', height: 400 }
    },
    {
      id: uuidv4(),
      name: 'Footer',
      sectionType: 'footer',
      description: 'Footer with links and info',
      position: { x: 0, y: 980 },
      dimensions: { width: '100%', height: 200 }
    }
  ];
  
  return sections;
}

/**
 * Validate a wireframe structure
 */
async function validateWireframe(wireframe: WireframeData): Promise<{ isValid: boolean; errors: string[] }> {
  try {
    // In a real implementation, this would call the validate-wireframe edge function
    // For now, perform a basic validation
    const errors: string[] = [];
    
    if (!wireframe.id) errors.push('Wireframe must have an ID');
    if (!wireframe.title) errors.push('Wireframe must have a title');
    if (!Array.isArray(wireframe.sections)) errors.push('Wireframe must have a sections array');
    
    // Validate color scheme
    if (!wireframe.colorScheme) {
      errors.push('Wireframe must have a colorScheme');
    } else {
      ['primary', 'secondary', 'accent', 'background', 'text'].forEach(color => {
        if (!wireframe.colorScheme[color]) errors.push(`ColorScheme must include ${color} color`);
      });
    }
    
    // Validate typography
    if (!wireframe.typography) {
      errors.push('Wireframe must have typography');
    } else {
      ['headings', 'body'].forEach(font => {
        if (!wireframe.typography[font]) errors.push(`Typography must include ${font} font`);
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    console.error('Error validating wireframe:', error);
    return {
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Unknown validation error']
    };
  }
}

/**
 * Create aliases for backward compatibility
 */
export const generateWireframeFromPrompt = generateWireframe;
export const createWireframe = generateWireframe;
