
import React from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ElementsPanelProps {
  wireframe: WireframeData;
  onAddElement: (sectionId: string, element: any) => void;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ wireframe, onAddElement }) => {
  const availableElements = [
    { type: 'text', name: 'Text Block' },
    { type: 'image', name: 'Image' },
    { type: 'button', name: 'Button' },
    { type: 'input', name: 'Input Field' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Elements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {wireframe.sections.map((section) => (
          <div key={section.id} className="mb-2">
            <h3 className="text-sm font-semibold mb-2">{section.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableElements.map((element) => (
                <Button 
                  key={element.type} 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAddElement(section.id, element)}
                >
                  {element.name}
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        {wireframe.sections.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No sections available. Create a wireframe first.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ElementsPanel;
