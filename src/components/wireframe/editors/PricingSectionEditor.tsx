
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PricingSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const PricingSectionEditor: React.FC<PricingSectionEditorProps> = ({ section, onUpdate }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedData = {
      ...(section.data || {}),
      title: e.target.value
    };
    onUpdate({ data: updatedData });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedData = {
      ...(section.data || {}),
      description: e.target.value
    };
    onUpdate({ data: updatedData });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Pricing Section Editor</h2>
      
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={section.data?.title || ''}
          onChange={handleTitleChange}
          placeholder="Enter pricing section title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Section Description</Label>
        <Textarea
          id="description"
          value={section.data?.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Enter pricing section description"
          rows={3}
        />
      </div>
      
      {/* Plans editor would go here - more complex UI */}
      <div className="bg-muted/50 p-4 rounded-md mt-4">
        <p className="text-sm text-muted-foreground">
          This editor supports basic pricing section properties. 
          For advanced pricing plans editing, please use the dedicated pricing plan editor.
        </p>
      </div>
    </div>
  );
};

export default PricingSectionEditor;
