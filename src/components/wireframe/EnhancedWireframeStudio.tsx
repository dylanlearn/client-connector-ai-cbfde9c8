
import React from 'react';
import StudioToolbar from './studio/StudioToolbar';
import StudioCanvas from './studio/StudioCanvas';
import AISuggestionsPanel from './studio/AISuggestionsPanel';
import { WireframeStudioProvider, useWireframeStudio } from '@/contexts/WireframeStudioContext';

interface EnhancedWireframeStudioProps {
  projectId: string;
  initialData?: any;
  standalone?: boolean;
  onUpdate?: (wireframe: any) => void;
  onExport?: (format: string) => void;
}

const StudioContent = ({ 
  projectId, 
  onUpdate, 
  onExport 
}: Omit<EnhancedWireframeStudioProps, 'initialData' | 'standalone'>) => {
  const { 
    deviceType,
    viewMode,
    showAISuggestions,
    selectedSection,
    wireframeData,
    updateWireframe,
    toggleAISuggestions
  } = useWireframeStudio();

  const handleWireframeUpdate = (updatedWireframe: any) => {
    updateWireframe(updatedWireframe);
    if (onUpdate) {
      onUpdate(updatedWireframe);
    }
  };

  return (
    <div className="enhanced-wireframe-studio w-full">
      <StudioToolbar onExport={onExport} />

      <StudioCanvas
        projectId={projectId}
        wireframeData={wireframeData}
        deviceType={deviceType}
        viewMode={viewMode}
        selectedSection={selectedSection}
        onUpdate={handleWireframeUpdate}
      />

      {showAISuggestions && (
        <AISuggestionsPanel
          wireframeId={wireframeData.id}
          wireframe={wireframeData}
          focusedSectionId={selectedSection}
          onApplySuggestion={handleWireframeUpdate}
          onClose={toggleAISuggestions}
        />
      )}
    </div>
  );
};

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({
  initialData = {
    id: 'new-wireframe',
    title: 'New Wireframe',
    sections: [],
  },
  ...props
}) => {
  return (
    <WireframeStudioProvider initialData={initialData}>
      <StudioContent {...props} />
    </WireframeStudioProvider>
  );
};

export default EnhancedWireframeStudio;
