
import { WireframeApiService } from '../wireframe-api';
import {
  WireframeGenerationParams,
  WireframeGenerationResult,
  AIWireframe,
  WireframeData
} from '../wireframe-types';
import { WireframeTemplateService } from '../templates/wireframe-template-service';
import { WireframeVersionControlService } from '../version-control/wireframe-version-control-service';

/**
 * Service for wireframe generation functionality
 */
export const WireframeGeneratorService = {
  /**
   * Generate a new wireframe using the provided parameters
   */
  generateWireframe: async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    try {
      // Apply industry templates if specified in params
      if (params.industry) {
        try {
          const baseWireframe = WireframeTemplateService.getTemplatesForIndustry(params.industry);
          
          // Merge template with any custom parameters
          params = {
            ...params,
            // Using industry data as a base
            baseWireframe: baseWireframe
          };
        } catch (error) {
          console.warn("Error applying industry template:", error);
          // Continue without template if error occurs
        }
      }
      
      // Call the API service to generate the wireframe
      const result = await WireframeApiService.generateWireframe(params);
      
      // Save the generated wireframe to the database if there's a project ID
      if (params.projectId && result.wireframe) {
        // Ensure the wireframe has a title (requirement for WireframeData in wireframe.d.ts)
        const wireframeWithTitle: WireframeData = {
          ...result.wireframe,
          title: result.wireframe.title || "Untitled Wireframe"
        };
        
        await WireframeApiService.saveWireframe(
          params.projectId,
          params.prompt || params.description, // Use prompt if available, otherwise use description
          wireframeWithTitle,
          params,
          result.model || 'default'
        );
        
        // If project is provided, create initial version in version control
        try {
          const lastWireframe = await WireframeApiService.getLatestWireframe(params.projectId);
          
          if (lastWireframe) {
            await WireframeVersionControlService.createVersion(
              lastWireframe.id,
              wireframeWithTitle,
              "Initial wireframe generation",
              params.projectId // Using projectId instead of userId
            );
          }
        } catch (error) {
          console.error("Error creating initial wireframe version:", error);
          // Continue even if version control fails
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error in wireframe service generateWireframe:", error);
      throw error;
    }
  },
};
