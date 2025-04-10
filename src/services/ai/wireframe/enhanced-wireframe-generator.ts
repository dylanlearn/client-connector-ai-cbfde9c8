
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  EnhancedWireframeGenerationResult,
  WireframeData
} from "./wireframe-types";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for generating enhanced wireframes with AI
 */
export class EnhancedWireframeGenerator {
  /**
   * Generate a wireframe using the advanced generation edge function
   */
  static async generateWireframe(params: WireframeGenerationParams): Promise<EnhancedWireframeGenerationResult> {
    try {
      const startTime = performance.now();
      
      // Prepare the request payload
      const requestPayload = {
        action: 'generate-wireframe',
        userInput: params.description,
        styleToken: params.style || undefined,
        colorScheme: params.colorScheme || undefined,
        enhancedCreativity: params.enhancedCreativity ?? true,
        creativityLevel: params.creativityLevel ?? 7,
        industry: params.industry || undefined,
        baseWireframe: params.baseWireframe || undefined,
        isVariation: !!params.baseWireframe,
        intakeData: params.intakeData || undefined
      };
      
      // Call the edge function
      console.log("Calling generate-advanced-wireframe edge function...");
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        wireframe: WireframeData;
        intentData?: any;
        blueprint?: any;
        error?: string;
        model?: string;
        usage?: any;
        generationTime?: number;
      }>('generate-advanced-wireframe', {
        body: requestPayload
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.success || !data.wireframe) {
        throw new Error(`Generation failed: ${data?.error || 'No wireframe data returned'}`);
      }
      
      // Calculate the total generation time
      const endTime = performance.now();
      const totalTime = (endTime - startTime) / 1000; // Convert to seconds
      
      // Return the successful result
      return {
        wireframe: data.wireframe,
        success: true,
        intentData: data.intentData || null,
        blueprint: data.blueprint || null,
        designTokens: data.wireframe.designTokens || {},
        generationTime: data.generationTime || totalTime,
        model: data.model
      };
      
    } catch (error) {
      console.error("Error generating enhanced wireframe:", error);
      
      // Create a fallback error wireframe
      const errorWireframe: WireframeData = {
        id: uuidv4(),
        title: "Error: Wireframe Generation Failed",
        sections: [],
        description: `Error: ${error instanceof Error ? error.message : String(error)}`
      };
      
      // Return an error result
      return {
        wireframe: errorWireframe,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        intentData: null,
        blueprint: null,
        designTokens: {},
        generationTime: 0
      };
    }
  }
  
  /**
   * Generate improved suggestions for a wireframe section
   */
  static async generateSectionSuggestions(wireframe: WireframeData, sectionId?: string): Promise<any[]> {
    try {
      if (!wireframe) {
        throw new Error("Valid wireframe is required for generating suggestions");
      }
      
      // Prepare the request payload
      const requestPayload = {
        action: 'generate-suggestions',
        wireframe,
        targetSection: sectionId
      };
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        suggestions: any[];
        error?: string;
      }>('generate-advanced-wireframe', {
        body: requestPayload
      });
      
      if (error || !data?.success) {
        throw new Error(`Failed to generate suggestions: ${error?.message || data?.error || 'Unknown error'}`);
      }
      
      return data.suggestions || [];
      
    } catch (error) {
      console.error("Error generating wireframe suggestions:", error);
      throw error;
    }
  }
  
  /**
   * Create a variation of an existing wireframe
   */
  static async createWireframeVariation(
    baseWireframe: WireframeData, 
    variationType: 'creative' | 'minimal' | 'professional' = 'creative',
    creativityLevel: number = 8
  ): Promise<EnhancedWireframeGenerationResult> {
    try {
      if (!baseWireframe) {
        throw new Error("Base wireframe is required for creating a variation");
      }
      
      // Define a new description based on the variation type
      let description = `Create a ${variationType} variation of: ${baseWireframe.title}`;
      
      // Set style based on variation type
      let style = baseWireframe.style;
      if (variationType === 'minimal') {
        style = 'minimal';
      } else if (variationType === 'professional') {
        style = 'corporate';
      }
      
      // Generate the variation
      return await this.generateWireframe({
        description,
        style,
        baseWireframe,
        creativityLevel,
        enhancedCreativity: variationType === 'creative'
      });
      
    } catch (error) {
      console.error("Error creating wireframe variation:", error);
      
      // Create a fallback error wireframe
      const errorWireframe: WireframeData = {
        id: uuidv4(),
        title: "Error: Variation Creation Failed",
        sections: [],
        description: `Error: ${error instanceof Error ? error.message : String(error)}`
      };
      
      // Return an error result
      return {
        wireframe: errorWireframe,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        intentData: null,
        blueprint: null,
        designTokens: {},
        generationTime: 0
      };
    }
  }
}
