
import React, { useState, useCallback, useEffect } from 'react';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionEditorFactory from './editors/SectionEditorFactory';
import ComponentRenderer from './renderers/ComponentRenderer';

interface SectionEditorPreviewProps {
  section: WireframeSection;
  onUpdate: (sectionId: string, updates: Partial<WireframeSection>) => void;
  className?: string;
}

const SectionEditorPreview: React.FC<SectionEditorPreviewProps> = ({
  section,
  onUpdate,
  className
}) => {
  const [maxEditor, setMaxEditor] = useState(false);
  const [maxPreview, setMaxPreview] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { darkMode, activeDevice } = useWireframeStore();
  
  // Handle section updates and trigger preview refresh
  const handleSectionUpdate = useCallback((updates: Partial<WireframeSection>) => {
    onUpdate(section.id, updates);
    setLastUpdate(Date.now());
  }, [onUpdate, section.id]);
  
  // Toggle view modes
  const handleToggleMaxEditor = useCallback(() => {
    setMaxEditor(!maxEditor);
    setMaxPreview(false);
  }, [maxEditor]);
  
  const handleToggleMaxPreview = useCallback(() => {
    setMaxPreview(!maxPreview);
    setMaxEditor(false);
  }, [maxPreview]);
  
  // Force preview refresh
  const handleRefreshPreview = useCallback(() => {
    setLastUpdate(Date.now());
  }, []);

  return (
    <div className={cn("section-editor-preview", className)}>
      <ResizablePanelGroup direction="horizontal" className="min-h-[400px] rounded-lg border">
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
              <h3 className="text-lg font-medium">Edit {section.name}</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleToggleMaxEditor}
              >
                {maxEditor ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
            <SectionEditorFactory 
              section={section}
              onUpdate={handleSectionUpdate}
            />
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
          <div className="h-full p-4 bg-background overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Preview</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleToggleMaxPreview}
              >
                {maxPreview ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
            <div 
              className={cn(
                "border rounded-md p-4",
                {
                  "max-w-7xl mx-auto": activeDevice === 'desktop',
                  "max-w-3xl mx-auto": activeDevice === 'tablet',
                  "max-w-xs mx-auto": activeDevice === 'mobile'
                }
              )}
            >
              <ComponentRenderer 
                key={`preview-${lastUpdate}`}
                section={section}
                viewMode="preview" 
                darkMode={darkMode}
                deviceType={activeDevice || 'desktop'} // Add the required deviceType prop
                isSelected={false} // Add the required isSelected prop
                onClick={() => {}} // Add the required onClick prop
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default React.memo(SectionEditorPreview);
