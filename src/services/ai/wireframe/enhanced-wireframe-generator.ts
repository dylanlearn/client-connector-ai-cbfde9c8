
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
import { supabase } from "@/integrations/supabase/client";

/**
 * Type for validation results from the edge function
 */
interface ValidationResponse {
  success: boolean;
  isValid: boolean;
  errors: string[];
  wireframeId?: string;
}

/**
 * Enhanced wireframe generator that provides additional features and data
 */
export class EnhancedWireframeGenerator {
  /**
   * Validate a wireframe against schema and business rules
   */
  static async validateWireframe(wireframe: WireframeData): Promise<{isValid: boolean; errors: string[]}> {
    try {
      console.log('Validating wireframe:', wireframe.id);
      
      const { data, error } = await supabase.functions.invoke<ValidationResponse>('validate-wireframe', {
        body: { wireframe, validateWithDb: false }
      });
      
      if (error) {
        console.error('Validation API error:', error);
        return { 
          isValid: false, 
          errors: [`Validation API error: ${error.message}`] 
        };
      }
      
      if (!data) {
        return { 
          isValid: false, 
          errors: ['Invalid response from validation service'] 
        };
      }
      
      return {
        isValid: data.isValid,
        errors: data.errors || []
      };
    } catch (err) {
      console.error('Error during wireframe validation:', err);
      return { 
        isValid: false, 
        errors: [err instanceof Error ? err.message : 'Unknown validation error'] 
      };
    }
  }
  
  /**
   * Generate a wireframe with enhanced features
   */
  static async generateWireframe(params: WireframeGenerationParams): Promise<EnhancedWireframeGenerationResult> {
    try {
      console.log('Enhanced wireframe generation initiated with params:', params);
      
      // Normalize parameters for consistency
      const normalizedParams = normalizeWireframeGenerationParams(params);
      
      // Validate input parameters
      if (!normalizedParams.description && !normalizedParams.baseWireframe) {
        throw new Error('Either description or baseWireframe is required for wireframe generation');
      }
      
      // Use the API function to generate the base wireframe
      const result = await generateWireframeFromPrompt(normalizedParams);
      
      if (!result.wireframe) {
        throw new Error(result.message || 'Failed to generate enhanced wireframe');
      }
      
      // Validate the generated wireframe
      const validationResult = await this.validateWireframe(result.wireframe);
      
      if (!validationResult.isValid) {
        console.warn('Generated wireframe has validation issues:', validationResult.errors);
        // We'll still proceed but include the warnings
      }
      
      // Generate additional metadata and intelligence
      const enhancedResult: EnhancedWireframeGenerationResult = {
        ...result,
        intentData: {
          primaryGoal: this.analyzePrimaryGoal(normalizedParams.description || ''),
          targetAudience: params.targetAudience || 'General',
          keyFeatures: this.extractKeyFeatures(normalizedParams.description || '', result.wireframe),
          contentStrategy: 'Clear and concise messaging',
        },
        blueprint: {
          layoutStrategy: this.determineLayoutStrategy(result.wireframe),
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
        },
        warnings: validationResult.isValid ? undefined : validationResult.errors
      };
      
      // Log successful generation with metadata
      console.log('Enhanced wireframe generated successfully:', {
        id: enhancedResult.wireframe.id,
        title: enhancedResult.wireframe.title,
        sectionsCount: enhancedResult.wireframe.sections.length,
        isValid: validationResult.isValid
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
      
      // Validate input parameters
      if (!feedback || feedback.trim().length === 0) {
        throw new Error('Feedback text is required');
      }
      
      // Generate a variation based on the feedback
      const result = await generateWireframeVariation({
        description: feedback,
        baseWireframe: wireframe,
        isVariation: true,
        feedbackMode: true
      });
      
      if (!result.success || !result.wireframe) {
        throw new Error(result.message || 'Failed to apply feedback');
      }
      
      // Validate the updated wireframe
      const validationResult = await this.validateWireframe(result.wireframe);
      
      if (!validationResult.isValid) {
        console.warn('Wireframe after feedback has validation issues:', validationResult.errors);
        result.warnings = validationResult.errors;
      }
      
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
        message: error instanceof Error ? error.message : 'Unknown error applying feedback',
        errors: [error instanceof Error ? error.message : 'Unknown error applying feedback']
      };
    }
  }
  
  /**
   * Analyze the primary goal from the description
   */
  private static analyzePrimaryGoal(description: string): string {
    // This is a simplified implementation - in a real app, you might use NLP
    if (description.toLowerCase().includes('landing page')) {
      return 'Conversion';
    } else if (description.toLowerCase().includes('dashboard')) {
      return 'Information management';
    } else if (description.toLowerCase().includes('portfolio')) {
      return 'Showcase work';
    } else {
      return 'User engagement';
    }
  }
  
  /**
   * Extract key features from description and wireframe
   */
  private static extractKeyFeatures(description: string, wireframe: WireframeData): string[] {
    const features = ['Responsive design'];
    
    // Extract features from section types
    const sectionTypes = new Set<string>();
    wireframe.sections.forEach(section => {
      if (section.sectionType) {
        sectionTypes.add(section.sectionType);
      }
    });
    
    // Map common section types to features
    if (sectionTypes.has('hero')) features.push('Hero section');
    if (sectionTypes.has('features')) features.push('Feature showcase');
    if (sectionTypes.has('testimonials')) features.push('Social proof');
    if (sectionTypes.has('pricing')) features.push('Pricing information');
    if (sectionTypes.has('contact')) features.push('Contact form');
    
    // If we don't have enough features, add a generic one
    if (features.length < 3) {
      features.push('Intuitive navigation');
    }
    
    return features;
  }
  
  /**
   * Determine the layout strategy based on the wireframe
   */
  private static determineLayoutStrategy(wireframe: WireframeData): string {
    // Check for mobile-specific layouts
    if (wireframe.mobileLayouts || wireframe.sections.some(s => s.mobileLayout)) {
      return 'Mobile-first approach';
    }
    
    // Check for grid-based layouts
    if (wireframe.sections.some(s => s.layoutType?.includes('grid'))) {
      return 'Grid-based layout';
    }
    
    // Default
    return 'Component-based layout';
  }
}

export default EnhancedWireframeGenerator;
