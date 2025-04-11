
import { v4 as uuidv4 } from 'uuid';
import { WireframeData } from '../wireframe-types';

/**
 * Create an empty wireframe with default structure
 */
export const createEmptyWireframe = (): WireframeData => {
  return {
    id: uuidv4(),
    title: 'New Wireframe',
    description: 'An empty wireframe',
    sections: [],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#000000'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };
};

/**
 * List of available wireframe templates
 */
export const templates = [
  {
    id: 'business',
    name: 'Business Website',
    description: 'Template for business websites',
    thumbnail: '/thumbnails/business-template.png'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Template for portfolio websites',
    thumbnail: '/thumbnails/portfolio-template.png'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Template for online stores',
    thumbnail: '/thumbnails/ecommerce-template.png'
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Template for landing pages',
    thumbnail: '/thumbnails/landing-template.png'
  }
];

/**
 * Get a wireframe template by ID
 */
export const getTemplateById = (templateId: string) => {
  return templates.find(template => template.id === templateId);
};

/**
 * Get all available templates
 */
export const getAllTemplates = () => {
  return templates;
};

export default {
  createEmptyWireframe,
  getTemplateById,
  getAllTemplates,
  templates
};
