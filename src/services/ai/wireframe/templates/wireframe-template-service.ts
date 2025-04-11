
import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeSection } from '../wireframe-types';

/**
 * Create an empty wireframe with basic structure
 */
export const createEmptyWireframe = (name = 'New Wireframe'): WireframeData => {
  return {
    id: uuidv4(),
    title: name,
    description: 'Empty wireframe template',
    sections: [],
    colorScheme: {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };
};

/**
 * Create a blank wireframe with placeholder sections
 */
export const createBlankWireframe = (name = 'Blank Wireframe'): WireframeData => {
  return {
    id: uuidv4(),
    title: name,
    description: 'Blank wireframe template',
    sections: [],
    colorScheme: {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };
};

/**
 * Create a landing page template wireframe
 */
export const createLandingPageTemplate = (): WireframeData => {
  const wireframe: WireframeData = {
    id: uuidv4(),
    title: 'Landing Page Template',
    description: 'A standard landing page template with hero, features, and CTA sections.',
    sections: [
      {
        id: uuidv4(),
        name: 'Hero Section',
        sectionType: 'hero',
        description: 'Main hero section with headline and CTA',
        components: []
      } as WireframeSection,
      {
        id: uuidv4(),
        name: 'Features Section',
        sectionType: 'features',
        description: 'Key features of the product or service',
        components: []
      } as WireframeSection,
      {
        id: uuidv4(),
        name: 'CTA Section',
        sectionType: 'cta',
        description: 'Call to action section',
        components: []
      } as WireframeSection
    ],
    colorScheme: {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };
  
  return wireframe;
};

/**
 * Create a business website template wireframe
 */
export const createBusinessWebsiteTemplate = (): WireframeData => {
  const wireframe: WireframeData = {
    id: uuidv4(),
    title: 'Business Website Template',
    description: 'A professional business website template with key pages.',
    sections: [
      {
        id: uuidv4(),
        name: 'Navigation Bar',
        sectionType: 'navigation',
        description: 'Main navigation bar',
        components: []
      } as WireframeSection,
      {
        id: uuidv4(),
        name: 'Hero Section',
        sectionType: 'hero',
        description: 'Main hero section with headline and image',
        components: []
      } as WireframeSection,
      {
        id: uuidv4(),
        name: 'About Section',
        sectionType: 'content',
        description: 'About the company section',
        components: []
      } as WireframeSection
    ],
    colorScheme: {
      primary: '#2c5282',
      secondary: '#2b6cb0',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: {
      headings: 'Montserrat',
      body: 'Open Sans'
    }
  };
  
  return wireframe;
};

/**
 * Create a portfolio website template wireframe
 */
export const createPortfolioTemplate = (): WireframeData => {
  const wireframe: WireframeData = {
    id: uuidv4(),
    title: 'Portfolio Website Template',
    description: 'A creative portfolio website template for showcasing work.',
    sections: [
      {
        id: uuidv4(),
        name: 'Navigation Bar',
        sectionType: 'navigation',
        description: 'Minimal navigation bar',
        components: []
      } as WireframeSection,
      {
        id: uuidv4(),
        name: 'Showcase Section',
        sectionType: 'gallery',
        description: 'Portfolio showcase section',
        components: []
      } as WireframeSection,
      {
        id: uuidv4(),
        name: 'Contact Section',
        sectionType: 'contact',
        description: 'Contact information section',
        components: []
      } as WireframeSection
    ],
    colorScheme: {
      primary: '#000000',
      secondary: '#718096',
      accent: '#f56565',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: {
      headings: 'Playfair Display',
      body: 'Roboto'
    }
  };
  
  return wireframe;
};

/**
 * Create a wireframe from template name
 */
export const createWireframeFromTemplate = (templateName: string): WireframeData => {
  switch (templateName.toLowerCase()) {
    case 'landing':
      return createLandingPageTemplate();
    case 'business':
      return createBusinessWebsiteTemplate();
    case 'portfolio':
      return createPortfolioTemplate();
    case 'blank':
      return createBlankWireframe();
    default:
      return createEmptyWireframe();
  }
};
