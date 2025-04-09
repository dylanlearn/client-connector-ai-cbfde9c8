
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import WireframeCanvas from '../WireframeCanvas';
import Wireframe from '../Wireframe';
import { DeviceType, DEVICE_DIMENSIONS, DeviceDimensions } from './DeviceInfo';

interface PreviewDisplayProps {
  currentDimensions: DeviceDimensions;
  darkMode: boolean;
  wireframe: any; // Using any for now, should be replaced with proper wireframe type
  deviceType: DeviceType;
  onSectionClick?: (sectionId: string) => void;
}

const PreviewDisplay: React.FC<PreviewDisplayProps> = ({
  currentDimensions,
  darkMode,
  wireframe,
  deviceType,
  onSectionClick
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optionally add device-specific behaviors here
    // For example, mobile-specific touch events
  }, [deviceType]);

  return (
    <div 
      ref={previewRef}
      className={cn(
        "preview-container transition-all duration-300 overflow-hidden border rounded-lg",
        darkMode ? "bg-gray-900" : "bg-white"
      )}
      style={{
        width: `${currentDimensions.width}px`,
        height: `${currentDimensions.height}px`,
        maxHeight: '80vh'
      }}
    >
      <WireframeCanvas
        deviceType={deviceType}
        darkMode={darkMode}
        onSectionClick={onSectionClick}
      >
        {wireframe && (
          <Wireframe
            wireframe={wireframe}
            viewMode="preview"
            darkMode={darkMode}
            deviceType={deviceType}
            onSectionClick={onSectionClick}
          />
        )}
      </WireframeCanvas>
    </div>
  );
};

export default PreviewDisplay;
