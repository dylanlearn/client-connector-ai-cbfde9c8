
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import HeroSectionEditor from './HeroSectionEditor';
import CTASectionEditor from './CTASectionEditor';
import FAQSectionEditor from './FAQSectionEditor';
import TestimonialsSectionEditor from './TestimonialsSectionEditor';
import RichTextEditor from './RichTextEditor';
import PricingSectionEditor from './PricingSectionEditor';
import NavigationSectionEditor from './NavigationSectionEditor';

// Add more section editor imports as they're created

interface SectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const SectionEditorFactory: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  // Normalize section type for matching
  const sectionType = section.sectionType?.toLowerCase() || '';
  
  // Select the appropriate editor based on section type
  // Match both exact types and prefixed types (e.g. "pricing" matches "pricing-table")
  if (sectionType === 'hero' || sectionType.startsWith('hero-')) {
    return <HeroSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'cta' || sectionType === 'cta-banner' || sectionType.startsWith('cta-')) {
    return <CTASectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'faq' || sectionType.startsWith('faq-')) {
    return <FAQSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'testimonials' || sectionType === 'testimonial' || sectionType.startsWith('testimonial-')) {
    return <TestimonialsSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'pricing' || sectionType === 'pricing-table' || sectionType.startsWith('pricing-')) {
    return <PricingSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'navigation' || sectionType === 'nav' || sectionType.startsWith('nav-')) {
    return <NavigationSectionEditor section={section} onUpdate={onUpdate} />;
  }
  // Generic editor for section types without specialized editors
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Basic Content Editor</h2>
      <p className="text-sm text-muted-foreground">
        Specialized editor not available for {section.sectionType || 'unknown'} section type.
        You can edit basic properties below.
      </p>
      
      {section.data && section.data.content && (
        <div className="mt-4">
          <RichTextEditor
            value={section.data.content}
            onChange={(value) => {
              const updatedData = { ...(section.data || {}), content: value };
              onUpdate({ data: updatedData });
            }}
            minHeight="200px"
          />
        </div>
      )}
    </div>
  );
};

export default SectionEditorFactory;
