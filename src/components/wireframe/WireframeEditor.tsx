
import React, { useState, useEffect } from 'react';
import { useConsolidatedWireframe } from '@/hooks/use-consolidated-wireframe';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

// Import any other necessary components
import WireframeToolbar from './editor/WireframeToolbar';
import WireframeCanvas from './WireframeCanvas';
import Wireframe from './Wireframe';
import WireframeSidebar from './editor/WireframeSidebar';
import WireframeControls from './editor/WireframeControls';

export interface WireframeEditorProps {
  projectId?: string;
  wireframe?: WireframeData;
  viewMode?: 'edit' | 'preview' | 'code';
  onUpdate?: (wireframe: WireframeData) => void;
  onExport?: (format: string) => void;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({
  projectId,
  wireframe: initialWireframe,
  viewMode: initialViewMode = 'edit',
  onUpdate,
  onExport
}) => {
  // State
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // Use our consolidated wireframe hook
  const {
    wireframe,
    isGenerating,
    isSaving,
    updateWireframe,
    saveWireframe,
    exportWireframe,
    error
  } = useConsolidatedWireframe({
    projectId,
    initialData: initialWireframe,
    autoSave: true,
    showToasts: true,
    onError: (err) => {
      console.error('Wireframe editor error:', err);
    }
  });
  
  // Handle updates to wireframe from external sources
  useEffect(() => {
    if (initialWireframe && initialWireframe !== wireframe) {
      updateWireframe(initialWireframe);
    }
  }, [initialWireframe, updateWireframe, wireframe]);
  
  // Handle manual save
  const handleSave = async () => {
    if (wireframe) {
      const saved = await saveWireframe();
      if (saved && onUpdate) {
        onUpdate(saved);
      }
    } else {
      toast.error('No wireframe to save');
    }
  };
  
  // Handle export
  const handleExport = async (format: string) => {
    const result = await exportWireframe(format);
    if (result && onExport) {
      onExport(format);
    }
  };
  
  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    setSelectedElement(sectionId);
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    );
  }
  
  return (
    <div className="wireframe-editor flex flex-col h-full">
      <WireframeToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSave={handleSave}
        onExport={handleExport}
        isSaving={isSaving}
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex-1 flex">
        {wireframe ? (
          <>
            <div className="flex-1 overflow-auto">
              <WireframeCanvas className="border rounded-md shadow-sm">
                <Wireframe 
                  wireframe={wireframe} 
                  viewMode={viewMode} 
                  onSectionClick={handleSectionClick}
                  activeSection={selectedElement}
                />
              </WireframeCanvas>
            </div>
            
            {showSidebar && viewMode === 'edit' && (
              <WireframeSidebar
                wireframe={wireframe}
                selectedElement={selectedElement}
                onWireframeUpdate={updateWireframe}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {isGenerating ? 'Generating wireframe...' : 'No wireframe data available'}
              </p>
              {!isGenerating && (
                <WireframeControls 
                  projectId={projectId}
                  onWireframeCreated={updateWireframe}
                />
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WireframeEditor;
