
import React from 'react';
import StudioToolbar from './studio/StudioToolbar';
import StudioCanvas from './studio/StudioCanvas';
import AISuggestionsPanel from './studio/AISuggestionsPanel';
import { WireframeStudioProvider, useWireframeStudio } from '@/contexts/WireframeStudioContext';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { StudioContentProps } from './types/studio-types';

const StudioContent: React.FC<StudioContentProps> = ({ 
  projectId, 
  onUpdate, 
  onExport 
}) => {
  const { 
    deviceType,
    viewMode,
    showAISuggestions,
    selectedSection,
    wireframeData,
    updateWireframe,
    toggleAISuggestions
  } = useWireframeStudio();

  const handleWireframeUpdate = (updatedWireframe: WireframeData) => {
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

interface EnhancedWireframeStudioProps extends StudioContentProps {
  initialData?: WireframeData;
  standalone?: boolean;
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({
  initialData = {
    id: 'new-wireframe',
    title: 'New Wireframe',
    sections: [],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
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
