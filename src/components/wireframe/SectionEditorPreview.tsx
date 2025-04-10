
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent } from '@/components/ui/card';
import WireframePreviewSection from './preview/WireframePreviewSection';

interface SectionEditorPreviewProps {
  section: WireframeSection;
  onUpdate: (sectionId: string, updates: Partial<WireframeSection>) => void;
}

const SectionEditorPreview: React.FC<SectionEditorPreviewProps> = ({ section, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-muted/20 rounded-lg p-4 h-[500px] overflow-auto">
        <WireframePreviewSection section={section} darkMode={false} />
      </div>
      
      <div className="h-[500px] overflow-auto">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">About this section</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {section.description || `This is a ${section.sectionType} section.`}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted/50 p-2 rounded">
                  <span className="font-medium">Type:</span> {section.sectionType}
                </div>
                <div className="bg-muted/50 p-2 rounded">
                  <span className="font-medium">Name:</span> {section.name}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">JSON Preview</h3>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[300px]">
                {JSON.stringify(section, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SectionEditorPreview;
