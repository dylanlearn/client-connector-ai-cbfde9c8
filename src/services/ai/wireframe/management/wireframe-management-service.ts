import { WireframeApiService } from '../api';
import { WireframeData, AIWireframe } from '../wireframe-types';
import { WireframeVersionControlService } from '../version-control/wireframe-version-control-service';
import { WireframeDataService } from '../data/wireframe-data-service';
import { industryTemplateService } from '../industry-templates';

/**
 * Service for managing wireframe updates, templates, and versions
 */
export const WireframeManagementService = {
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
      const currentWireframe = await WireframeDataService.getWireframe(wireframeId);
      
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
    industry: string,
    userId: string,
    preserveSections: boolean = true
  ): Promise<AIWireframe | null> => {
    try {
      // Get the current wireframe
      const currentWireframe = await WireframeDataService.getWireframe(wireframeId);
      
      if (!currentWireframe) {
        throw new Error("Wireframe not found");
      }
      
      // Get the template for the industry
      const templateData = industryTemplateService.getTemplatesForIndustry(industry);
      
      // Combine data based on preserveSections setting
      let updatedData: WireframeData;
      
      if (preserveSections && currentWireframe.data) {
        // Keep existing sections and add template sections
        const existingSections = currentWireframe.data.sections || [];
        const templateSections = templateData?.sections || [];
        
        updatedData = {
          ...currentWireframe.data,
          sections: [...existingSections, ...templateSections]
        };
      } else {
        // Replace with template but preserve wireframe metadata
        updatedData = {
          title: currentWireframe.data?.title || templateData?.title || "Untitled Wireframe",
          description: currentWireframe.data?.description || templateData?.description || "",
          sections: templateData?.sections || [],
          // Other properties will come from templateData or be undefined
          ...(templateData || {})
        };
      }
      
      // Update the wireframe
      return WireframeManagementService.updateWireframe(
        wireframeId,
        updatedData,
        userId,
        `Applied template: ${industry}`
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
};
