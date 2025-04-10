
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import HeroSectionEditor from './HeroSectionEditor';
import CTASectionEditor from './CTASectionEditor';
import FAQSectionEditor from './FAQSectionEditor';
import TestimonialsSectionEditor from './TestimonialsSectionEditor';
import RichTextEditor from './RichTextEditor';
import PricingSectionEditor from './PricingSectionEditor';
import NavigationSectionEditor from './NavigationSectionEditor';
import FeaturesSectionEditor from './FeaturesSectionEditor';
import FooterSectionEditor from './FooterSectionEditor';
import GallerySectionEditor from './GallerySectionEditor';
import ContactSectionEditor from './ContactSectionEditor';
import TeamSectionEditor from './TeamSectionEditor';
import StatsSectionEditor from './StatsSectionEditor';
import BlogSectionEditor from './BlogSectionEditor';
import CardsSectionEditor from './CardsSectionEditor';

interface SectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

/**
 * Factory component that renders the appropriate section editor based on section type
 */
const SectionEditorFactory: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  // Normalize section type for matching
  const sectionType = section.sectionType?.toLowerCase() || section.type?.toLowerCase() || '';
  
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
  else if (sectionType === 'navigation' || sectionType === 'nav' || sectionType === 'header' || sectionType.startsWith('nav-')) {
    return <NavigationSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'features' || sectionType === 'feature' || sectionType.startsWith('feature-')) {
    return <FeaturesSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'footer' || sectionType.startsWith('footer-')) {
    return <FooterSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'gallery' || sectionType.startsWith('gallery-') || sectionType === 'portfolio') {
    return <GallerySectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'contact' || sectionType === 'form' || sectionType.startsWith('contact-')) {
    return <ContactSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'team' || sectionType === 'about' || sectionType.startsWith('team-')) {
    return <TeamSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'stats' || sectionType === 'statistics' || sectionType.startsWith('stat-')) {
    return <StatsSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'blog' || sectionType === 'articles' || sectionType.startsWith('blog-')) {
    return <BlogSectionEditor section={section} onUpdate={onUpdate} />;
  }
  else if (sectionType === 'cards' || sectionType === 'card-grid' || sectionType.startsWith('card-')) {
    return <CardsSectionEditor section={section} onUpdate={onUpdate} />;
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
