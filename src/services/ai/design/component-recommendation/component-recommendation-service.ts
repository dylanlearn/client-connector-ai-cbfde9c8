
import { supabase } from "@/integrations/supabase/client";
import { WireframeData, WireframeSection } from "@/services/ai/wireframe/wireframe-types";
import { 
  ComponentRecommendation, 
  ComponentRecommendationResult, 
  SectionComponentRecommendations 
} from "./types";
import { AIFeatureType, selectModelForFeature } from "../../ai-model-selector";

/**
 * Service for recommending components based on context and content
 */
export class ComponentRecommendationService {
  /**
   * Get component recommendations for a wireframe based on context
   */
  static async getRecommendations(
    wireframe: WireframeData,
    pageContext?: string,
    contentType?: string,
    userIntent?: string,
    industry?: string
  ): Promise<ComponentRecommendationResult> {
    try {
      // Use GPT-4o for component recommendations (high quality)
      const model = selectModelForFeature(AIFeatureType.ComponentRecommendation);
      
      // Derive content type if not provided
      const derivedContentType = contentType || this.deriveContentType(wireframe);
      
      // Derive page context if not provided
      const derivedPageContext = pageContext || this.derivePageContext(wireframe, industry);
      
      // Extract current sections for context
      const sectionsContext = wireframe.sections.map(section => ({
        id: section.id,
        type: section.sectionType,
        name: section.name,
        components: section.components?.map(c => c.type) || []
      }));
      
      // Create a prompt for the AI to recommend components
      const promptContent = `
        Recommend appropriate UI components for a wireframe with the following details:
        
        Content Type: ${derivedContentType}
        Page Context: ${derivedPageContext}
        User Intent: ${userIntent || 'Not specified'}
        Industry: ${industry || 'Not specified'}
        
        Current Sections:
        ${JSON.stringify(sectionsContext, null, 2)}
        
        Provide recommendations for each section and some global recommendations.
        
        For each recommendation, include:
        1. Component type
        2. Component name
        3. Confidence score (0-100)
        4. Reason for recommendation
        5. Example usage (optional)
        6. Related design pattern (optional)
        
        Also identify common design patterns that would work well.
        
        Return the recommendations as a JSON object with this structure:
        {
          "pageContext": string,
          "contentType": string,
          "recommendationsBySection": [
            {
              "sectionId": string,
              "sectionType": string,
              "recommendations": [
                {
                  "componentType": string,
                  "componentName": string,
                  "confidence": number,
                  "reason": string,
                  "exampleUsage": string (optional),
                  "designPattern": string (optional)
                }
              ]
            }
          ],
          "globalRecommendations": [
            {
              "componentType": string,
              "componentName": string,
              "confidence": number,
              "reason": string
            }
          ],
          "designPatterns": string[]
        }
      `;
      
      const systemPrompt = `You are an expert UI/UX designer specializing in component selection.
        You understand which components work best in different contexts and for different types of content.
        You know how to balance usability, aesthetics, and functionality when recommending components.
        Provide recommendations based on established design patterns and best practices.`;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.4,
          model
        },
      });
      
      if (error) throw error;
      
      // Parse the AI response into our expected format
      let recommendations: ComponentRecommendationResult;
      
      try {
        recommendations = JSON.parse(data.response);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        // Fallback to a default response if parsing fails
        recommendations = this.getDefaultRecommendations(wireframe, derivedPageContext, derivedContentType);
      }
      
      return recommendations;
      
    } catch (error) {
      console.error("Error getting component recommendations:", error);
      return this.getDefaultRecommendations(wireframe);
    }
  }
  
  /**
   * Get recommendations for a specific section
   */
  static async getSectionRecommendations(
    wireframe: WireframeData,
    sectionId: string,
    maxRecommendations: number = 5
  ): Promise<ComponentRecommendation[]> {
    try {
      const section = wireframe.sections.find(s => s.id === sectionId);
      
      if (!section) {
        throw new Error(`Section with ID ${sectionId} not found`);
      }
      
      // Get recommendations for the entire wireframe
      const allRecommendations = await this.getRecommendations(wireframe);
      
      // Find recommendations for this specific section
      const sectionRecommendations = allRecommendations.recommendationsBySection
        .find(s => s.sectionId === sectionId)?.recommendations || [];
      
      // If we don't have enough section-specific recommendations, add some global ones
      if (sectionRecommendations.length < maxRecommendations) {
        const globalRecsToAdd = allRecommendations.globalRecommendations
          .slice(0, maxRecommendations - sectionRecommendations.length);
        
        return [...sectionRecommendations, ...globalRecsToAdd];
      }
      
      return sectionRecommendations.slice(0, maxRecommendations);
      
    } catch (error) {
      console.error("Error getting section recommendations:", error);
      return this.getDefaultSectionRecommendations(wireframe, sectionId);
    }
  }
  
  /**
   * Generate default recommendations when the AI recommendation fails
   */
  private static getDefaultRecommendations(
    wireframe: WireframeData,
    pageContext: string = 'Website page',
    contentType: string = 'General content'
  ): ComponentRecommendationResult {
    // Create default recommendations for each section
    const recommendationsBySection: SectionComponentRecommendations[] = wireframe.sections.map(section => {
      const recommendations = this.getDefaultSectionRecommendations(wireframe, section.id);
      
      return {
        sectionId: section.id,
        sectionType: section.sectionType,
        recommendations
      };
    });
    
    // Create default global recommendations
    const globalRecommendations: ComponentRecommendation[] = [
      {
        componentType: 'navigation',
        componentName: 'Header Navigation',
        confidence: 90,
        reason: 'Essential for site navigation'
      },
      {
        componentType: 'button',
        componentName: 'Call to Action Button',
        confidence: 85,
        reason: 'Drives user conversion'
      },
      {
        componentType: 'footer',
        componentName: 'Site Footer',
        confidence: 80,
        reason: 'Provides important links and info'
      }
    ];
    
    return {
      pageContext,
      contentType,
      recommendationsBySection,
      globalRecommendations,
      designPatterns: ['Card Layout', 'Hero Section', 'Feature Grid']
    };
  }
  
  /**
   * Generate default recommendations for a specific section
   */
  private static getDefaultSectionRecommendations(
    wireframe: WireframeData,
    sectionId: string
  ): ComponentRecommendation[] {
    const section = wireframe.sections.find(s => s.id === sectionId);
    
    if (!section) {
      return [
        {
          componentType: 'text',
          componentName: 'Text Block',
          confidence: 70,
          reason: 'Generic content component'
        }
      ];
    }
    
    // Provide different recommendations based on section type
    switch (section.sectionType) {
      case 'hero':
        return [
          {
            componentType: 'heading',
            componentName: 'Hero Heading',
            confidence: 90,
            reason: 'Main page title for hero section',
            exampleUsage: '<h1>Your Compelling Headline</h1>'
          },
          {
            componentType: 'button',
            componentName: 'CTA Button',
            confidence: 85,
            reason: 'Primary call to action',
            exampleUsage: '<button>Get Started</button>'
          },
          {
            componentType: 'image',
            componentName: 'Hero Image',
            confidence: 80,
            reason: 'Visual element for hero section',
            designPattern: 'Split-screen hero'
          }
        ];
        
      case 'features':
        return [
          {
            componentType: 'card',
            componentName: 'Feature Card',
            confidence: 90,
            reason: 'Display feature highlights',
            designPattern: 'Card Grid'
          },
          {
            componentType: 'icon',
            componentName: 'Feature Icon',
            confidence: 85,
            reason: 'Visual representation of features'
          },
          {
            componentType: 'heading',
            componentName: 'Feature Title',
            confidence: 80,
            reason: 'Title for each feature'
          }
        ];
        
      case 'testimonials':
        return [
          {
            componentType: 'card',
            componentName: 'Testimonial Card',
            confidence: 90,
            reason: 'Display testimonial quotes',
            designPattern: 'Social Proof'
          },
          {
            componentType: 'avatar',
            componentName: 'Customer Avatar',
            confidence: 85,
            reason: 'Visual representation of customer'
          },
          {
            componentType: 'quote',
            componentName: 'Quote Block',
            confidence: 80,
            reason: 'Highlighted customer quote'
          }
        ];
        
      default:
        return [
          {
            componentType: 'text',
            componentName: 'Text Block',
            confidence: 75,
            reason: 'Basic content component'
          },
          {
            componentType: 'button',
            componentName: 'Action Button',
            confidence: 70,
            reason: 'User interaction element'
          },
          {
            componentType: 'image',
            componentName: 'Image Block',
            confidence: 65,
            reason: 'Visual content'
          }
        ];
    }
  }
  
  /**
   * Derive content type from wireframe if not specified
   */
  private static deriveContentType(wireframe: WireframeData): string {
    const sectionTypes = wireframe.sections.map(s => s.sectionType);
    
    if (sectionTypes.includes('product') || sectionTypes.includes('pricing')) {
      return 'Product/Service Information';
    }
    
    if (sectionTypes.includes('blog') || sectionTypes.includes('article')) {
      return 'Editorial Content';
    }
    
    if (sectionTypes.includes('contact') || sectionTypes.includes('form')) {
      return 'User Input/Form';
    }
    
    if (sectionTypes.includes('hero') && sectionTypes.includes('features')) {
      return 'Marketing/Landing Page';
    }
    
    return 'General Website Content';
  }
  
  /**
   * Derive page context from wireframe if not specified
   */
  private static derivePageContext(wireframe: WireframeData, industry?: string): string {
    const title = wireframe.title.toLowerCase();
    
    if (title.includes('home') || title.includes('landing')) {
      return 'Homepage/Landing Page';
    }
    
    if (title.includes('about')) {
      return 'About Page';
    }
    
    if (title.includes('product') || title.includes('service')) {
      return 'Product/Service Page';
    }
    
    if (title.includes('contact')) {
      return 'Contact Page';
    }
    
    if (title.includes('blog') || title.includes('article')) {
      return 'Blog/Article Page';
    }
    
    if (industry) {
      return `${industry} Website Page`;
    }
    
    return 'Website Page';
  }
}
