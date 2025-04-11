
import { WireframeData, WireframeGenerationParams } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a wireframe from a template
 */
export const createWireframeFromTemplate = async (
  templateId: string,
  params: Partial<WireframeGenerationParams>
): Promise<WireframeData> => {
  // In a real implementation, this would fetch a template from a database
  // and customize it based on the provided parameters
  
  // This is a mock implementation
  const wireframe: WireframeData = {
    id: uuidv4(),
    title: params.description || 'Template-based Wireframe',
    sections: [],
    colorScheme: {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    }
  };
  
  // Add some mock sections based on template
  wireframe.sections = generateTemplateSections(templateId, params);
  
  return wireframe;
};

/**
 * Generate sections based on template ID
 */
const generateTemplateSections = (templateId: string, params: Partial<WireframeGenerationParams>) => {
  switch (templateId) {
    case 'landing-page':
      return [
        {
          id: uuidv4(),
          name: 'Hero Section',
          sectionType: 'hero',
          description: 'Main hero section with call to action'
        },
        {
          id: uuidv4(),
          name: 'Features Section',
          sectionType: 'features',
          description: 'Highlights the main features'
        },
        {
          id: uuidv4(),
          name: 'CTA Section',
          sectionType: 'cta',
          description: 'Call to action section'
        }
      ];
    
    case 'product-page':
      return [
        {
          id: uuidv4(),
          name: 'Product Hero',
          sectionType: 'hero',
          description: 'Product showcase hero section'
        },
        {
          id: uuidv4(),
          name: 'Product Features',
          sectionType: 'features',
          description: 'Product features and benefits'
        },
        {
          id: uuidv4(),
          name: 'Pricing',
          sectionType: 'pricing',
          description: 'Product pricing options'
        },
        {
          id: uuidv4(),
          name: 'Testimonials',
          sectionType: 'testimonials',
          description: 'Customer testimonials'
        }
      ];
    
    default:
      return [
        {
          id: uuidv4(),
          name: 'Generic Section',
          sectionType: 'hero',
          description: 'Generic section for the template'
        }
      ];
  }
};

/**
 * List available templates
 */
export const listWireframeTemplates = async () => {
  // In a real implementation, this would fetch templates from a database
  return [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'A standard landing page template',
      thumbnail: 'https://example.com/thumbnails/landing-page.jpg',
      colorScheme: {
        primary: '#3182ce',
        secondary: '#805ad5',
        accent: '#ed8936',
        background: '#ffffff',
        text: '#1a202c'
      },
      tags: ['marketing', 'landing']
    },
    {
      id: 'product-page',
      name: 'Product Page',
      description: 'A template designed for product showcases',
      thumbnail: 'https://example.com/thumbnails/product-page.jpg',
      colorScheme: {
        primary: '#2c7a7b',
        secondary: '#9f7aea',
        accent: '#ed64a6',
        background: '#ffffff',
        text: '#1a202c'
      },
      tags: ['product', 'sales']
    }
  ];
};
