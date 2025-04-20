
import React, { useState, useEffect, ReactNode } from 'react';
import { DeviceType, DEVICE_DIMENSIONS } from './DeviceInfo';

interface DevicePreviewSystemProps {
  children: ReactNode;
  initialDevice?: DeviceType;
  showControls?: boolean;
  className?: string;
  onDeviceChange?: (device: DeviceType) => void;
}

// Helper function to normalize device type
const normalizeDeviceType = (deviceType: DeviceType): "desktop" | "tablet" | "mobile" => {
  if (deviceType === 'desktop') return 'desktop';
  if (deviceType === 'tablet' || deviceType === 'tabletLandscape') return 'tablet';
  // All mobile variants map to 'mobile'
  return 'mobile';
};

const DevicePreviewSystem: React.FC<DevicePreviewSystemProps> = ({
  children,
  initialDevice = 'desktop',
  showControls = true,
  className = '',
  onDeviceChange
}) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>(initialDevice);
  const [isRotated, setIsRotated] = useState(initialDevice === 'tabletLandscape' || initialDevice === 'mobileLandscape');
  
  // Get current device dimensions
  const deviceDimensions = DEVICE_DIMENSIONS[activeDevice];
  
  // Handle device change
  const handleDeviceChange = (newDevice: DeviceType) => {
    setActiveDevice(newDevice);
    
    // Check if the new device is in landscape mode
    setIsRotated(newDevice === 'tabletLandscape' || newDevice === 'mobileLandscape');
    
    if (onDeviceChange) {
      onDeviceChange(newDevice);
    }
  };
  
  // Handle external device changes
  useEffect(() => {
    if (initialDevice !== activeDevice) {
      setActiveDevice(initialDevice);
      setIsRotated(initialDevice === 'tabletLandscape' || initialDevice === 'mobileLandscape');
    }
  }, [initialDevice, activeDevice]);
  
  return (
    <div className={`device-preview-system ${className}`}>
      <div className="device-viewport"
        style={{
          width: `${deviceDimensions.width}px`,
          height: `${deviceDimensions.height}px`,
          maxWidth: '100%',
          maxHeight: '80vh',
          margin: '0 auto',
          overflow: 'auto',
          transition: 'width 0.3s, height 0.3s'
        }}
      >
        {/* Convert to normalized device type for compatibility */}
        {React.cloneElement(children as React.ReactElement, { 
          deviceType: normalizeDeviceType(activeDevice) 
        })}
      </div>
    </div>
  );
};

export default DevicePreviewSystem;
