
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { supabase } from '@/integrations/supabase/client';
import { AIFeatureType, selectModelForFeature } from '@/services/ai/ai-model-selector';
import { v4 as uuidv4 } from 'uuid';

export interface SectionContent {
  title?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  ctaText?: string;
  bullets?: string[];
  testimonial?: string;
  author?: string;
  statLabel?: string;
  statValue?: string;
}

export interface GeneratedSectionContent {
  sectionId: string;
  sectionType: string;
  content: SectionContent;
}

export interface ContentGenerationOptions {
  tone?: 'professional' | 'friendly' | 'enthusiastic' | 'technical' | 'formal';
  contentLength?: 'brief' | 'moderate' | 'detailed';
  includeCallToAction?: boolean;
  targetAudience?: string;
  industry?: string;
  keywords?: string[];
}

/**
 * Service for generating contextually-aware content for wireframes
 */
export class ContextAwareContentService {
  /**
   * Generate content for an entire wireframe
   */
  static async generateContentForWireframe(
    wireframe: WireframeData,
    options: ContentGenerationOptions = {}
  ): Promise<GeneratedSectionContent[]> {
    try {
      // Generate content for each section
      const contentPromises = wireframe.sections.map(section => 
        this.generateContentForSection(section, wireframe, options)
      );
      
      const sectionsContent = await Promise.all(contentPromises);
      return sectionsContent;
      
    } catch (error) {
      console.error('Error generating content for wireframe:', error);
      return [];
    }
  }
  
  /**
   * Generate content for a specific section
   */
  static async generateContentForSection(
    section: WireframeSection,
    wireframeContext: WireframeData,
    options: ContentGenerationOptions = {}
  ): Promise<GeneratedSectionContent> {
    try {
      const model = selectModelForFeature(AIFeatureType.ContentGeneration);
      
      // Determine content needs based on section type
      const contentNeeds = this.determineSectionContentNeeds(section);
      
      const promptContent = `
        Generate content for a wireframe section with the following context:
        
        Wireframe Title: ${wireframeContext.title}
        Wireframe Description: ${wireframeContext.description || 'Not provided'}
        Section Type: ${section.sectionType || 'Generic section'}
        
        Content Requirements:
        ${contentNeeds.map(need => `- ${need}`).join('\n')}
        
        Content Style:
        - Tone: ${options.tone || 'professional'}
        - Length: ${options.contentLength || 'moderate'}
        - Include Call to Action: ${options.includeCallToAction ? 'Yes' : 'No'}
        ${options.targetAudience ? `- Target Audience: ${options.targetAudience}` : ''}
        ${options.industry ? `- Industry: ${options.industry}` : ''}
        ${options.keywords?.length ? `- Keywords to include: ${options.keywords.join(', ')}` : ''}
        
        Return a JSON object with these fields (only include fields relevant to the section type):
        {
          "title": "Section title",
          "heading": "Main heading",
          "subheading": "Supporting subheading",
          "description": "Paragraph text content",
          "ctaText": "Call to action button text",
          "bullets": ["Bullet point 1", "Bullet point 2"],
          "testimonial": "Testimonial text",
          "author": "Testimonial author",
          "statLabel": "Statistic label",
          "statValue": "Statistic value"
        }
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are an expert copywriter specializing in creating compelling website content that is concise, engaging, and tailored to the specific section of a wireframe.",
          temperature: 0.7,
          model
        },
      });
      
      if (error) throw new Error(`Content generation error: ${error.message}`);
      
      // Parse the response and construct the content object
      const content = JSON.parse(data.response);
      
      return {
        sectionId: section.id,
        sectionType: section.sectionType || 'generic',
        content
      };
      
    } catch (error) {
      console.error('Error generating content for section:', error);
      
      // Return a minimal valid object in case of error
      return {
        sectionId: section.id,
        sectionType: section.sectionType || 'generic',
        content: {
          heading: `Placeholder heading for ${section.sectionType || 'section'}`,
          description: 'Content generation failed. Please try again.'
        }
      };
    }
  }
  
  /**
   * Determine what content fields are needed based on section type
   */
  private static determineSectionContentNeeds(section: WireframeSection): string[] {
    const sectionType = section.sectionType?.toLowerCase() || '';
    const needs: string[] = [];
    
    // Common content needs
    needs.push('Section title (if appropriate)');
    
    // Type-specific content needs
    if (sectionType.includes('hero') || sectionType.includes('header')) {
      needs.push('Compelling main heading');
      needs.push('Brief, engaging subheading');
      needs.push('Clear call to action text');
    } 
    else if (sectionType.includes('feature') || sectionType.includes('benefit')) {
      needs.push('Feature/benefit heading');
      needs.push('Concise description of value proposition');
      needs.push('Supporting details (2-3 bullet points if appropriate)');
    }
    else if (sectionType.includes('about')) {
      needs.push('About section heading');
      needs.push('Company/product story or description');
    }
    else if (sectionType.includes('testimonial')) {
      needs.push('Brief, impactful testimonial quote');
      needs.push('Testimonial author name');
      needs.push('Author role or company (if appropriate)');
    }
    else if (sectionType.includes('stat') || sectionType.includes('metrics')) {
      needs.push('Statistic value (number or percentage)');
      needs.push('Statistic label or description');
    }
    else if (sectionType.includes('cta') || sectionType.includes('contact')) {
      needs.push('Call to action heading');
      needs.push('Supporting text explaining value');
      needs.push('Button or link text');
    }
    else if (sectionType.includes('pricing') || sectionType.includes('plan')) {
      needs.push('Plan name/tier');
      needs.push('Brief plan description');
      needs.push('Key features (3-5 bullet points)');
      needs.push('Call to action for plan selection');
    }
    else if (sectionType.includes('faq')) {
      needs.push('Question text');
      needs.push('Answer text');
    }
    else if (sectionType.includes('footer')) {
      needs.push('Footer tagline or slogan (if appropriate)');
      needs.push('Copyright text');
    }
    else {
      // Generic section with no specific type
      needs.push('Appropriate heading for general content');
      needs.push('Supporting paragraph text');
      if (section.components?.some(c => c.type === 'button' || c.type === 'cta')) {
        needs.push('Call to action text');
      }
    }
    
    return needs;
  }
}
