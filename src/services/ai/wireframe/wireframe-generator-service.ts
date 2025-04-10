
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
      
      // Check if we should call the edge function for better results
      if (params.description) {
        try {
          // Call the edge function for generating wireframes
          const { data, error } = await supabase.functions.invoke<{
            success: boolean;
            wireframe: any;
            intentData?: any;
            blueprint?: any;
          }>('generate-advanced-wireframe', {
            body: {
              userInput: params.description,
              projectId: params.projectId,
              styleToken: params.style,
              includeDesignMemory: true
            }
          });
          
          if (error) {
            console.error("Edge function error:", error);
            throw error;
          }
          
          if (data?.success && data.wireframe) {
            const endTime = performance.now();
            const generationTime = (endTime - startTime) / 1000; // Convert to seconds
            
            // Transform the wireframe to ensure it has all required fields
            const transformedWireframe = this.transformWireframeToFabricCompatible(data.wireframe);
            
            return {
              wireframe: transformedWireframe,
              generationTime,
              success: true,
              intentData: data.intentData,
              blueprint: data.blueprint
            };
          }
        } catch (edgeError) {
          console.error("Edge function failed, falling back to local generation:", edgeError);
          // Continue with local fallback if edge function fails
        }
      }
      
      // Local fallback implementation
      // If there's a baseWireframe, use it as a starting point
      let wireframeData = params.baseWireframe || {
        id: uuidv4(), // Always ensure we have an ID
        title: params.pageType || 'New Wireframe', // Ensure we always have a title
        description: params.description || 'Generated wireframe',
        sections: [],
        style: params.style || 'modern',
        colorScheme: params.colorScheme || {
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
      
      // Generate sections based on description
      if (params.description && (!wireframeData.sections || wireframeData.sections.length === 0)) {
        wireframeData.sections = this.generateSectionsFromDescription(params.description);
      }
      
      const endTime = performance.now();
      const generationTime = (endTime - startTime) / 1000; // Convert to seconds
      
      return {
        wireframe: wireframeData,
        generationTime,
        model: "local-generator",
        success: true
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      throw error;
    }
  }
  
  /**
   * Generate wireframe sections based on a text description
   */
  private generateSectionsFromDescription(description: string): WireframeSection[] {
    const sections: WireframeSection[] = [];
    
    // Simple heuristic to identify common sections from description
    const keywords = {
      hero: ['hero', 'header', 'banner', 'intro', 'introduction'],
      features: ['features', 'benefits', 'services', 'offerings'],
      about: ['about', 'company', 'team', 'story'],
      testimonials: ['testimonial', 'review', 'feedback'],
      pricing: ['pricing', 'plan', 'subscription', 'package'],
      contact: ['contact', 'reach', 'form', 'email'],
      footer: ['footer', 'bottom']
    };
    
    let offsetY = 0;
    const width = 1200;
    
    // Check for hero section (almost always include this)
    sections.push({
      id: uuidv4(),
      name: 'Hero Section',
      sectionType: 'hero',
      description: 'Main hero section with headline and call to action',
      position: { x: 0, y: offsetY },
      dimensions: { width, height: 400 }
    });
    offsetY += 420; // Add some spacing
    
    // Check for other sections based on keywords
    Object.entries(keywords).forEach(([sectionType, words]) => {
      // Skip hero as we've already added it
      if (sectionType === 'hero') return;
      
      // Check if any keyword is in the description
      if (words.some(word => description.toLowerCase().includes(word))) {
        const height = sectionType === 'footer' ? 200 : 300;
        
        sections.push({
          id: uuidv4(),
          name: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section`,
          sectionType,
          description: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} section content`,
          position: { x: 0, y: offsetY },
          dimensions: { width, height }
        });
        
        offsetY += height + 20; // Add some spacing
      }
    });
    
    // Always include a footer if not already added
    if (!sections.find(section => section.sectionType === 'footer')) {
      sections.push({
        id: uuidv4(),
        name: 'Footer Section',
        sectionType: 'footer',
        description: 'Footer with links and copyright',
        position: { x: 0, y: offsetY },
        dimensions: { width, height: 200 }
      });
    }
    
    return sections;
  }
  
  /**
   * Transform wireframe data to ensure compatibility with Fabric.js
   */
  private transformWireframeToFabricCompatible(wireframe: any): any {
    if (!wireframe) return null;
    
    // Make a deep copy to avoid modifying the original
    const transformed = JSON.parse(JSON.stringify(wireframe));
    
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
