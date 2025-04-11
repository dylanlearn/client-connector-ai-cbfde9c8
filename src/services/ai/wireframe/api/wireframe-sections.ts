
import { WireframeSection } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

export const generateHeroSection = (): WireframeSection => ({
  id: uuidv4(),
  name: 'Hero',
  sectionType: 'hero',
  components: [],
  layout: { type: 'flex', direction: 'column' }
});

export const generateFeatureSection = (): WireframeSection => ({
  id: uuidv4(),
  name: 'Features',
  sectionType: 'features',
  components: [],
  layout: { type: 'flex', direction: 'row' }
});

export const generateCTASection = (): WireframeSection => ({
  id: uuidv4(),
  name: 'Call to Action',
  sectionType: 'cta',
  components: [],
  layout: { type: 'flex', direction: 'column' }
});

export const generateTestimonialsSection = (): WireframeSection => ({
  id: uuidv4(),
  name: 'Testimonials',
  sectionType: 'testimonials',
  components: [],
  layout: { type: 'flex', direction: 'row' }
});

export const generatePricingSection = (): WireframeSection => ({
  id: uuidv4(),
  name: 'Pricing',
  sectionType: 'pricing',
  components: [],
  layout: { type: 'flex', direction: 'row' }
});

export const generateFooterSection = (): WireframeSection => ({
  id: uuidv4(),
  name: 'Footer',
  sectionType: 'footer',
  components: [],
  layout: { type: 'flex', direction: 'row' }
});

// Simple implementation of generateSections function
export const generateSections = async (
  description: string,
  options: {
    requestedSections?: string[];
    industry?: string;
    targetAudience?: string;
    enhancedCreativity?: boolean;
  } = {}
): Promise<WireframeSection[]> => {
  const sections: WireframeSection[] = [
    generateHeroSection(),
    generateFeatureSection(),
    generateCTASection()
  ];
  
  // Add additional sections based on description or options
  if (description.includes('testimonial') || options.requestedSections?.includes('testimonials')) {
    sections.push(generateTestimonialsSection());
  }
  
  if (description.includes('price') || description.includes('pricing') || options.requestedSections?.includes('pricing')) {
    sections.push(generatePricingSection());
  }
  
  // Always add a footer
  sections.push(generateFooterSection());
  
  return sections;
};

export const wireframeSections = {
  generateHeroSection,
  generateFeatureSection,
  generateCTASection,
  generateTestimonialsSection,
  generatePricingSection,
  generateFooterSection,
  generateSections
};
