
import { WireframeData } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing wireframe templates
 */
export const WireframeTemplateService = {
  /**
   * Create a basic empty template
   */
  createBasicTemplate(): WireframeData {
    return {
      id: uuidv4(),
      title: 'Basic Wireframe',
      description: 'A basic wireframe template',
      sections: [],
      layoutType: 'standard',
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f97316',
        background: '#ffffff'
      },
      typography: {
        headings: 'Inter',
        body: 'Inter',
        fontPairings: []
      }
    };
  },

  /**
   * Get templates for a specific industry
   */
  getTemplatesForIndustry(industry: string): WireframeData {
    const templates: Record<string, WireframeData> = {
      ecommerce: {
        id: uuidv4(),
        title: 'E-commerce Template',
        description: 'A template for e-commerce websites',
        sections: [
          {
            id: uuidv4(),
            name: 'Navigation',
            sectionType: 'navigation',
            description: 'Main navigation with cart and search',
            components: [],
            positionOrder: 0
          },
          {
            id: uuidv4(),
            name: 'Featured Products',
            sectionType: 'products',
            description: 'Featured products showcase',
            components: [],
            positionOrder: 1
          },
          {
            id: uuidv4(),
            name: 'Categories',
            sectionType: 'categories',
            description: 'Product categories',
            components: [],
            positionOrder: 2
          }
        ],
        layoutType: 'grid'
      },
      business: {
        id: uuidv4(),
        title: 'Business Template',
        description: 'A template for business websites',
        sections: [
          {
            id: uuidv4(),
            name: 'Hero',
            sectionType: 'hero',
            description: 'Main hero section',
            components: [],
            positionOrder: 0
          },
          {
            id: uuidv4(),
            name: 'Services',
            sectionType: 'services',
            description: 'Services offered',
            components: [],
            positionOrder: 1
          },
          {
            id: uuidv4(),
            name: 'Testimonials',
            sectionType: 'testimonials',
            description: 'Client testimonials',
            components: [],
            positionOrder: 2
          }
        ],
        layoutType: 'standard'
      },
      portfolio: {
        id: uuidv4(),
        title: 'Portfolio Template',
        description: 'A template for portfolio websites',
        sections: [
          {
            id: uuidv4(),
            name: 'Hero',
            sectionType: 'hero',
            description: 'Hero section with portfolio intro',
            components: [],
            positionOrder: 0
          },
          {
            id: uuidv4(),
            name: 'Works',
            sectionType: 'works',
            description: 'Portfolio works showcase',
            components: [],
            positionOrder: 1
          },
          {
            id: uuidv4(),
            name: 'About',
            sectionType: 'about',
            description: 'About the creator',
            components: [],
            positionOrder: 2
          }
        ],
        layoutType: 'masonry'
      }
    };

    return templates[industry.toLowerCase()] || this.createBasicTemplate();
  }
};
