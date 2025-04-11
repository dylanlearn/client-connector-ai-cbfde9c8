
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { SectionComponentProps, ViewMode } from '../types';
import HeroSectionRenderer from './HeroSectionRenderer';
import CTASectionRenderer from './CTASectionRenderer';
import ComponentRenderer from './ComponentRenderer';
import FeaturesSectionRenderer from './FeaturesSectionRenderer';
import TestimonialsSectionRenderer from './TestimonialsSectionRenderer';
import PricingSectionRenderer from './PricingSectionRenderer';
import FooterSectionRenderer from './FooterSectionRenderer';
import FAQSectionRenderer from './FAQSectionRenderer';
import BlogSectionRenderer from './BlogSectionRenderer';
import TestimonialSectionRenderer from './TestimonialSectionRenderer';
import FeatureSectionRenderer from './FeatureSectionRenderer';

/**
 * Factory component that returns the appropriate section renderer
 */
const SectionRendererFactory: React.FC<SectionComponentProps> = (props) => {
  const { section, viewMode, onClick } = props;
  
  // Map ViewMode to ComponentRenderer compatible viewMode
  const mappedViewMode = viewMode === 'edit' || viewMode === 'editor' || viewMode === 'code' 
    ? 'preview' 
    : viewMode;
  
  // Create props with guaranteed values for all required properties
  const adjustedProps = {
    ...props,
    viewMode: mappedViewMode as 'preview' | 'flowchart',
    darkMode: props.darkMode || false, // Ensure darkMode is always provided
    deviceType: props.deviceType || 'desktop', // Ensure deviceType is always provided
    isSelected: props.isSelected || false, // Ensure isSelected is always provided
    onClick: onClick || ((sectionId: string) => {}) // Ensure onClick is always provided with a default no-op function
  };
  
  // Normalize section type to handle variations
  const sectionType = section.sectionType?.toLowerCase() || '';
  
  // Select the renderer based on normalized section type
  if (sectionType === 'hero' || sectionType.startsWith('hero-')) {
    return <HeroSectionRenderer {...props} />;
  }
  
  if (sectionType === 'cta' || sectionType.startsWith('cta-')) {
    return <CTASectionRenderer {...props} />;
  }
  
  if (sectionType === 'features' || sectionType.startsWith('feature-')) {
    return <FeaturesSectionRenderer {...props} />;
  }

  if (sectionType === 'feature' || sectionType === 'single-feature') {
    return <FeatureSectionRenderer {...props} />;
  }
  
  if (sectionType === 'testimonials' || sectionType.startsWith('testimonials-')) {
    return <TestimonialsSectionRenderer {...props} />;
  }

  if (sectionType === 'testimonial' || sectionType.startsWith('testimonial-')) {
    return <TestimonialSectionRenderer {...props} />;
  }
  
  if (sectionType === 'pricing' || sectionType.startsWith('pricing-')) {
    return <PricingSectionRenderer {...props} />;
  }
  
  if (sectionType === 'footer' || sectionType.startsWith('footer-')) {
    return <FooterSectionRenderer {...props} />;
  }

  if (sectionType === 'faq' || sectionType.startsWith('faq-')) {
    return <FAQSectionRenderer {...props} />;
  }

  if (sectionType === 'blog' || sectionType.startsWith('blog-')) {
    return <BlogSectionRenderer {...props} />;
  }
  
  // Fall back to the generic component renderer for any unhandled types
  return <ComponentRenderer {...props} />;
};

export default SectionRendererFactory;
