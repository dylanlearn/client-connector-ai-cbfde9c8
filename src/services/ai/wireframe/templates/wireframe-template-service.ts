
import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeSection } from '../wireframe-types';

/**
 * Create a minimal empty wireframe with basic structure
 */
export function createEmptyWireframe(): WireframeData {
  return {
    id: uuidv4(),
    title: 'New Wireframe',
    description: 'Start adding sections to your wireframe',
    sections: [],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };
}

/**
 * Create a landing page wireframe template
 */
export function createLandingPageTemplate(): WireframeData {
  return {
    id: uuidv4(),
    title: 'Landing Page Template',
    description: 'A standard landing page with essential sections',
    sections: [
      {
        id: uuidv4(),
        name: 'Navigation',
        sectionType: 'navigation',
        componentVariant: 'horizontal',
        description: 'Main navigation bar'
      },
      {
        id: uuidv4(),
        name: 'Hero',
        sectionType: 'hero',
        componentVariant: 'centered',
        description: 'Hero section with headline and call to action'
      },
      {
        id: uuidv4(),
        name: 'Features',
        sectionType: 'features',
        componentVariant: 'grid',
        description: 'Key product features'
      },
      {
        id: uuidv4(),
        name: 'CTA',
        sectionType: 'cta',
        componentVariant: 'centered',
        description: 'Call to action section'
      },
      {
        id: uuidv4(),
        name: 'Footer',
        sectionType: 'footer',
        componentVariant: 'simple',
        description: 'Page footer with links and copyright'
      }
    ],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };
}

/**
 * Get a specific wireframe template by ID
 */
export function getWireframeTemplate(templateId: string): WireframeData | null {
  // This would normally load templates from a database or API
  // For now, just return the landing page template for any ID
  return createLandingPageTemplate();
}

/**
 * Get a list of all available wireframe templates
 */
export function getAllWireframeTemplates(): WireframeData[] {
  return [
    createLandingPageTemplate(),
    // Add more templates here
  ];
}

export default {
  createEmptyWireframe,
  createLandingPageTemplate,
  getWireframeTemplate,
  getAllWireframeTemplates
};
