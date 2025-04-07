
import { WireframeData } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

export const WireframeTemplateService = {
  /**
   * Get templates for a specific industry
   */
  getTemplatesForIndustry: (industry: string): WireframeData => {
    // For now, return a simple template
    return {
      title: `${industry} Website Template`,
      description: `A wireframe template for ${industry} websites`,
      sections: [
        {
          id: uuidv4(),
          name: 'Hero Section',
          sectionType: 'hero',
          components: [
            { id: uuidv4(), type: 'heading', content: `Welcome to our ${industry} service` },
            { id: uuidv4(), type: 'paragraph', content: 'We provide the best solutions for your needs.' }
          ]
        },
        {
          id: uuidv4(),
          name: 'Features Section',
          sectionType: 'features',
          components: [
            { id: uuidv4(), type: 'heading', content: 'Our Features' },
            { id: uuidv4(), type: 'feature-item', content: 'Feature 1' },
            { id: uuidv4(), type: 'feature-item', content: 'Feature 2' }
          ]
        }
      ],
      layoutType: 'standard'
    };
  },
  
  /**
   * Get all available templates
   */
  getAllTemplates: (): WireframeData[] => {
    const industries = ['Technology', 'Healthcare', 'Education', 'E-commerce', 'Finance'];
    return industries.map(industry => WireframeTemplateService.getTemplatesForIndustry(industry));
  }
};
