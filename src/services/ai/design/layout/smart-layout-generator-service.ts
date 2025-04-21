import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { supabase } from '@/integrations/supabase/client';
import { AIFeatureType, selectModelForFeature } from '@/services/ai/ai-model-selector';
import { v4 as uuidv4 } from 'uuid';

export interface LayoutAlternative {
  id: string;
  name: string;
  description: string;
  layoutType: string;
  sections: WireframeSection[];
  score?: number;
  benefits?: string[];
  preview?: string;
}

export interface LayoutGenerationOptions {
  count?: number;
  focusArea?: 'conversion' | 'readability' | 'engagement' | 'accessibility';
  preserveSections?: string[];
  stylePreference?: string;
  industryContext?: string;
}

export interface LayoutGenerationResult {
  alternatives: LayoutAlternative[];
  originalLayout: {
    id: string;
    name: string;
    sections: WireframeSection[];
  };
  summary: string;
}

/**
 * Service for generating smart layout alternatives based on existing content
 */
export class SmartLayoutGeneratorService {
  /**
   * Generate layout alternatives for a wireframe
   */
  static async generateAlternatives(
    wireframe: WireframeData,
    options: LayoutGenerationOptions = {}
  ): Promise<LayoutGenerationResult> {
    try {
      const { count = 3, focusArea, preserveSections = [], industryContext } = options;
      
      // Create a simplified version of the wireframe for AI processing
      const simplifiedWireframe = {
        title: wireframe.title,
        description: wireframe.description,
        colorScheme: wireframe.colorScheme,
        typography: wireframe.typography,
        layoutType: wireframe.layoutType,
        sections: wireframe.sections.map(section => ({
          id: section.id,
          type: section.sectionType,
          name: section.name,
          components: section.components?.map(c => ({
            id: c.id,
            type: c.type,
            content: c.content || c.text
          }))
        }))
      };
      
      // Identify which sections should be preserved in their current form
      const sectionsToPreserve = new Set(preserveSections);
      
      // Generate alternatives with AI
      const alternatives = await this.callLayoutAI(
        simplifiedWireframe,
        count,
        focusArea,
        sectionsToPreserve,
        industryContext
      );
      
      // Create summary of the alternatives
      const summary = await this.generateAlternativesSummary(
        alternatives, 
        wireframe.title,
        focusArea
      );
      
      return {
        alternatives,
        originalLayout: {
          id: 'original',
          name: 'Original Layout',
          sections: wireframe.sections
        },
        summary
      };
    } catch (error) {
      console.error('Error generating layout alternatives:', error);
      
      return {
        alternatives: [],
        originalLayout: {
          id: 'original',
          name: 'Original Layout',
          sections: wireframe.sections
        },
        summary: 'Failed to generate layout alternatives. Please try again later.'
      };
    }
  }
  
