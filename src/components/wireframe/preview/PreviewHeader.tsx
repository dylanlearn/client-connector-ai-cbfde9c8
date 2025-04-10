
import React from 'react';
import { DeviceType } from './DeviceInfo';
import DeviceControls from './DeviceControls';
import { TooltipProvider } from '@/components/ui/tooltip';

interface PreviewHeaderProps {
  activeDevice: DeviceType;
  isRotated: boolean;
  onDeviceChange: (device: DeviceType) => void;
  onRotate: () => void;
  formatDimensions: () => string;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  activeDevice,
  isRotated,
  onDeviceChange,
  onRotate,
  formatDimensions
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-card">
      <h3 className="text-lg font-medium">Device Preview</h3>
      
      <TooltipProvider>
        <DeviceControls 
          activeDevice={activeDevice}
          isRotated={isRotated}
          onDeviceChange={onDeviceChange}
          onRotate={onRotate}
          formatDimensions={formatDimensions}
        />
      </TooltipProvider>
    </div>
  );
};

export default PreviewHeader;
