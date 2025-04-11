
import { WireframeData, WireframeGenerationParams } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Templates for different wireframe types
 */
const templates: Record<string, Partial<WireframeData>> = {
  'landing-page': {
    sections: [
      {
        id: 'hero-section',
        name: 'Hero Section',
        sectionType: 'hero',
        description: 'Main hero section with headline and CTA',
        components: []
      },
      {
        id: 'features-section',
        name: 'Features',
        sectionType: 'features',
        description: 'Features showcase section',
        components: []
      },
      {
        id: 'testimonials-section',
        name: 'Testimonials',
        sectionType: 'testimonials',
        description: 'Customer testimonials section',
        components: []
      },
      {
        id: 'pricing-section',
        name: 'Pricing',
        sectionType: 'pricing',
        description: 'Pricing plans section',
        components: []
      },
      {
        id: 'contact-section',
        name: 'Contact',
        sectionType: 'contact',
        description: 'Contact form section',
        components: []
      },
      {
        id: 'footer-section',
        name: 'Footer',
        sectionType: 'footer',
        description: 'Footer with links and contact information',
        components: []
      }
    ]
  },
  'e-commerce': {
    sections: [
      {
        id: 'header-section',
        name: 'Header',
        sectionType: 'header',
        description: 'Main header with navigation and search',
        components: []
      },
      {
        id: 'featured-products',
        name: 'Featured Products',
        sectionType: 'products',
        description: 'Featured products showcase',
        components: []
      },
      {
        id: 'categories-section',
        name: 'Categories',
        sectionType: 'categories',
        description: 'Product categories section',
        components: []
      },
      {
        id: 'footer-section',
        name: 'Footer',
        sectionType: 'footer',
        description: 'Footer with links and contact information',
        components: []
      }
    ]
  },
};

/**
 * Creates a wireframe from a template
 */
export const createWireframeFromTemplate = async (templateId: string, params: WireframeGenerationParams): Promise<WireframeData> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const template = templates[templateId] || templates['landing-page'];
  
  const wireframe: WireframeData = {
    id: uuidv4(),
    title: params.description || `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Template`,
    description: params.designRequirements || '',
    sections: template.sections || [],
    colorScheme: {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: {
      headings: 'sans-serif',
      body: 'sans-serif'
    },
    style: params.style || {}
  };
  
  return wireframe;
};