  /**
   * Generate alternatives for a specific section
   */
  static async generateSectionAlternatives(
    section: WireframeSection,
    wireframeContext: WireframeData,
    count: number = 2
  ): Promise<LayoutAlternative[]> {
    try {
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
      const promptContent = `
        Generate ${count} alternative layouts for this wireframe section while preserving the core content:
        ${JSON.stringify(section)}
        
        Wireframe context:
        Title: ${wireframeContext.title}
        Description: ${wireframeContext.description || 'N/A'}
        
        For each alternative, create variations in structure, component arrangement, and visual hierarchy.
        Return a JSON array with this format:
        [
          {
            "id": "unique-id",
            "name": "Alternative Name",
            "description": "Brief description of this alternative approach",
            "layoutType": "Specific layout pattern name",
            "sections": [
              {
                // Complete section definition with all required properties
                "id": "string",
                "name": "string",
                "sectionType": "string",
                "components": [...],
                // Include any other required properties for a valid section
              }
            ],
            "benefits": ["Benefit 1", "Benefit 2"]
          }
        ]
        Ensure that each section has ALL required properties including id, name, sectionType, and components.
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are a UX/UI design expert specializing in creating layout alternatives that maintain content while exploring different structural approaches.",
          temperature: 0.7,
          model
        },
      });
      
      if (error) {
        throw new Error(`AI layout generation error: ${error.message}`);
      }
      
      // Parse and validate the response
      const alternatives = JSON.parse(data.response);
      
      // Ensure all alternatives have the required properties
      return alternatives.map((alt: any) => {
        // Ensure each section has the required properties
        const validatedSections = alt.sections.map((section: any) => {
          return {
            id: section.id || uuidv4(),
            name: section.name || 'Unnamed Section',
            sectionType: section.sectionType || 'generic',
            components: section.components || [],
            // Add any other required properties
            description: section.description || '',
            position: section.position || { x: 0, y: 0 },
            dimensions: section.dimensions || { width: '100%', height: 'auto' },
            style: section.style || {},
            ...section
          };
        });
        
        return {
          id: alt.id || uuidv4(),
          name: alt.name || 'Unnamed Alternative',
          description: alt.description || 'Alternative layout variation',
          layoutType: alt.layoutType || 'custom',
          sections: validatedSections,
          benefits: alt.benefits || [],
          score: alt.score || undefined
        };
      });
    } catch (error) {
      console.error('Error generating section alternatives:', error);
      return [];
    }
  }
  
  /**
   * Call the AI to generate layout alternatives
   */
  private static async callLayoutAI(
    wireframe: any,
    count: number,
    focusArea?: string,
    sectionsToPreserve: Set<string> = new Set(),
    industryContext?: string
  ): Promise<LayoutAlternative[]> {
    try {
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
      const promptContent = `
        Generate ${count} alternative layouts for this wireframe while preserving the core content:
        ${JSON.stringify(wireframe)}
        
        ${focusArea ? `Focus on optimizing for ${focusArea}.` : ''}
        ${industryContext ? `Industry context: ${industryContext}` : ''}
        ${sectionsToPreserve.size > 0 ? `The following sections must be preserved as-is: ${Array.from(sectionsToPreserve).join(', ')}` : ''}
        
        For each alternative, create variations in structure, component arrangement, and visual hierarchy.
        Return a JSON array with this format:
        [
          {
            "id": "unique-id",
            "name": "Alternative Name",
            "description": "Brief description of this alternative approach",
            "layoutType": "Specific layout pattern name",
            "sections": [
              {
                // Complete section definition with all required properties
                "id": "string",
                "name": "string",
                "sectionType": "string",
                "components": [...],
                // Include any other required properties for a valid section
              }
            ],
            "benefits": ["Benefit 1", "Benefit 2"]
          }
        ]
        Ensure that each section has ALL required properties including id, name, sectionType, and all other necessary fields.
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are a UX/UI design expert specializing in creating layout alternatives that maintain content while exploring different structural approaches.",
          temperature: 0.7,
          model
        },
      });
      
      if (error) {
        throw new Error(`AI layout generation error: ${error.message}`);
      }
      
      // Parse and validate the response
      const alternatives = JSON.parse(data.response);
      
      // Process alternatives to ensure they have all required properties
      return alternatives.map((alt: any) => {
        // Validate sections to ensure they have all required properties
        const processedSections = alt.sections.map((section: any) => {
          // If this section should be preserved, find the original
          if (sectionsToPreserve.has(section.id)) {
            const originalSection = wireframe.sections.find((s: any) => s.id === section.id);
            if (originalSection) {
              return originalSection;
            }
          }
          
          // Otherwise ensure it has all required properties
          return {
            id: section.id || uuidv4(),
            name: section.name || 'Unnamed Section',
            sectionType: section.sectionType || 'generic',
            description: section.description || '',
            components: section.components || [],
            // Add other required properties with defaults
            layout: section.layout || { type: 'flex', direction: 'column' },
            position: section.position || { x: 0, y: 0 },
            dimensions: section.dimensions || { width: '100%', height: 'auto' },
            style: section.style || {},
            ...section
          };
        });
        
        return {
          id: alt.id || uuidv4(),
          name: alt.name || 'Alternative Layout',
          description: alt.description || 'An alternative layout approach',
          layoutType: alt.layoutType || 'custom',
          sections: processedSections,
          benefits: alt.benefits || [],
          score: alt.score
        };
      });
    } catch (error) {
      console.error('Error in AI layout generation:', error);
      return [];
    }
  }
  
  /**
   * Generate a summary of the layout alternatives
   */
  private static async generateAlternativesSummary(
    alternatives: LayoutAlternative[],
    title: string,
    focusArea?: string
  ): Promise<string> {
    if (alternatives.length === 0) {
      return "No layout alternatives were generated.";
    }
    
    try {
      const model = selectModelForFeature(AIFeatureType.Summarization);
      
      const promptContent = `
        Summarize these ${alternatives.length} layout alternatives for "${title}":
        
        ${alternatives.map(alt => 
          `Alternative: ${alt.name}
           Description: ${alt.description}
           Layout Type: ${alt.layoutType}
           Benefits: ${alt.benefits?.join(', ')}`
        ).join('\n\n')}
        
        ${focusArea ? `These alternatives were optimized for ${focusArea}.` : ''}
        
        Provide a brief, helpful summary highlighting the key differences between the alternatives
        and how they might impact user experience. Keep your response to 2-3 sentences.
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are a UX design expert providing concise, insightful summaries of layout alternatives.",
          temperature: 0.7,
          model
        },
      });
      
      if (error) {
        throw new Error(`Summary generation error: ${error.message}`);
      }
      
      return data.response;
    } catch (error) {
      console.error('Error generating alternatives summary:', error);
      return `Generated ${alternatives.length} layout alternatives with different structural approaches.`;
    }
  }
  
  /**
   * Apply a selected layout alternative to the wireframe
   */
  static applyLayoutAlternative(
    wireframe: WireframeData,
    alternativeId: string,
    alternatives: LayoutAlternative[]
  ): WireframeData {
    // Find the selected alternative
    const selected = alternatives.find(alt => alt.id === alternativeId);
    
    if (!selected) {
      console.error(`Layout alternative with ID ${alternativeId} not found`);
      return wireframe;
    }
    
    // Create a new wireframe with the alternative layout
    return {
      ...wireframe,
      sections: selected.sections,
      layoutType: selected.layoutType || wireframe.layoutType,
      designReasoning: wireframe.designReasoning 
        ? [...wireframe.designReasoning, `Applied layout alternative: ${selected.name}`]
        : [`Applied layout alternative: ${selected.name}`]
    };
  }
}
