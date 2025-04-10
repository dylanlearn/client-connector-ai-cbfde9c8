
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult 
} from '../wireframe-types';

/**
 * Service for generating wireframes through Supabase Edge Functions
 */
export class WireframeGeneratorService {
  /**
   * Generate a wireframe based on a description
   * @param params The wireframe generation parameters
   * @returns Generated wireframe data
   */
  async generateWireframe(params: WireframeGenerationParams): Promise<WireframeGenerationResult> {
    try {
      console.log("Generating wireframe with params:", params);
      const startTime = performance.now();
      
      // Validate required parameters
      if (!params.description) {
        throw new Error("Description is required for wireframe generation");
      }

      // Call the edge function for generating wireframes
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        wireframe: any;
        intentData?: any;
        blueprint?: any;
        model?: string;
        usage?: any;
      }>('generate-advanced-wireframe', {
        body: {
          userInput: params.description,
          projectId: params.projectId,
          styleToken: params.style,
          colorScheme: params.colorScheme,
          enhancedCreativity: params.enhancedCreativity,
          creativityLevel: params.creativityLevel,
          industry: params.industry,
          includeDesignMemory: true,
          baseWireframe: params.baseWireframe
        }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(`Failed to generate wireframe: ${error.message}`);
      }
      
      if (!data?.success || !data.wireframe) {
        throw new Error("Wireframe generation failed: No data returned from the service");
      }
      
      const endTime = performance.now();
      const generationTime = (endTime - startTime) / 1000; // Convert to seconds
      
      return {
        wireframe: data.wireframe,
        generationTime,
        model: data.model,
        usage: data.usage,
        success: true,
        intentData: data.intentData,
        blueprint: data.blueprint
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      
      // Return an error state that the UI can handle appropriately
      return {
        wireframe: {
          id: uuidv4(),
          title: "Error Generating Wireframe",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          sections: [],
          error: true
        },
        error: error instanceof Error ? error.message : "Unknown error occurred",
        success: false
      };
    }
  }
  
  /**
   * Generate creative variations of an existing wireframe
   * @param baseWireframe The base wireframe to generate variations from
   * @param variationCount Number of variations to generate
   * @returns Array of wireframe variations
   */
  async generateVariations(
    baseWireframe: any, 
    variationCount: number = 3,
    variationPrompt?: string
  ): Promise<WireframeGenerationResult[]> {
    try {
      const variations: WireframeGenerationResult[] = [];
      
      // Generate variations using the edge function
      for (let i = 0; i < variationCount; i++) {
        try {
          // Call the edge function for generating variations
          const { data, error } = await supabase.functions.invoke<{
            success: boolean;
            wireframe: any;
            intentData?: any;
            blueprint?: any;
            model?: string;
            usage?: any;
          }>('generate-advanced-wireframe', {
            body: {
              userInput: variationPrompt || `Create variation ${i+1} of the existing wireframe`,
              baseWireframe: baseWireframe,
              isVariation: true,
              variationIndex: i + 1
            }
          });
          
          if (error) {
            console.error(`Error generating variation ${i+1}:`, error);
            continue;
          }
          
          if (data?.success && data.wireframe) {
            // Ensure a unique ID and appropriate title
            if (!data.wireframe.id) {
              data.wireframe.id = uuidv4();
            }
            
            if (!data.wireframe.title) {
              data.wireframe.title = `${baseWireframe.title || 'Wireframe'} - Variation ${i+1}`;
            }
            
            variations.push({
              wireframe: data.wireframe,
              success: true,
              intentData: data.intentData,
              blueprint: data.blueprint,
              model: data.model,
              usage: data.usage
            });
          }
        } catch (err) {
          console.error(`Failed to generate variation ${i+1}:`, err);
        }
      }
      
      // If no variations were successfully generated, return an error result
      if (variations.length === 0) {
        variations.push({
          wireframe: {
            id: uuidv4(),
            title: "Variation Generation Failed",
            description: "Could not generate variations of the wireframe",
            sections: [],
            error: true
          },
          success: false,
          error: "Failed to generate variations"
        });
      }
      
      return variations;
    } catch (error) {
      console.error("Error generating variations:", error);
      return [{
        wireframe: {
          id: uuidv4(),
          title: "Variation Generation Failed",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          sections: [],
          error: true
        },
        error: error instanceof Error ? error.message : "Unknown error occurred",
        success: false
      }];
    }
  }
}

// Create a singleton instance to export
export const wireframeGenerator = new WireframeGeneratorService();
