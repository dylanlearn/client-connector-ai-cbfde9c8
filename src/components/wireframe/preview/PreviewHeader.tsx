
import React from 'react';
import { DeviceType } from './DeviceInfo';
import DeviceControls from './DeviceControls';
import ViewControls from './ViewControls';
import { Separator } from '@/components/ui/separator';

interface PreviewHeaderProps {
  activeDevice: DeviceType;
  isRotated: boolean;
  darkMode: boolean;
  onDeviceChange: (device: DeviceType) => void;
  onRotate: () => void;
  onToggleDarkMode: () => void;
  formatDimensions: () => string;
  onExport?: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  activeDevice,
  isRotated,
  darkMode,
  onDeviceChange,
  onRotate,
  onToggleDarkMode,
  formatDimensions,
  onExport
}) => {
  return (
    <div className="preview-header">
      <div className="flex justify-between items-center p-2 border-b">
        <DeviceControls
          activeDevice={activeDevice}
          isRotated={isRotated}
          onDeviceChange={onDeviceChange}
          onRotate={onRotate}
          formatDimensions={formatDimensions}
        />
        
        <ViewControls
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onExport={onExport}
        />
      </div>
      <Separator />
    </div>
  );
};

export default PreviewHeader;
