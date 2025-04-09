import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeData,
  FeedbackInterpretation,
  FeedbackModificationResult
} from '../../../services/ai/wireframe/wireframe-types';
import { wireframeGenerator } from './generator/wireframe-generator-service';
import { AdvancedWireframeService } from './advanced-wireframe-service';
import { WireframeFeedbackController } from './feedback/wireframe-feedback-controller';

/**
 * Enhanced wireframe generator that combines capabilities from different services
 */
export class EnhancedWireframeGenerator {
  /**
   * Generate a wireframe using the advanced generator
   */
  static async generateWireframe(params: WireframeGenerationParams): Promise<WireframeGenerationResult> {
    try {
      console.log("Generating wireframe with enhanced generator...");
      
      // Check if this is based on intake form data
      if (params.intakeFormData) {
        return this.generateFromIntakeData(params);
      }
      
      // Call the edge function to generate the advanced wireframe
      const { data, error } = await fetch('/api/generate-advanced-wireframe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: params.description || params.prompt || '',
          projectId: params.projectId || uuidv4(),
          styleToken: params.style || 'modern',
          includeDesignMemory: true,
          enableLayoutIntelligence: params.enableLayoutIntelligence || true,
          customParams: params.customParams || {}
        })
      }).then(res => res.json());
      
      if (error) {
        console.error("Error generating advanced wireframe:", error);
        throw new Error(`Error generating advanced wireframe: ${error}`);
      }
      
      return {
        wireframe: data.wireframe,
        success: data.success,
        // Add additional metadata from the response
        layoutAnalysis: data.layoutAnalysis || null
      };
    } catch (error) {
      console.error("Error in enhanced wireframe generator:", error);
      throw error;
    }
  }
  
  /**
   * Generate variations of an existing wireframe
   */
  static async generateVariations(
    baseWireframe: WireframeData, 
    variationParams: Partial<WireframeGenerationParams> = {},
    count: number = 1
  ): Promise<WireframeGenerationResult> {
    try {
      console.log(`Generating ${count} variations of wireframe ${baseWireframe.id}`);
      
      const variations: WireframeData[] = [];
      
      // Generate variations using the basic wireframe generator
      for (let i = 0; i < count; i++) {
        // Combine the base wireframe with variation parameters
        const params: WireframeGenerationParams = {
          description: `Create a variation of wireframe: ${baseWireframe.title}`,
          baseWireframe: baseWireframe,
          // Increase creativity for variations
          creativityLevel: (variationParams.creativityLevel || 7) + Math.min(i + 1, 3),
          enhancedCreativity: true,
          variationOf: baseWireframe.id,
          variationType: variationParams.variationType || 'creative',
          ...variationParams
        };
        
        // Use the basic generator for variations to ensure diversity
        const result = await wireframeGenerator.generateWireframe(params);
        
        if (result.success && result.wireframe) {
          // Add variation metadata
          result.wireframe.parentId = baseWireframe.id;
          result.wireframe.variationType = params.variationType;
          result.wireframe.generationType = 'variation';
          
          variations.push(result.wireframe);
        }
      }
      
      return {
        wireframe: baseWireframe, // Original wireframe
        success: variations.length > 0,
        variations: variations,    // Generated variations
      };
    } catch (error) {
      console.error("Error generating wireframe variations:", error);
      throw error;
    }
  }
  
  /**
   * Generate a wireframe from intake form data
   */
  static async generateFromIntakeData(params: WireframeGenerationParams): Promise<WireframeGenerationResult> {
    try {
      console.log("Generating wireframe from intake form data...");
      
      const intakeData = params.intakeFormData;
      if (!intakeData) {
        throw new Error("No intake form data provided");
      }
      
      // Extract business/project information
      const {
        businessName,
        businessType,
        projectDescription,
        primaryColor,
        secondaryColor,
        stylePreferences = {}
      } = intakeData;
      
      // Create a wireframe structure based on intake data
      const wireframeData: WireframeData = {
        id: uuidv4(),
        title: businessName || 'Wireframe from Intake Form',
        description: projectDescription || `Wireframe for ${businessType || 'business'} website`,
        sections: [],
        colorScheme: {
          primary: primaryColor || '#3b82f6',
          secondary: secondaryColor || '#10b981',
          accent: stylePreferences.accentColor || '#f97316',
          background: stylePreferences.backgroundColor || '#ffffff',
        },
        typography: {
          headings: stylePreferences.headingFont || 'Inter',
          body: stylePreferences.bodyFont || 'Inter',
          fontPairings: stylePreferences.fontPairings || []
        },
        style: stylePreferences.visualStyle || 'modern',
        generationType: 'intake'
      };
      
      // Use the existing wireframe generator with our constructed data
      const result = await this.generateWireframe({
        description: `Create a wireframe for ${businessName || 'a business'} in the ${businessType || ''} industry.`,
        baseWireframe: wireframeData,
        style: stylePreferences.visualStyle || 'modern',
        projectId: params.projectId,
        customParams: {
          targetIndustry: businessType,
          darkMode: stylePreferences.darkMode || false
        }
      });
      
      return result;
    } catch (error) {
      console.error("Error generating wireframe from intake data:", error);
      throw error;
    }
  }
  
  /**
   * Process feedback and apply changes to a wireframe
   */
  static async applyFeedbackToWireframe(
    wireframeId: string,
    feedbackText: string
  ): Promise<FeedbackModificationResult> {
    try {
      console.log("Processing feedback for wireframe:", wireframeId);
      
      // Use the feedback controller to process the feedback
      const result = await WireframeFeedbackController.processWireframeFeedback(
        wireframeId,
        feedbackText,
        {
          createNewVersion: true,
          saveChanges: true
        }
      );
      
      if (!result.success) {
        throw new Error(result.error || "Failed to apply feedback");
      }
      
      return {
        wireframe: result.wireframe,
        modified: true,
        changeDescription: result.changes.description,
        modifiedSections: result.changes.modifiedSections,
        addedSections: result.changes.addedSections,
        removedSections: result.changes.removedSections
      };
    } catch (error) {
      console.error("Error applying feedback to wireframe:", error);
      throw error;
    }
  }
}
