
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

// Import all component renderers
import HeroSectionRenderer from '../renderers/HeroSectionRenderer';
import TestimonialSectionRenderer from '../renderers/TestimonialSectionRenderer';
import FeatureSectionRenderer from '../renderers/FeatureSectionRenderer';
import FAQSectionRenderer from '../renderers/FAQSectionRenderer';
import CTASectionRenderer from '../renderers/CTASectionRenderer';
import NavigationRenderer from '../renderers/NavigationRenderer';
import PricingSectionRenderer from '../renderers/PricingSectionRenderer';
import FooterSectionRenderer from '../renderers/FooterSectionRenderer';
import ContactSectionRenderer from '../renderers/ContactSectionRenderer';
import BlogSectionRenderer from '../renderers/BlogSectionRenderer';

// Component mapping
const componentMap: Record<string, React.FC<any>> = {
  'hero': HeroSectionRenderer,
  'testimonial': TestimonialSectionRenderer,
  'feature-grid': FeatureSectionRenderer,
  'faq': FAQSectionRenderer,
  'cta': CTASectionRenderer,
  'navigation': NavigationRenderer,
  'pricing': PricingSectionRenderer,
  'footer': FooterSectionRenderer,
  'contact': ContactSectionRenderer,
  'blog': BlogSectionRenderer
};

/**
 * Get the appropriate component based on section type
 */
export function getSectionComponent(section: WireframeSection): React.FC<any> | null {
  if (!section.sectionType) return null;
  return componentMap[section.sectionType] || null;
}

/**
 * Process section data for rendering
 */
export function processSectionData(section: WireframeSection): any {
  // Default processing - combine data with any processing needed
  return {
    ...(section.data || {}),
    sectionType: section.sectionType,
    componentVariant: section.componentVariant
  };
}
