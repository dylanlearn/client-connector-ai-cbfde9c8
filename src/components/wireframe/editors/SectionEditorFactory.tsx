
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import HeroSectionEditor from './HeroSectionEditor';
import CTASectionEditor from './CTASectionEditor';
import FAQSectionEditor from './FAQSectionEditor';
import RichTextEditor from './RichTextEditor';

// Add more section editor imports as they're created

interface SectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const SectionEditorFactory: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  // Select the appropriate editor based on section type
  switch (section.sectionType) {
    case 'hero':
      return <HeroSectionEditor section={section} onUpdate={onUpdate} />;
      
    case 'cta':
      return <CTASectionEditor section={section} onUpdate={onUpdate} />;
      
    case 'faq':
      return <FAQSectionEditor section={section} onUpdate={onUpdate} />;
      
    // Add more section type cases as editors are implemented
      
    default:
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
  }
};

export default SectionEditorFactory;
