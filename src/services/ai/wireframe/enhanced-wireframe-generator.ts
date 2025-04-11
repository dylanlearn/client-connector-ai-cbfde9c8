
import { v4 as uuidv4 } from 'uuid';
import { wireframeGenerator } from './api/wireframe-generator';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  EnhancedWireframeGenerationResult,
  WireframeData
} from './wireframe-types';

export const EnhancedWireframeGenerator = {
  /**
   * Generate a wireframe with enhanced features like intent analysis and blueprint generation
   */
  generateWireframe: async (params: WireframeGenerationParams): Promise<EnhancedWireframeGenerationResult> => {
    try {
      // Ensure we have a projectId
      const projectId = params.projectId || uuidv4();
      
      // Call the wireframe generator service
      const result = await wireframeGenerator.generateWireframe({
        ...params,
        projectId,
        enhancedCreativity: params.enhancedCreativity ?? true,
        creativityLevel: params.creativityLevel ?? 8
      });
      
      // Extract the intentData and blueprint from the result
      const intentData = result.intentData || {};
      const blueprint = result.blueprint || {};
      const designTokens = result.wireframe?.designTokens || {};
      
      // Return an enhanced result with all the additional data
      return {
        ...result,
        intentData,
        blueprint,
        designTokens,
        wireframe: {
          ...result.wireframe,
          // Ensure all required fields are present
          id: result.wireframe?.id || uuidv4(),
          title: result.wireframe?.title || 'Untitled Wireframe',
          description: result.wireframe?.description || '',
          sections: result.wireframe?.sections || [],
          // Ensure colorScheme has all required properties
          colorScheme: {
            primary: result.wireframe?.colorScheme?.primary || '#3B82F6',
            secondary: result.wireframe?.colorScheme?.secondary || '#10B981',
            accent: result.wireframe?.colorScheme?.accent || '#F59E0B',
            background: result.wireframe?.colorScheme?.background || '#FFFFFF',
            text: result.wireframe?.colorScheme?.text || '#111827'
          }
        }
      };
    } catch (error) {
      console.error("Error in enhanced wireframe generation:", error);
      throw error;
    }
  },
  
  /**
   * Generate a creative variation of an existing wireframe
   */
  generateVariation: async (
    baseWireframe: WireframeData,
    creativityLevel: number = 8,
    styleChanges: string = ''
  ): Promise<WireframeGenerationResult> => {
    try {
      // Generate variation based on the original wireframe
      return await wireframeGenerator.generateWireframe({
        description: `Create a creative variation of this wireframe: ${baseWireframe.title}`,
        baseWireframe,
        isVariation: true,
        enhancedCreativity: true,
        creativityLevel,
        styleChanges
      });
    } catch (error) {
      console.error("Error generating wireframe variation:", error);
      throw error;
    }
  },
  
  /**
   * Apply feedback to modify an existing wireframe
   */
  applyFeedback: async (
    wireframe: WireframeData,
    feedback: string
  ): Promise<WireframeGenerationResult> => {
    try {
      // Generate a new wireframe based on feedback
      return await wireframeGenerator.generateWireframe({
        description: feedback,
        baseWireframe: wireframe,
        feedbackMode: true,
        enhancedCreativity: false
      });
    } catch (error) {
      console.error("Error applying feedback to wireframe:", error);
      throw error;
    }
  }
};
