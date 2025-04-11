
import { WireframeGenerationParams, WireframeData } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

// Define common templates
const templates = {
  'landing-page': {
    id: 'landing-page-template',
    title: 'Landing Page Template',
    sections: [
      {
        id: uuidv4(),
        name: 'Hero Section',
        sectionType: 'hero',
        description: 'Main hero section with headline and CTA'
      },
      {
        id: uuidv4(),
        name: 'Features',
        sectionType: 'features',
        description: 'Features showcase section'
      },
      {
        id: uuidv4(),
        name: 'Testimonials',
        sectionType: 'testimonials',
        description: 'Customer testimonials'
      },
      {
        id: uuidv4(),
        name: 'Footer',
        sectionType: 'footer',
        description: 'Footer with links and contact information'
      }
    ],
    colorScheme: {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    }
  },
  'product-page': {
    id: 'product-page-template',
    title: 'Product Page Template',
    sections: [
      {
        id: uuidv4(),
        name: 'Product Hero',
        sectionType: 'hero',
        description: 'Product showcase with image and key features'
      },
      {
        id: uuidv4(),
        name: 'Features & Benefits',
        sectionType: 'features',
        description: 'Detailed product features'
      },
      {
        id: uuidv4(),
        name: 'Pricing',
        sectionType: 'pricing',
        description: 'Pricing options'
      },
      {
        id: uuidv4(),
        name: 'FAQ',
        sectionType: 'faq',
        description: 'Frequently asked questions'
      },
      {
        id: uuidv4(),
        name: 'Footer',
        sectionType: 'footer',
        description: 'Footer with links and contact information'
      }
    ],
    colorScheme: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#f97316',
      background: '#ffffff',
      text: '#1a202c'
    }
  }
};

/**
 * Mock service for creating wireframes from templates
 */
export const createWireframeFromTemplate = async (
  templateId: string, 
  params: WireframeGenerationParams
): Promise<WireframeData> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Select the template
  const template = templates[templateId as keyof typeof templates] || templates['landing-page'];
  
  // Create wireframe from template with custom parameters
  const wireframe: WireframeData = {
    id: uuidv4(),
    title: params.description || template.title,
    description: params.designRequirements || '',
    sections: JSON.parse(JSON.stringify(template.sections)), // Deep copy sections
    colorScheme: {
      ...(template.colorScheme || {}),
      ...(typeof params.colorScheme === 'object' ? params.colorScheme : {})
    }
  };
  
  return wireframe;
};
