
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useWireframeStore } from '@/stores/wireframe-store';
import WireframeCanvas from './WireframeCanvas';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Maximize2, Minimize2, RefreshCw, Smartphone, Monitor, Tablet } from 'lucide-react';
import { toast } from 'sonner';

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
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { 
    wireframe, 
    activeDevice, 
    setActiveDevice, 
    activeSection, 
    setActiveSection 
  } = useWireframeStore();
  
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
    toast.success("Preview refreshed");
  }, []);
  
  // Synchronize active section between editor and preview
  const handleSectionClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, [setActiveSection]);

  // If we're not in preview mode, just render the children
  if (!previewMode) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex gap-1">
          <Button 
            variant={activeDevice === 'desktop' ? 'default' : 'outline'} 
            size="sm" 
            className="gap-1"
            onClick={() => setActiveDevice('desktop')}
          >
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Desktop</span>
          </Button>
          <Button 
            variant={activeDevice === 'tablet' ? 'default' : 'outline'} 
            size="sm" 
            className="gap-1"
            onClick={() => setActiveDevice('tablet')}
          >
            <Tablet className="h-4 w-4" />
            <span className="hidden sm:inline">Tablet</span>
          </Button>
          <Button 
            variant={activeDevice === 'mobile' ? 'default' : 'outline'} 
            size="sm" 
            className="gap-1"
            onClick={() => setActiveDevice('mobile')}
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Mobile</span>
          </Button>
        </div>
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
              <div className="flex gap-2 items-center">
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={handleRefreshPreview}
                  className="h-8 w-8"
                  title="Refresh preview"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleToggleMaxPreview}
                >
                  {maxPreview ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <WireframeCanvas 
              key={`preview-${lastUpdate}`}
              className="border rounded-md shadow-sm" 
              onSectionClick={handleSectionClick}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default React.memo(SideBySidePreview);
