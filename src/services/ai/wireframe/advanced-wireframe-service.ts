
import { WireframeGenerationParams, WireframeGenerationResult, WireframeData } from './wireframe-types';
import { v4 as uuidv4 } from 'uuid';
import { generateWireframe } from './wireframe-service';

/**
 * Extended wireframe service with advanced capabilities
 */
class AdvancedWireframeService {
  /**
   * Generate a wireframe with advanced parameters and options
   */
  async generateWireframe(params: WireframeGenerationParams): Promise<WireframeGenerationResult> {
    try {
      console.log('Advanced wireframe generation requested:', JSON.stringify(params, null, 2));
      
      // Validate required parameters
      if (!params.description || params.description.trim().length === 0) {
        return {
          wireframe: null,
          success: false,
          message: 'Description is required for wireframe generation',
          errors: ['Missing required parameter: description']
        };
      }
      
      // Enhance the generation params with additional options
      const enhancedParams: WireframeGenerationParams = {
        ...params,
        enhancedCreativity: params.enhancedCreativity !== false,
        styleChanges: params.styleChanges || ''
      };
      
      // Use the wireframe generator directly
      const result = await generateWireframe(enhancedParams);
      
      if (!result.success || !result.wireframe) {
        console.error('Failed to generate wireframe:', result.message);
        return result;
      }
      
      // Add enhanced functionality to the wireframe
      const enhancedWireframe: WireframeData = {
        ...result.wireframe,
        designReasoning: this.generateDesignReasoning(result.wireframe, params),
        animations: params.enhancedCreativity ? this.generateAnimationSuggestions() : undefined,
        styleVariants: params.enhancedCreativity ? this.generateStyleVariants() : undefined
      };
      
      // Validate the enhanced wireframe
      const validationResult = await this.validateEnhancedWireframe(enhancedWireframe);
      if (!validationResult.isValid) {
        console.warn('Enhanced wireframe has validation warnings:', validationResult.warnings);
      }
      
      return {
        wireframe: enhancedWireframe,
        success: true,
        message: 'Enhanced wireframe generated successfully',
        warnings: validationResult.warnings
      };
    } catch (error) {
      console.error('Error in advanced wireframe generation:', error);
      return {
        wireframe: null,
        success: false,
        message: `Error generating enhanced wireframe: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
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
      
      // Simple implementation for now
      // In a real app, this would use AI to analyze the feedback and make changes
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
   * Validate an enhanced wireframe
   */
  private async validateEnhancedWireframe(wireframe: WireframeData): Promise<{
    isValid: boolean;
    warnings?: string[];
  }> {
    // Simplified validation for enhanced wireframe specific properties
    const warnings: string[] = [];
    
    if (wireframe.animations && Object.keys(wireframe.animations).length === 0) {
      warnings.push('Animations property is empty');
    }
    
    if (wireframe.styleVariants && Object.keys(wireframe.styleVariants).length === 0) {
      warnings.push('StyleVariants property is empty');
    }
    
    return {
      isValid: true, // We consider these as warnings, not errors
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  /**
   * Generate design reasoning for a wireframe
   */
  private generateDesignReasoning(wireframe: WireframeData, params: WireframeGenerationParams): string {
    // Sample implementation
    return `This design was created based on the prompt: "${params.description}". 
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

export const advancedWireframeService = new AdvancedWireframeService();

// Modified EnhancedWireframeGenerator class to use the advancedWireframeService
export class EnhancedWireframeGenerator {
  static async generateWireframe(params: WireframeGenerationParams): Promise<WireframeGenerationResult> {
    return advancedWireframeService.generateWireframe(params);
  }
  
  static async applyFeedback(wireframeData: WireframeData, feedback: string): Promise<WireframeGenerationResult> {
    return advancedWireframeService.applyFeedback(wireframeData, feedback);
  }
}
