
import { WireframeApiService } from './wireframe-api';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe, 
  WireframeData 
} from './wireframe-types';

/**
 * Service layer for wireframe generation and management
 * Handles API calls and local wireframe management
 */
export const WireframeService = {
  /**
   * Generate a new wireframe using the provided parameters
   */
  generateWireframe: async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    try {
      // Call the API service to generate the wireframe
      const result = await WireframeApiService.generateWireframe(params);
      
      // Save the generated wireframe to the database if there's a project ID
      if (params.projectId && result.wireframe) {
        await WireframeApiService.saveWireframe(
          params.projectId,
          params.prompt,
          result.wireframe,
          params,
          result.model || 'default'
        );
      }
      
      return result;
    } catch (error) {
      console.error("Error in wireframe service generateWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Get all wireframes for a project
   */
  getProjectWireframes: async (projectId: string): Promise<AIWireframe[]> => {
    try {
      const wireframes = await WireframeApiService.getProjectWireframes(projectId);
      
      // Process each wireframe to extract and structure the data correctly
      return wireframes.map(wireframe => {
        const generationParams = wireframe.generation_params;
        let wireframeData: WireframeData | null = null;
        
        // Extract data from generation_params if available
        if (generationParams && typeof generationParams === 'object' && generationParams.result_data) {
          wireframeData = generationParams.result_data as WireframeData;
        }
        
        // Add structured data to the wireframe object
        return {
          ...wireframe,
          data: wireframeData || {
            title: wireframe.description || "Untitled Wireframe",
            description: "",
            sections: []
          }
        };
      });
    } catch (error) {
      console.error("Error in wireframe service getProjectWireframes:", error);
      throw error;
    }
  },
  
  /**
   * Get a specific wireframe by ID
   */
  getWireframe: async (wireframeId: string): Promise<AIWireframe | null> => {
    try {
      const wireframe = await WireframeApiService.getWireframe(wireframeId);
      
      // Extract and structure the data
      const generationParams = wireframe.generation_params;
      let wireframeData: WireframeData | null = null;
      
      if (generationParams && typeof generationParams === 'object' && generationParams.result_data) {
        wireframeData = generationParams.result_data as WireframeData;
      }
      
      // Add the extracted data to the wireframe object
      return {
        ...wireframe,
        data: wireframeData || {
          title: wireframe.description || "Untitled Wireframe",
          description: "",
          sections: wireframe.sections || []
        }
      };
    } catch (error) {
      console.error("Error in wireframe service getWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Update wireframe feedback and rating
   */
  updateWireframeFeedback: async (
    wireframeId: string,
    feedback: string,
    rating?: number
  ): Promise<void> => {
    try {
      await WireframeApiService.updateWireframeFeedback(wireframeId, feedback, rating);
    } catch (error) {
      console.error("Error in wireframe service updateWireframeFeedback:", error);
      throw error;
    }
  },
  
  /**
   * Delete a wireframe
   */
  deleteWireframe: async (wireframeId: string): Promise<void> => {
    try {
      await WireframeApiService.deleteWireframe(wireframeId);
    } catch (error) {
      console.error("Error in wireframe service deleteWireframe:", error);
      throw error;
    }
  }
};
