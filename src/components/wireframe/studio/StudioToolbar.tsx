
import React from 'react';
import DeviceControls from './DeviceControls';
import ViewModeControls from './ViewModeControls';
import ActionControls from './ActionControls';
import { useWireframeStudio } from '@/contexts/WireframeStudioContext';

interface StudioToolbarProps {
  onExport: (format: string) => void;
}

const StudioToolbar: React.FC<StudioToolbarProps> = ({
  onExport
}) => {
  const { 
    deviceType, 
    viewMode, 
    setDeviceType, 
    setViewMode, 
    toggleAISuggestions 
  } = useWireframeStudio();

  return (
    <div className="toolbar flex justify-between items-center mb-4">
      <DeviceControls 
        deviceType={deviceType} 
        onDeviceChange={setDeviceType} 
      />
      
      <ViewModeControls 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />
      
      <ActionControls 
        onAISuggestionsToggle={toggleAISuggestions} 
        onExport={onExport} 
      />
    </div>
  );
};

export default StudioToolbar;

