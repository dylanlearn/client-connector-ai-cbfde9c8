
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  WireframeData, 
  EnhancedWireframeGenerationResult,
  normalizeWireframeGenerationParams
} from './wireframe-types';
import {
  generateWireframe as apiGenerateWireframe,
  generateWireframeFromPrompt,
  generateWireframeVariation,
  wireframeGenerator
} from './api';

/**
 * Enhanced wireframe generator that provides additional features and data
 */
export class EnhancedWireframeGenerator {
  /**
   * Generate a wireframe with enhanced features
   */
  static async generateWireframe(params: WireframeGenerationParams): Promise<EnhancedWireframeGenerationResult> {
    try {
      console.log('Enhanced wireframe generation initiated with params:', params);
      
      // Normalize parameters for consistency
      const normalizedParams = normalizeWireframeGenerationParams(params);
      
      // Use the API function to generate the base wireframe
      const result = await generateWireframeFromPrompt(normalizedParams);
      
      if (!result.wireframe) {
        throw new Error(result.message || 'Failed to generate enhanced wireframe');
      }
      
      // Generate additional metadata and intelligence
      const enhancedResult: EnhancedWireframeGenerationResult = {
        ...result,
        intentData: {
          primaryGoal: 'User engagement',
          targetAudience: params.targetAudience || 'General',
          keyFeatures: ['Responsive design', 'Intuitive navigation'],
          contentStrategy: 'Clear and concise messaging',
        },
        blueprint: {
          layoutStrategy: 'Mobile-first approach',
          colorTheory: 'Primary color establishes brand identity',
          typographySystem: 'Hierarchical readability',
        },
        designTokens: {
          spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
          },
          breakpoints: {
            mobile: '375px',
            tablet: '768px', 
            desktop: '1280px',
          }
        }
      };
      
      // Log successful generation with metadata
      console.log('Enhanced wireframe generated successfully:', {
        id: enhancedResult.wireframe.id,
        title: enhancedResult.wireframe.title,
        sectionsCount: enhancedResult.wireframe.sections.length
      });
      
      return enhancedResult;
    } catch (error) {
      console.error('Enhanced wireframe generation error:', error);
      
      // Return error result
      return {
        wireframe: null,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error generating enhanced wireframe',
        intentData: {},
        blueprint: {},
        designTokens: {}
      };
    }
  }
  
  /**
   * Apply feedback to an existing wireframe
   */
  static async applyFeedback(wireframe: WireframeData, feedback: string): Promise<WireframeGenerationResult> {
    try {
      console.log('Applying feedback to wireframe:', feedback);
      
      if (!wireframe || !wireframe.id) {
        throw new Error('Invalid wireframe data provided');
      }
      
      // Generate a variation based on the feedback
      const result = await generateWireframeVariation({
        description: feedback,
        baseWireframe: wireframe,
        isVariation: true,
        feedbackMode: true
      });
      
      // Log success or failure
      if (result.success && result.wireframe) {
        console.log('Feedback applied successfully to wireframe:', result.wireframe.id);
      } else {
        console.warn('Feedback application completed with warnings:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Error applying feedback to wireframe:', error);
      
      return {
        wireframe: null,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error applying feedback'
      };
    }
  }
  
  /**
   * Validate a wireframe structure
   */
  static validateWireframe(wireframe: WireframeData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for required fields
    if (!wireframe.id) errors.push('Wireframe must have an ID');
    if (!wireframe.title) errors.push('Wireframe must have a title');
    if (!Array.isArray(wireframe.sections)) errors.push('Wireframe must have a sections array');
    
    // Check color scheme
    if (!wireframe.colorScheme) {
      errors.push('Wireframe must have a colorScheme');
    } else {
      ['primary', 'secondary', 'accent', 'background', 'text'].forEach(color => {
        if (!wireframe.colorScheme[color]) errors.push(`ColorScheme must include ${color} color`);
      });
    }
    
    // Check typography
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
  }
}

export default EnhancedWireframeGenerator;
