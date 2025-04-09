
import React from 'react';
import { WireframeSection } from '@/types/wireframe';
import { WireframeSectionRendererProps } from './types';
import BlogSectionRenderer from './renderers/BlogSectionRenderer';
import CTASectionRenderer from './renderers/CTASectionRenderer';
import ContactSectionRenderer from './renderers/ContactSectionRenderer';
import FAQSectionRenderer from './renderers/FAQSectionRenderer';
import FeatureSectionRenderer from './renderers/FeatureSectionRenderer';
import FooterSectionRenderer from './renderers/FooterSectionRenderer';
import HeroSectionRenderer from './renderers/HeroSectionRenderer';
import NavigationRenderer from './renderers/NavigationRenderer';
import PricingSectionRenderer from './renderers/PricingSectionRenderer';
import TestimonialSectionRenderer from './renderers/TestimonialSectionRenderer';

const WireframeSectionRenderer: React.FC<WireframeSectionRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  sectionIndex,
  onSectionClick,
  isSelected
}) => {
  if (!section) {
    return <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center">Empty section</div>;
  }
  
  const handleSectionClick = () => {
    if (onSectionClick && section.id) {
      onSectionClick(section.id);
    }
  };
  
  // Handle code view for the section
  if (viewMode === 'code') {
    // Display section as code/JSON representation
    return (
      <div className="p-4 bg-gray-900 text-gray-300 rounded font-mono text-xs overflow-auto">
        <pre>{JSON.stringify(section, null, 2)}</pre>
      </div>
    );
  }
  
  // Handle flowchart view for the section
  if (viewMode === 'flowchart') {
    return (
      <div 
        className="p-2 border border-gray-300 dark:border-gray-700 rounded"
        onClick={handleSectionClick}
      >
        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-t text-center font-medium">
          {section.name || `Section: ${section.sectionType}`}
        </div>
        <div className="p-2 text-sm">
          <div>Type: {section.sectionType}</div>
          {section.description && <div className="text-gray-500 dark:text-gray-400">{section.description}</div>}
          {section.components && (
            <div className="mt-2">
              <div className="font-medium">Components ({section.components.length}):</div>
              <ul className="list-disc pl-5">
                {section.components.map((comp, idx) => (
                  <li key={idx}>{comp.type}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Normalize section type for matching
  const sectionType = section.sectionType?.toLowerCase() || '';
  
  // Render the appropriate section component based on the section type
  // Match both exact types and prefixed types (e.g. "pricing" matches "pricing-table")
  if (sectionType === 'hero' || sectionType.startsWith('hero-')) {
    return <HeroSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'features' || sectionType === 'feature' || sectionType.startsWith('feature-')) {
    return <FeatureSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'testimonials' || sectionType === 'testimonial' || sectionType.startsWith('testimonial-')) {
    return <TestimonialSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'pricing' || sectionType === 'pricing-table' || sectionType.startsWith('pricing-')) {
    return <PricingSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'contact' || sectionType.startsWith('contact-')) {
    return <ContactSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'faq' || sectionType.startsWith('faq-')) {
    return <FAQSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'blog' || sectionType.startsWith('blog-')) {
    return <BlogSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'cta' || sectionType === 'cta-banner' || sectionType.startsWith('cta-')) {
    return <CTASectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'footer' || sectionType.startsWith('footer-')) {
    return <FooterSectionRenderer section={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} isSelected={isSelected} onClick={handleSectionClick} />;
  } 
  else if (sectionType === 'navigation' || sectionType === 'nav' || sectionType.startsWith('nav-')) {
    return <NavigationRenderer component={section} viewMode={viewMode} darkMode={darkMode} deviceType={deviceType} />;
  } 
  else {
    // Fallback renderer for unknown section types
    return (
      <div 
        className={`p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={handleSectionClick}
      >
        <div className="font-medium">
          {section.name || `Unknown Section Type: ${section.sectionType || 'Unnamed'}`}
        </div>
        {section.description && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {section.description}
          </div>
        )}
      </div>
    );
  }
};

export default WireframeSectionRenderer;
