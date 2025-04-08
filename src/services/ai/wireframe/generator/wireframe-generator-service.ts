import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult 
} from '../wireframe-types';

interface WireframeResult {
  wireframe: any;
  generationTime?: number;
  model?: string;
  usage?: {
    total_tokens?: number;
    completion_tokens?: number;
    prompt_tokens?: number;
  };
  success: boolean;
}

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
      
      // If there's a baseWireframe, use it as a starting point
      let wireframeData = params.baseWireframe || {
        id: uuidv4(), // Always ensure we have an ID
        title: params.pageType || 'New Wireframe', // Ensure we always have a title
        description: params.description || 'Generated wireframe',
        sections: [],
        style: params.style || 'modern',
        colorScheme: {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#f59e0b',
          background: '#ffffff'
        },
        typography: {
          headings: 'Inter',
          body: 'Roboto',
          fontPairings: ['Inter', 'Roboto']
        }
      };
      
      // Ensure ID is set even if it's passed in the params
      if (!wireframeData.id) {
        wireframeData.id = uuidv4();
      }
      
      // Ensure title is set even if it's passed in the params
      if (!wireframeData.title) {
        wireframeData.title = params.pageType || 'New Wireframe';
      }
      
      // TODO: This is where we would call the AI service to generate the wireframe
      // Mock implementation for now
      
      // Add some default sections if no sections exist
      if (!wireframeData.sections || wireframeData.sections.length === 0) {
        wireframeData.sections = [
          {
            id: uuidv4(),
            name: 'Hero Section',
            sectionType: 'hero',
            description: 'Main hero section'
          },
          {
            id: uuidv4(),
            name: 'Features Section',
            sectionType: 'features',
            description: 'Features showcase'
          }
        ];
      }
      
      const endTime = performance.now();
      const generationTime = (endTime - startTime) / 1000; // Convert to seconds
      
      return {
        wireframe: wireframeData,
        generationTime,
        model: "mock-model",
        usage: {
          total_tokens: 1000,
          completion_tokens: 500,
          prompt_tokens: 500
        },
        success: true
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      throw error;
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
    variationCount: number = 3
  ): Promise<WireframeGenerationResult[]> {
    // Create array to hold variations
    const variations: WireframeGenerationResult[] = [];
    
    // Generate variations
    for (let i = 0; i < variationCount; i++) {
      // Deep clone the base wireframe
      const clone = JSON.parse(JSON.stringify(baseWireframe));
      
      // Modify clone to create a variation
      const variation = {
        ...clone,
        id: clone.id || uuidv4(), // Ensure ID is always present
        title: `${clone.title} - Variation ${i + 1}`
      };
      
      variations.push({
        wireframe: variation,
        success: true
      });
    }
    
    return variations;
  }
}

// Create a singleton instance to export
export const wireframeGenerator = new WireframeGeneratorService();
