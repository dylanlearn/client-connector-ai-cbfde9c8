
import { supabase } from "@/integrations/supabase/client";
import wireframeApiService from "./api/wireframe-api-service";
import type { 
  WireframeGenerationParams, 
  WireframeData, 
  WireframeSection,
  AIWireframe
} from "./wireframe-types";
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for wireframe creation and management
 */
export class WireframeService {
  /**
   * Create a new wireframe or update an existing one
   */
  static async createWireframe(params: {
    title: string;
    description: string;
    data: WireframeData;
    sections: WireframeSection[];
  }): Promise<WireframeData | null> {
    try {
      console.log("Creating or updating wireframe", params.data.id ? `with ID ${params.data.id}` : "as new wireframe");
      
      // If we have an ID, check if the wireframe exists
      let existingWireframe: AIWireframe | null = null;
      if (params.data.id) {
        try {
          existingWireframe = await wireframeApiService.getWireframe(params.data.id);
          console.log("Found existing wireframe:", existingWireframe ? "yes" : "no");
        } catch (error) {
          console.log("Error checking for existing wireframe:", error);
          // Continue execution - we'll create a new wireframe
        }
      }

      if (existingWireframe) {
        // Update existing wireframe
        console.log("Updating existing wireframe with ID:", params.data.id);
        const updated = await wireframeApiService.updateWireframeData(
          params.data.id!,
          {
            ...params.data,
            sections: params.sections
          }
        );
        
        console.log("Wireframe updated successfully");
        return updated ? {
          id: updated.id,
          title: updated.title || params.title,
          description: updated.description || params.description,
          sections: params.sections,
          lastUpdated: updated.updatedAt || new Date().toISOString()
        } : null;
      } else {
        // Create new wireframe
        console.log("Creating new wireframe");
        // Generate a prompt based on the wireframe data
        const prompt = `${params.title}: ${params.description}`;
        
        // Generate a new UUID if not provided
        const wireframeId = params.data.id || uuidv4();
        console.log("Using wireframe ID:", wireframeId);
        
        // Save to database 
        const result = await wireframeApiService.saveWireframe(
          wireframeId,
          prompt,
          {
            ...params.data,
            title: params.title,
            description: params.description,
            sections: params.sections
          },
          {}, // No additional parameters for now
          "user-created" // Indicate this was created by the user, not AI generated
        );
        
        console.log("New wireframe created with ID:", result.id);
        
        // Return the wireframe data
        return {
          id: result.id,
          title: result.title || params.title,
          description: result.description || params.description,
          sections: params.sections,
          lastUpdated: result.updatedAt || new Date().toISOString()
        };
      }
    } catch (error) {
      console.error("Error in createWireframe:", error);
      throw error;
    }
  }
  
  /**
   * Get a wireframe by ID
   */
  static async getWireframe(wireframeId: string): Promise<WireframeData | null> {
    try {
      console.log("Getting wireframe with ID:", wireframeId);
      const wireframe = await wireframeApiService.getWireframe(wireframeId);
      
      if (!wireframe) {
        console.log("Wireframe not found");
        return null;
      }
      
      console.log("Wireframe retrieved successfully");
      
      // Convert to WireframeData format
      return {
        id: wireframe.id,
        title: wireframe.title || wireframe.description || "Untitled Wireframe",
        description: wireframe.description || "",
        sections: wireframe.sections || [],
        imageUrl: wireframe.imageUrl || "",
        lastUpdated: wireframe.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error("Error in getWireframe:", error);
      return null;
    }
  }
}
