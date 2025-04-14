
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

interface SectionsListProps {
  sections: WireframeSection[];
}

const SectionsList: React.FC<SectionsListProps> = ({ sections }) => {
  if (sections.length === 0) {
    return (
      <div className="text-center py-8 border rounded bg-muted/10">
        <p className="text-muted-foreground">No sections yet. Add a new section to get started.</p>
      </div>
    );
  }

  return (
    <div className="wireframe-sections p-4 space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="border p-4 rounded">
          <h3 className="font-medium">{section.name}</h3>
          <p className="text-sm text-muted-foreground">{section.description || 'No description'}</p>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {section.sectionType}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionsList;
