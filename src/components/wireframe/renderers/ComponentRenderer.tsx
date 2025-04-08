
import React, { memo } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import HeroSectionRenderer from './HeroSectionRenderer';
import TestimonialSectionRenderer from './TestimonialSectionRenderer';
import FeatureSectionRenderer from './FeatureSectionRenderer';
import FAQSectionRenderer from './FAQSectionRenderer';
import CTASectionRenderer from './CTASectionRenderer';
import NavigationRenderer from './NavigationRenderer';
import PricingSectionRenderer from './PricingSectionRenderer';
import FooterSectionRenderer from './FooterSectionRenderer';
import ContactSectionRenderer from './ContactSectionRenderer';
import BlogSectionRenderer from './BlogSectionRenderer';

interface ComponentRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { sectionType } = section;
  
  // Render different components based on section type
  switch (sectionType) {
    case 'hero':
      return <HeroSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    case 'testimonial':
      return <TestimonialSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    case 'feature':
    case 'feature-grid':
      return <FeatureSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    case 'faq':
      return <FAQSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    case 'cta':
      return <CTASectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    case 'navigation':
      return <NavigationRenderer 
        variant={section.componentVariant || 'nav-startup-001'} 
        viewMode={viewMode} 
        darkMode={darkMode} 
        data={section.data} 
      />;
      
    case 'pricing':
      return <PricingSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    case 'footer':
      return <FooterSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    case 'contact':
      return <ContactSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    case 'blog':
      return <BlogSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
      
    default:
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-center text-gray-500">
            Unknown section type: {sectionType || 'undefined'}
          </p>
        </div>
      );
  }
};

// Use memo to prevent unnecessary re-renders
export default memo(ComponentRenderer);
