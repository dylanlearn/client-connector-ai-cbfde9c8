
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeData, 
  WireframeSection, 
  WireframeGenerationParams,
  WireframeGenerationResult,
  isWireframeData,
  normalizeWireframeGenerationParams
} from './wireframe-types';

/**
 * Unified wireframe service that combines basic and advanced wireframe generation capabilities
 */
export class UnifiedWireframeService {
  /**
   * Generate a wireframe based on the provided parameters
   */
  async generateWireframe(params: WireframeGenerationParams): Promise<WireframeGenerationResult> {
    try {
      console.log('Generating wireframe with params:', JSON.stringify(params, null, 2));
      
      // Normalize parameters to ensure consistent format
      const normalizedParams = normalizeWireframeGenerationParams(params);
      
      // Validate required parameters
      if (!normalizedParams.description || normalizedParams.description.trim().length === 0) {
        return {
          wireframe: null,
          success: false,
          message: 'Description is required for wireframe generation',
          errors: ['Missing required parameter: description']
        };
      }
      
      // Create a basic wireframe with required properties
      const wireframe = this.createBaseWireframe(normalizedParams);
      
      // Add enhanced functionality if requested
      if (normalizedParams.enhancedCreativity !== false) {
        this.enhanceWireframe(wireframe, normalizedParams);
      }
      
      // Validate the generated wireframe
      const validationResult = await this.validateWireframe(wireframe);
      
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
        message: 'Wireframe generated successfully',
        warnings: validationResult.warnings
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
   * Apply feedback to update a wireframe
   */
  async applyFeedback(wireframeData: WireframeData, feedback: string): Promise<WireframeGenerationResult> {
    try {
      if (!feedback || feedback.trim().length === 0) {
        return {
          wireframe: wireframeData,
          success: false,
          message: 'Feedback text is required',
          errors: ['Missing feedback text']
        };
      }
      
      if (!wireframeData || !wireframeData.id) {
        return {
          wireframe: null,
          success: false,
          message: 'Invalid wireframe data',
          errors: ['Invalid wireframe data']
        };
      }
      
      console.log('Applying feedback to wireframe:', {
        wireframeId: wireframeData.id,
        feedback
      });
      
      // In a real-world implementation, this would use AI to analyze the feedback
      // and make appropriate changes to the wireframe
      const updatedWireframe = {
        ...wireframeData,
        updatedAt: new Date().toISOString(),
        metadata: {
          ...(wireframeData.metadata || {}),
          feedbackHistory: [
            ...((wireframeData.metadata?.feedbackHistory as any[]) || []),
            { text: feedback, timestamp: new Date().toISOString(), id: uuidv4() }
          ]
        }
      };
      
      return {
        wireframe: updatedWireframe,
        success: true,
        message: 'Feedback applied successfully'
      };
    } catch (error) {
      console.error('Error applying feedback:', error);
      return {
        wireframe: null,
        success: false,
        message: `Error applying feedback: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }
  
  /**
   * Generate a variation of an existing wireframe with style changes
   */
  async generateWireframeVariation(
    baseWireframe: WireframeData, 
    styleChanges: string, 
    enhancedCreativity: boolean = false
  ): Promise<WireframeGenerationResult> {
    try {
      console.log('Generating wireframe variation with style changes:', styleChanges);
      
      if (!isWireframeData(baseWireframe)) {
        throw new Error('Invalid base wireframe data');
      }
      
      if (!styleChanges || styleChanges.trim().length === 0) {
        return {
          wireframe: null,
          success: false,
          message: 'Style changes description is required',
          errors: ['Style changes description is required']
        };
      }
      
      // Create a variation of the existing wireframe
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
      
      // Add enhanced features for creative variations
      if (enhancedCreativity) {
        variation.styleVariants = this.generateStyleVariants();
        variation.animations = this.generateAnimationSuggestions();
        variation.designReasoning = this.generateDesignReasoning(variation, {
          description: styleChanges,
          baseWireframe
        });
      }
      
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
   * Create a base wireframe with required properties
   */
  private createBaseWireframe(params: WireframeGenerationParams): WireframeData {
    const wireframeId = params.projectId ? 
      `${params.projectId}-${uuidv4()}` : 
      uuidv4();
    
    // Create a wireframe with all required properties
    return {
      id: wireframeId,
      title: `Wireframe: ${params.description.substring(0, 30)}${params.description.length > 30 ? '...' : ''}`,
      description: params.description,
      sections: this.generateSections(params.description),
      colorScheme: params.colorScheme ? {
        primary: params.colorScheme.primary || '#3182ce',
        secondary: params.colorScheme.secondary || '#805ad5',
        accent: params.colorScheme.accent || '#ed8936',
        background: params.colorScheme.background || '#ffffff',
        text: params.colorScheme.text || '#1a202c'
      } : {
        primary: '#3182ce',
        secondary: '#805ad5',
        accent: '#ed8936',
        background: '#ffffff',
        text: '#1a202c'
      },
      typography: {
        headings: params.typography?.headings || 'Inter',
        body: params.typography?.body || 'Inter'
      },
      designReasoning: 'Generated wireframe based on user description'
    };
  }
  
  /**
   * Enhance a wireframe with additional features
   */
  private enhanceWireframe(wireframe: WireframeData, params: WireframeGenerationParams): void {
    wireframe.styleVariants = this.generateStyleVariants();
    wireframe.animations = this.generateAnimationSuggestions();
    wireframe.designReasoning = this.generateDesignReasoning(wireframe, params);
  }
  
  /**
   * Generate sections for a wireframe based on the description
   */
  private generateSections(description: string): WireframeSection[] {
    // Generate basic sections for the wireframe
    return [
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
  }
  
  /**
   * Validate a wireframe structure
   */
  private async validateWireframe(wireframe: WireframeData): Promise<{ 
    isValid: boolean; 
    errors: string[];
    warnings?: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Basic validation of wireframe structure
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
    
    // Enhanced validation for specific properties
    if (wireframe.animations && Object.keys(wireframe.animations).length === 0) {
      warnings.push('Animations property is empty');
    }
    
    if (wireframe.styleVariants && Object.keys(wireframe.styleVariants).length === 0) {
      warnings.push('StyleVariants property is empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  /**
   * Generate design reasoning for a wireframe
   */
  private generateDesignReasoning(wireframe: WireframeData, params: any): string {
    // Create explanatory design reasoning
    const description = params.description || params.styleChanges || '';
    
    return `This design was created based on the prompt: "${description}". 
    It features ${wireframe.sections.length} sections with a color scheme using ${wireframe.colorScheme.primary} as the primary color.`;
  }
  
  /**
   * Generate animation suggestions
   */
  private generateAnimationSuggestions(): Record<string, any> {
    return {
      entrance: {
        type: 'fade-in',
        duration: 500
      },
      scroll: {
        type: 'reveal',
        threshold: 0.2
      }
    };
  }
  
  /**
   * Generate style variants
   */
  private generateStyleVariants(): Record<string, any> {
    return {
      light: {
        background: '#ffffff',
        text: '#1a1a1a'
      },
      dark: {
        background: '#1a1a1a',
        text: '#ffffff'
      }
    };
  }
}

// Create singleton instance
export const unifiedWireframeService = new UnifiedWireframeService();

// Create export class for backward compatibility with existing code
export class EnhancedWireframeGenerator {
  static async generateWireframe(params: WireframeGenerationParams): Promise<WireframeGenerationResult> {
    return unifiedWireframeService.generateWireframe(params);
  }
  
  static async applyFeedback(wireframeData: WireframeData, feedback: string): Promise<WireframeGenerationResult> {
    return unifiedWireframeService.applyFeedback(wireframeData, feedback);
  }
}

// Export additional functions for backward compatibility
export const generateWireframe = (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  return unifiedWireframeService.generateWireframe(params);
};

export const generateWireframeVariation = (
  baseWireframe: WireframeData, 
  styleChanges: string, 
  enhancedCreativity: boolean = false
): Promise<WireframeGenerationResult> => {
  return unifiedWireframeService.generateWireframeVariation(baseWireframe, styleChanges, enhancedCreativity);
};

// Export aliases for backward compatibility
export const generateWireframeFromPrompt = generateWireframe;
export const createWireframe = generateWireframe;
