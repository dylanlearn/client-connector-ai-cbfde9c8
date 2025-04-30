
import { WireframeData, WireframeSection } from '@/types/wireframe';
import { v4 as uuidv4 } from 'uuid';
import { IntakeFormData } from '@/types/intake-form';

/**
 * Service for bridging questionnaire data to wireframe data
 */
export const questionnaireWireframeBridge = {
  /**
   * Transform intake form data to wireframe data
   */
  transformIntakeToWireframeParams: (projectData: any, recommendations: any): WireframeData => {
    const { name, projectDescription, keyFeatures } = projectData;
    
    // Convert key features to sections
    const convertedSections: WireframeSection[] = keyFeatures.map((feature: string, index: number) => ({
      id: uuidv4(),
      name: `Feature ${index + 1}`,
      sectionType: 'feature',
      description: feature,
      components: [],
      layout: {
        type: 'flex',
        direction: 'column',
        alignment: 'center'
      },
      positionOrder: index
    }));
    
    return createWireframeData(projectData, recommendations);
  },
  
  /**
   * Get recommended sections based on intake data
   */
  getRecommendedSections: (intakeData: IntakeFormData): string[] => {
    const sections: string[] = [];
    
    if (intakeData.siteType === 'ecommerce') {
      sections.push('hero', 'products', 'contact');
    } else if (intakeData.siteType === 'portfolio') {
      sections.push('hero', 'projects', 'contact');
    } else {
      sections.push('hero', 'features', 'contact');
    }
    
    return sections;
  }
};

const createWireframeData = (projectData: any, recommendations: any): WireframeData => {
  const { name, projectDescription } = projectData;

  return {
    id: uuidv4(), // Add an ID field
    title: name || 'Untitled Wireframe',
    sections: [],
    colorScheme: {
      primary: projectData.primaryColor || '#3b82f6',
      secondary: projectData.secondaryColor || '#10b981',
      accent: projectData.accentColor || '#f59e0b',
      background: projectData.backgroundColor || '#ffffff',
    },
    typography: {
      headings: projectData.headingFont || 'Inter',
      body: projectData.bodyFont || 'Roboto',
    },
    // Add description as a top-level property instead of in designTokens
    status: 'draft',
    description: projectData.description || ''
  };
};
