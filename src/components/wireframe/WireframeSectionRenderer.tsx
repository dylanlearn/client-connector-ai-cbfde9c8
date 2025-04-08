
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { HeroSection } from './sections/HeroSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { FAQSection } from './sections/FAQSection';
import { CTASection } from './sections/CTASection';
import { PricingSection } from './sections/PricingSection';
import NavigationRenderer from './renderers/NavigationRenderer';
import { FooterSection } from './sections/FooterSection';
import { ContactSection } from './sections/ContactSection';
import { BlogSection } from './sections/BlogSection';
import { NavigationComponentProps } from '@/types/component-library';
import HeroSectionRenderer from './renderers/HeroSectionRenderer';

interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  onSectionClick?: (sectionId: string) => void;
}

export const WireframeSectionRenderer: React.FC<WireframeSectionRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  onSectionClick,
}) => {
  const { id, sectionType, componentVariant } = section;
  const data = section.data || {};
  
  const handleClick = () => {
    if (onSectionClick && id) {
      onSectionClick(id);
    }
  };

  // Render the appropriate component based on section type
  const renderSection = () => {
    switch (sectionType) {
      case 'hero':
        return <HeroSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} />;
        
      case 'testimonial':
        return <TestimonialsSection 
          sectionIndex={0} 
          data={data} 
        />;
        
      case 'feature-grid':
        return <FeaturesSection 
          sectionIndex={0} 
          data={data}
        />;
        
      case 'faq':
        return <FAQSection 
          sectionIndex={0} 
          data={data} 
          viewMode={viewMode}
          darkMode={darkMode}
        />;
        
      case 'cta':
        return <CTASection 
          sectionIndex={0} 
          data={data} 
          viewMode={viewMode}
          darkMode={darkMode}
        />;
        
      case 'navigation':
        return <NavigationRenderer
          variant={componentVariant || 'nav-startup-001'}
          data={data as Partial<NavigationComponentProps>}
          darkMode={darkMode}
        />;
        
      case 'pricing':
        return <PricingSection 
          sectionIndex={0} 
          data={data}
        />;
        
      case 'footer':
        return <FooterSection 
          sectionIndex={0} 
          data={data}
          variant={componentVariant}
        />;
        
      case 'contact':
        return <ContactSection 
          sectionIndex={0} 
          data={data}
          variant={componentVariant}
        />;
        
      case 'blog':
        return <BlogSection 
          sectionIndex={0} 
          data={data}
          variant={componentVariant}
        />;
        
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

  return (
    <div 
      className={`wireframe-section relative ${darkMode ? 'dark' : ''}`}
      onClick={handleClick}
    >
      {renderSection()}
    </div>
  );
};

export default WireframeSectionRenderer;
