
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { PricingSection } from '../sections/PricingSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { FeaturesSection } from '../sections/FeaturesSection';

/**
 * Maps section types to their corresponding component renderers
 */
export const sectionTypeToComponent: Record<string, React.ComponentType<any>> = {
  'pricing': PricingSection,
  'testimonial': TestimonialsSection,
  'feature-grid': FeaturesSection,
  // Add other section types as needed
};

/**
 * Determines the appropriate component for a wireframe section
 */
export const getSectionComponent = (section: WireframeSection) => {
  if (!section?.sectionType) {
    return null;
  }
  
  return sectionTypeToComponent[section.sectionType] || null;
};

/**
 * Processes section data to ensure it's correctly formatted for the component
 */
export const processSectionData = (section: WireframeSection) => {
  // Process based on section type
  switch (section.sectionType) {
    case 'pricing':
      return {
        ...section,
        // Transform any section-specific data needed here
      };
    case 'testimonial':
      return {
        ...section,
        // Transform any section-specific data needed here
      };
    case 'feature-grid':
      return {
        ...section,
        // Transform any section-specific data needed here
      };
    default:
      return section;
  }
};
