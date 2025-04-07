// Fix the typography interface to include fontPairings
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WireframeGenerationParams, WireframeData, WireframeComponent, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { IntakeFormData } from '@/types/intake-form';

interface IntakeData {
  // ... keep existing interface properties
}

interface IntakeWireframeBridgeProps {
  intakeData: any;
  onWireframeParamsReady: (params: WireframeGenerationParams) => void;
}

export const IntakeWireframeBridge: React.FC<IntakeWireframeBridgeProps> = ({
  intakeData,
  onWireframeParamsReady
}) => {
  const [wireframeParams, setWireframeParams] = useState<WireframeGenerationParams | null>(null);
  
  useEffect(() => {
    if (intakeData) {
      const params = transformIntakeToWireframeParams(intakeData);
      setWireframeParams(params);
      onWireframeParamsReady(params);
    }
  }, [intakeData, onWireframeParamsReady]);
  
  const transformIntakeToWireframeParams = (data: any): WireframeGenerationParams => {
    // Create components based on intake data
    const components: WireframeComponent[] = [
      { id: uuidv4(), type: 'header', content: data.companyName || 'Company Name' },
      { id: uuidv4(), type: 'hero', content: data.projectDescription || 'Project Description' }
    ];
    
    // Generate sections based on project type
    const sections: WireframeSection[] = getRecommendedSections(data).map(sectionType => ({
      id: uuidv4(),
      name: sectionNameFromType(sectionType),
      sectionType: sectionType,
      layoutType: sectionLayoutFromType(sectionType),
      layout: {
        type: 'flex',
        alignment: 'center',
      },
      components: components.filter(c => c.type === sectionType),
      copySuggestions: {
        heading: data.keyMessages,
        subheading: data.secondaryMessages,
      },
      description: `${sectionNameFromType(sectionType)} for ${data.companyName}`
    }));
    
    // Create a basic wireframe structure
    const wireframeData: WireframeData = {
      title: data.projectName || 'Untitled Wireframe',
      description: data.projectDescription || 'Generated from intake form data',
      sections,
      layoutType: 'responsive',
      colorScheme: {
        primary: data.primaryColor || '#3b82f6',
        secondary: data.secondaryColor || '#10b981',
        accent: data.accentColor || '#f59e0b',
        background: data.backgroundColor || '#ffffff'
      },
      typography: {
        headings: data.headingFont || 'Inter',
        body: data.bodyFont || 'Roboto',
        fontPairings: data.fontPairings || ['Inter', 'Roboto']
      },
      style: data.designStyle || 'modern'
    };
    
    // Return params for wireframe generation
    return {
      description: data.projectDescription || 'Website wireframe based on intake form data',
      pageType: data.siteType || 'landing-page',
      complexity: 'moderate' as const,
      stylePreferences: data.stylePreferences || ['clean', 'modern'],
      baseWireframe: wireframeData,
      industry: data.industry || 'general'
    };
  };
  
  return null; // This is a logic component, no UI
};

// Helper function to determine section name from type
const sectionNameFromType = (type: string): string => {
  switch (type) {
    case 'hero': return 'Hero Section';
    case 'features': return 'Features Section';
    case 'contact': return 'Contact Form';
    default: return 'Generic Section';
  }
};

// Helper function to determine section layout from type
const sectionLayoutFromType = (type: string): string => {
  switch (type) {
    case 'hero': return 'full-width';
    case 'features': return 'grid';
    case 'contact': return 'form';
    default: return 'standard';
  }
};

/**
 * Get recommended sections based on intake data
 */
export const getRecommendedSections = (intakeData: IntakeFormData): string[] => {
  const sections: string[] = [];
  
  if (intakeData.siteType === 'ecommerce') {
    sections.push('hero', 'products', 'contact');
  } else if (intakeData.siteType === 'portfolio') {
    sections.push('hero', 'projects', 'contact');
  } else {
    sections.push('hero', 'features', 'contact');
  }
  
  return sections;
};
