
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

interface SectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="section-name">Section Name</Label>
          <Input
            id="section-name"
            value={section.name || ''}
            onChange={handleNameChange}
            placeholder="Enter section name"
          />
        </div>
        <div className="grid gap-2">
          <Label>Section Type</Label>
          <Input 
            value={section.sectionType || ''} 
            readOnly 
            className="bg-muted text-muted-foreground" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionEditor;
