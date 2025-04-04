import { WireframeApiService } from './wireframe-api';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe, 
  WireframeData 
} from './wireframe-types';
import { WireframeVersionControlService } from './wireframe-version-control';
import { IndustryTemplateService } from './industry-templates';

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
      // Apply industry templates if specified
      if (params.templateId) {
        try {
          const baseWireframe = IndustryTemplateService.applyTemplate(params.templateId);
          
          // Merge template with any custom parameters
          params = {
            ...params,
            baseWireframe
          };
        } catch (error) {
          console.warn("Error applying template:", error);
          // Continue without template if error occurs
        }
      }
      
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
        
        // If user ID is provided, create initial version in version control
        if (params.userId) {
          try {
            const lastWireframe = await WireframeApiService.getLatestWireframe(params.projectId);
            
            if (lastWireframe) {
              await WireframeVersionControlService.createVersion(
                lastWireframe.id,
                result.wireframe,
                "Initial wireframe generation",
                params.userId
              );
            }
          } catch (error) {
            console.error("Error creating initial wireframe version:", error);
            // Continue even if version control fails
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error in wireframe service generateWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Helper function to extract WireframeData from various data structures
   */
  extractWireframeData: (wireframe: AIWireframe): WireframeData | null => {
    // Check if data property already exists
    if (wireframe.data) {
      return wireframe.data;
    }
    
    // Extract from generation_params if available
    if (wireframe.generation_params && typeof wireframe.generation_params === 'object') {
      if (wireframe.generation_params.result_data) {
        return wireframe.generation_params.result_data as WireframeData;
      }
    }
    
    // Construct a basic wireframe data object from available properties
    return {
      title: wireframe.description || "Untitled Wireframe",
      description: "",
      sections: wireframe.sections || []
    };
  },
  
  /**
   * Get all wireframes for a project
   */
  getProjectWireframes: async (projectId: string): Promise<AIWireframe[]> => {
    try {
      const wireframes = await WireframeApiService.getProjectWireframes(projectId);
      
      // Process each wireframe to extract and structure the data correctly
      return wireframes.map(wireframe => {
        // Extract wireframe data using the helper function
        const wireframeData = WireframeService.extractWireframeData(wireframe);
        
        // Add structured data to the wireframe object
        return {
          ...wireframe,
          data: wireframeData
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
      
      // Extract wireframe data using the helper function
      const wireframeData = WireframeService.extractWireframeData(wireframe);
      
      // Add the extracted data to the wireframe object
      return {
        ...wireframe,
        data: wireframeData
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
   * Update a wireframe with new data and create a version
   */
  updateWireframe: async (
    wireframeId: string,
    data: Partial<WireframeData>,
    userId: string,
    changeDescription: string = "Updated wireframe"
  ): Promise<AIWireframe | null> => {
    try {
      // First get the current wireframe
      const currentWireframe = await WireframeService.getWireframe(wireframeId);
      
      if (!currentWireframe || !currentWireframe.data) {
        throw new Error("Wireframe not found or data missing");
      }
      
      // Merge current data with updates
      const updatedData: WireframeData = {
        ...currentWireframe.data,
        ...data
      };
      
      // Update the wireframe in the database
      const updatedWireframe = await WireframeApiService.updateWireframeData(
        wireframeId, 
        updatedData
      );
      
      // Create a new version in version control
      await WireframeVersionControlService.createVersion(
        wireframeId,
        updatedData,
        changeDescription,
        userId
      );
      
      return updatedWireframe;
    } catch (error) {
      console.error("Error in wireframe service updateWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Apply an industry template to an existing wireframe
   */
  applyTemplateToWireframe: async (
    wireframeId: string,
    templateId: string,
    userId: string,
    preserveSections: boolean = true
  ): Promise<AIWireframe | null> => {
    try {
      // Get the current wireframe
      const currentWireframe = await WireframeService.getWireframe(wireframeId);
      
      if (!currentWireframe) {
        throw new Error("Wireframe not found");
      }
      
      // Get the template
      const templateData = IndustryTemplateService.applyTemplate(templateId);
      
      // Combine data based on preserveSections setting
      let updatedData: WireframeData;
      
      if (preserveSections && currentWireframe.data) {
        // Keep existing sections and add template sections
        const existingSections = currentWireframe.data.sections || [];
        const templateSections = templateData.sections || [];
        
        updatedData = {
          ...currentWireframe.data,
          sections: [...existingSections, ...templateSections]
        };
      } else {
        // Replace with template but preserve wireframe metadata
        updatedData = {
          ...templateData,
          title: currentWireframe.data?.title || templateData.title
        };
      }
      
      // Update the wireframe
      return WireframeService.updateWireframe(
        wireframeId,
        updatedData,
        userId,
        `Applied template: ${templateId}`
      );
    } catch (error) {
      console.error("Error applying template to wireframe:", error);
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
  },
  
  /**
   * Get available industry templates
   */
  getIndustryTemplates: (industry?: string) => {
    if (industry) {
      return IndustryTemplateService.getTemplatesForIndustry(industry);
    }
    return IndustryTemplateService.getAllTemplates();
  },
  
  /**
   * Get wireframe version history
   */
  getWireframeVersionHistory: (wireframeId: string) => {
    return WireframeVersionControlService.getVersionHistory(wireframeId);
  },
  
  /**
   * Revert to a specific wireframe version
   */
  revertToVersion: (versionId: string, userId: string, description?: string) => {
    return WireframeVersionControlService.revertToVersion(versionId, userId, description);
  }
};
