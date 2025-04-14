
import React from 'react';
import { Button } from '@/components/ui/button';

interface EditorHeaderProps {
  title: string;
  onAddSection: () => void;
  onSaveWireframe: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ 
  title, 
  onAddSection, 
  onSaveWireframe 
}) => {
  return (
    <div className="flex justify-between items-center mb-4 p-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onAddSection}>
          Add Section
        </Button>
        <Button onClick={onSaveWireframe}>
          Save Wireframe
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
