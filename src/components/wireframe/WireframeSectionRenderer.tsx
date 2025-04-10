
import React from 'react';
import { WireframeSectionRendererProps } from './types';
import HeroSectionRenderer from './renderers/HeroSectionRenderer';
import FeatureSectionRenderer from './renderers/FeatureSectionRenderer';
import CTASectionRenderer from './renderers/CTASectionRenderer';
import FooterSectionRenderer from './renderers/FooterSectionRenderer';
import TestimonialSectionRenderer from './renderers/TestimonialSectionRenderer';
import NavigationRenderer from './renderers/NavigationRenderer';
import PricingSectionRenderer from './renderers/PricingSectionRenderer';
import FAQSectionRenderer from './renderers/FAQSectionRenderer';
import ContactSectionRenderer from './renderers/ContactSectionRenderer';
import BlogSectionRenderer from './renderers/BlogSectionRenderer';
import { cn } from '@/lib/utils';
import ContainerComponentRenderer from './renderers/specialized/ContainerComponentRenderer';

const WireframeSectionRenderer: React.FC<WireframeSectionRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  sectionIndex,
  onSectionClick,
  isSelected,
}) => {
  const handleClick = () => {
    if (onSectionClick && section.id) {
      onSectionClick(section.id);
    }
  };

  const getSectionRenderer = () => {
    // Normalize section type for matching
    const sectionType = section.sectionType?.toLowerCase() || '';
    
    // Select the appropriate renderer based on section type
    if (sectionType === 'hero' || sectionType.startsWith('hero-')) {
      return <HeroSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    } 
    else if (sectionType === 'features' || sectionType === 'feature' || sectionType.startsWith('feature')) {
      return <FeatureSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    }
    else if (sectionType === 'cta' || sectionType.startsWith('cta-')) {
      return <CTASectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    }
    else if (sectionType === 'footer' || sectionType.startsWith('footer-')) {
      return <FooterSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    }
    else if (sectionType === 'testimonial' || sectionType === 'testimonials' || sectionType.startsWith('testimonial')) {
      return <TestimonialSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    }
    else if (sectionType === 'navigation' || sectionType === 'nav' || sectionType === 'header' || sectionType.startsWith('nav-')) {
      // For navigation, we need to use the section as a component with a variant
      return (
        <NavigationRenderer 
          component={section} 
          variant={section.variant || 'default'} 
          viewMode={viewMode} 
          darkMode={darkMode} 
          deviceType={deviceType} 
        />
      );
    }
    else if (sectionType === 'pricing' || sectionType === 'price' || sectionType.startsWith('price') || sectionType.startsWith('pricing')) {
      return <PricingSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    }
    else if (sectionType === 'faq' || sectionType === 'faqs' || sectionType.startsWith('faq')) {
      return <FAQSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    }
    else if (sectionType === 'contact' || sectionType === 'contactus' || sectionType.startsWith('contact')) {
      return <ContactSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    }
    else if (sectionType === 'blog' || sectionType === 'posts' || sectionType.startsWith('blog')) {
      return <BlogSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleClick} />;
    }
    
    // Default container renderer for unknown section types
    return (
      <ContainerComponentRenderer 
        component={{
          ...section,
          type: 'container',
          id: section.id || `section-${sectionIndex}`,
          style: section.style || {},
          children: section.components || [],
          dimensions: { 
            width: section.dimensions?.width || '100%', 
            height: section.dimensions?.height || 'auto' 
          }
        }}
        darkMode={darkMode}
        interactive={true}
        onClick={handleClick}
        isSelected={isSelected}
        deviceType={deviceType}
      />
    );
  };

  return (
    <div 
      className={cn(
        "wireframe-section relative",
        isSelected && "outline outline-2 outline-primary",
        viewMode === 'flowchart' && "border border-dashed p-2"
      )}
      data-section-id={section.id}
      data-section-type={section.sectionType}
    >
      {getSectionRenderer()}
      
      {/* Show section name in flowchart mode */}
      {viewMode === 'flowchart' && (
        <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 rounded-br">
          {section.name || section.sectionType || 'Section'}
        </div>
      )}
    </div>
  );
};

export default WireframeSectionRenderer;
