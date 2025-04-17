
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

// Import refactored components
import WireframeToolbar from './editor/WireframeToolbar';
import WireframeCanvas from './editor/WireframeCanvas';
import Wireframe from './Wireframe';
import WireframeSidebar from './editor/WireframeSidebar';
import WireframeControls from './editor/WireframeControls';
import ErrorDisplay from './common/ErrorDisplay';

// Import unified hook
import { useWireframeStudio } from '@/hooks/use-wireframe-studio';

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
  // Use our unified wireframe studio hook
  const {
    wireframe,
    error,
    isGenerating,
    isSaving,
    viewMode,
    showSidebar,
    selectedElement,
    updateWireframe,
    generateWireframe,
    saveWireframe,
    exportWireframe,
    setViewMode,
    toggleSidebar,
    selectElement,
    clearError
  } = useWireframeStudio({
    projectId,
    initialData: initialWireframe,
    viewMode: initialViewMode,  // Changed initialViewMode to viewMode
    autoSave: true,
    showToasts: true,
    componentName: 'WireframeEditor'
  });
  
  // Handle updates from external sources
  useEffect(() => {
    if (initialWireframe && initialWireframe !== wireframe) {
      updateWireframe(initialWireframe);
    }
  }, [initialWireframe, updateWireframe, wireframe]);
  
  // Handle saving
  const handleSave = async () => {
    const saved = await saveWireframe();
    if (saved && onUpdate) {
      onUpdate(saved);
    }
  };
  
  // Handle exporting
  const handleExport = async (format: string) => {
    const result = await exportWireframe(format);
    if (result && onExport) {
      onExport(format);
    }
  };
  
  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    selectElement(sectionId);
  };
  
  // Retry generation if error occurred
  const handleRetry = () => {
    if (initialWireframe) {
      updateWireframe(initialWireframe);
    }
    clearError();
  };
  
  return (
    <div className="wireframe-editor flex flex-col h-full">
      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={handleRetry}
          onClearError={clearError}
          showRetry={true}
        />
      )}
      
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
            <div className="flex-1 overflow-auto p-4">
              <WireframeCanvas viewMode={viewMode}>
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
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="p-8 text-center max-w-md">
              <p className="text-muted-foreground mb-4">
                {isGenerating ? 'Generating wireframe...' : 'No wireframe data available'}
              </p>
              {!isGenerating && (
                <WireframeControls 
                  projectId={projectId}
                  onWireframeCreated={updateWireframe}
                  generateWireframe={generateWireframe}
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
