
import React from 'react';
import WireframeEditorWithGrid from '@/components/wireframe/WireframeEditorWithGrid';

const WireframeEditorDemo: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Wireframe Editor</h1>
        <p className="text-muted-foreground">
          Create wireframes with a configurable grid system and layer management
        </p>
      </header>
      
      <WireframeEditorWithGrid
        width={1200}
        height={800}
        className="min-h-[700px]"
      />
    </div>
  );
};

export default WireframeEditorDemo;
