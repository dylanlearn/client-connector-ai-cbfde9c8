
import React from 'react';
import DeviceControls from './DeviceControls';
import ViewModeControls from './ViewModeControls';
import ActionControls from './ActionControls';
import { DeviceType, ViewMode } from '../types';

interface StudioToolbarProps {
  deviceType: DeviceType;
  viewMode: ViewMode;
  onDeviceChange: (device: DeviceType) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onAISuggestionsToggle: () => void;
  onExport: (format: string) => void;
}

const StudioToolbar: React.FC<StudioToolbarProps> = ({
  deviceType,
  viewMode,
  onDeviceChange,
  onViewModeChange,
  onAISuggestionsToggle,
  onExport
}) => {
  return (
    <div className="toolbar flex justify-between items-center mb-4">
      <DeviceControls 
        deviceType={deviceType} 
        onDeviceChange={onDeviceChange} 
      />
      
      <ViewModeControls 
        viewMode={viewMode} 
        onViewModeChange={onViewModeChange} 
      />
      
      <ActionControls 
        onAISuggestionsToggle={onAISuggestionsToggle} 
        onExport={onExport} 
      />
    </div>
  );
};

export default StudioToolbar;
