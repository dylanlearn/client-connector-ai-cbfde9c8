
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeSection
} from './wireframe-types';
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for generating wireframes
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
          includeDesignMemory: true
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
      
      // Transform the wireframe to ensure it has all required fields
      const transformedWireframe = this.transformWireframeToFabricCompatible(data.wireframe);
      
      return {
        wireframe: transformedWireframe,
        generationTime,
        model: data.model,
        usage: data.usage,
        success: true,
        intentData: data.intentData,
        blueprint: data.blueprint
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      
      // Instead of falling back to mock data, return an error state
      // that the UI can handle appropriately
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
   * Transform wireframe data to ensure compatibility with Fabric.js
   */
  private transformWireframeToFabricCompatible(wireframe: any): any {
    if (!wireframe) return null;
    
    // Make a deep copy to avoid modifying the original
    const transformed = JSON.parse(JSON.stringify(wireframe));
    
    // Ensure the wireframe has a valid ID
    if (!transformed.id) {
      transformed.id = uuidv4();
    }
    
    // Ensure the wireframe has a title
    if (!transformed.title) {
      transformed.title = "Generated Wireframe";
    }
    
    // Ensure all sections have position and dimensions
    if (transformed.sections && Array.isArray(transformed.sections)) {
      let offsetY = 0;
      const width = 1200;
      
      transformed.sections.forEach((section: WireframeSection, index: number) => {
        // Ensure section has an ID
        if (!section.id) {
          section.id = uuidv4();
        }
        
        // Ensure section has a name
        if (!section.name) {
          section.name = `${section.sectionType || 'Section'} ${index + 1}`;
        }
        
        // Ensure section has position
        if (!section.position) {
          section.position = { x: 0, y: offsetY };
        }
        
        // Ensure section has dimensions
        if (!section.dimensions) {
          const height = section.sectionType === 'hero' ? 400 : 
                         section.sectionType === 'footer' ? 200 : 300;
          section.dimensions = { width, height };
        }
        
        // Update offsetY for next section
        offsetY += (section.dimensions.height || 300) + 20;
      });
    }
    
    return transformed;
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
          // Transform the wireframe variation
          const transformedVariation = this.transformWireframeToFabricCompatible(data.wireframe);
          
          // Ensure a unique ID and appropriate title
          transformedVariation.id = uuidv4();
          transformedVariation.title = `${baseWireframe.title} - Variation ${i+1}`;
          
          variations.push({
            wireframe: transformedVariation,
            success: true,
            intentData: data.intentData,
            blueprint: data.blueprint
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
  }
}

// Create a singleton instance to export
export const wireframeGenerator = new WireframeGeneratorService();
