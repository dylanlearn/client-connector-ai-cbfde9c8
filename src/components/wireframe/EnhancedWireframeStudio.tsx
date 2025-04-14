
import React, { useState, useCallback } from 'react';
import { DeviceType, ViewMode } from './types';
import StudioToolbar from './studio/StudioToolbar';
import StudioCanvas from './studio/StudioCanvas';
import AISuggestionsPanel from './studio/AISuggestionsPanel';

interface EnhancedWireframeStudioProps {
  projectId: string;
  initialData?: any;
  standalone?: boolean;
  onUpdate?: (wireframe: any) => void;
  onExport?: (format: string) => void;
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({
  projectId,
  initialData,
  standalone = false,
  onUpdate,
  onExport,
}) => {
  const [wireframeData, setWireframeData] = useState(initialData || {
    id: 'new-wireframe',
    title: 'New Wireframe',
    sections: [],
  });
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleDeviceChange = (device: DeviceType) => {
    setDeviceType(device);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const handleAISuggestionsToggle = () => {
    setShowAISuggestions(!showAISuggestions);
  };

  const handleWireframeUpdate = (updatedWireframe: any) => {
    setWireframeData(updatedWireframe);
    if (onUpdate) {
      onUpdate(updatedWireframe);
    }
  };

  const handleExport = useCallback((format: string) => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export behavior when no handler is provided
      console.log(`Export requested in ${format} format`);
      
      // For image export, we can use the browser's capabilities
      if (format === 'png' || format === 'jpg') {
        // This is a simplified version - in real implementation,
        // you'd use a canvas or html2canvas to generate the image
        const wireframeElement = document.querySelector('.wireframe-content');
        if (wireframeElement) {
          // Logic to convert the element to an image would go here
          console.log('Converting wireframe to image...');
        }
      }
    }
  }, [onExport]);

  return (
    <div className="enhanced-wireframe-studio w-full">
      <StudioToolbar
        deviceType={deviceType}
        viewMode={viewMode}
        onDeviceChange={handleDeviceChange}
        onViewModeChange={handleViewModeChange}
        onAISuggestionsToggle={handleAISuggestionsToggle}
        onExport={handleExport}
      />

      <StudioCanvas
        projectId={projectId}
        wireframeData={wireframeData}
        deviceType={deviceType}
        viewMode={viewMode}
        selectedSection={selectedSection}
        onUpdate={handleWireframeUpdate}
        onSectionClick={handleSectionClick}
      />

      {showAISuggestions && (
        <AISuggestionsPanel
          wireframeId={wireframeData.id}
          wireframe={wireframeData}
          focusedSectionId={selectedSection}
          onApplySuggestion={handleWireframeUpdate}
          onClose={handleAISuggestionsToggle}
        />
      )}
    </div>
  );
};

export default EnhancedWireframeStudio;
