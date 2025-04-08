
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useWireframeStore } from '@/stores/wireframe-store';
import WireframeCanvas from './WireframeCanvas';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Maximize2, Minimize2 } from 'lucide-react';

interface SideBySidePreviewProps {
  children: React.ReactNode;
  previewMode?: boolean;
  togglePreviewMode: () => void;
}

const SideBySidePreview: React.FC<SideBySidePreviewProps> = ({ 
  children, 
  previewMode = false,
  togglePreviewMode
}) => {
  const [maxEditor, setMaxEditor] = useState(false);
  const [maxPreview, setMaxPreview] = useState(false);
  const { wireframe, activeDevice, darkMode } = useWireframeStore();
  
  const handleToggleMaxEditor = () => {
    setMaxEditor(!maxEditor);
    setMaxPreview(false);
  };
  
  const handleToggleMaxPreview = () => {
    setMaxPreview(!maxPreview);
    setMaxEditor(false);
  };

  // If we're not in preview mode, just render the children
  if (!previewMode) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-end mb-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={togglePreviewMode} 
          className="gap-2"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Exit Preview Mode
        </Button>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className={cn(
            "transition-all duration-200",
            { "hidden": maxPreview, "w-full": maxEditor }
          )}
        >
          <div className="h-full p-4 bg-background overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Editor</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleToggleMaxEditor}
              >
                {maxEditor ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
            {children}
          </div>
        </ResizablePanel>
        
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className={cn(
            "transition-all duration-200",
            { "hidden": maxEditor, "w-full": maxPreview }
          )}
        >
          <div className="h-full p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Live Preview</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleToggleMaxPreview}
              >
                {maxPreview ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
            <WireframeCanvas className="border rounded-md shadow-sm" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SideBySidePreview;
