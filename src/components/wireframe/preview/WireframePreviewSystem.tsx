
import React, { useState, useCallback, useEffect } from 'react';
import { DeviceType, DEVICE_DIMENSIONS, DeviceDimensions, rotateDevice, formatDimensions } from './DeviceInfo';
import PreviewHeader from './PreviewHeader';
import PreviewDisplay from './PreviewDisplay';
import WireframeExportDialog from '../export/WireframeExportDialog';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import DevicePreviewSystem from './DevicePreviewSystem';
import { useToast } from '@/hooks/use-toast';

interface WireframePreviewSystemProps {
  wireframe: WireframeData;
  onSectionClick?: (sectionId: string) => void;
  onExport?: (format: string) => void;
  projectId?: string;
  viewMode?: string;
}

const WireframePreviewSystem: React.FC<WireframePreviewSystemProps> = ({
  wireframe,
  onSectionClick,
  onExport,
  projectId,
  viewMode = 'preview'
}) => {
  const { toast } = useToast();
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  
  // Get current device dimensions
  const currentDimensions: DeviceDimensions = DEVICE_DIMENSIONS[deviceType];
  
  // Handle device type change
  const handleDeviceChange = useCallback((newDevice: DeviceType) => {
    setDeviceType(newDevice);
    setIsRotated(['mobileLandscape', 'tabletLandscape'].includes(newDevice));
    
    toast({
      title: `Device changed to ${DEVICE_DIMENSIONS[newDevice].name}`,
      description: formatDimensions(DEVICE_DIMENSIONS[newDevice]),
      duration: 2000
    });
  }, [toast]);
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);
  
  // Handle rotate device
  const handleRotateDevice = useCallback(() => {
    if (deviceType === 'desktop') return;
    
    const rotatedDevice = rotateDevice(deviceType);
    setDeviceType(rotatedDevice);
    setIsRotated(!isRotated);
    
    toast({
      title: `Device rotated to ${DEVICE_DIMENSIONS[rotatedDevice].name}`,
      description: formatDimensions(DEVICE_DIMENSIONS[rotatedDevice]),
      duration: 2000
    });
  }, [deviceType, isRotated, toast]);
  
  // Handle export button click
  const handleExportClick = useCallback(() => {
    setExportDialogOpen(true);
    
    // If onExport callback is provided, call it
    if (onExport) {
      onExport('dialog-opened');
    }
  }, [onExport]);
  
  // Format dimensions for display
  const formatDeviceDimensions = useCallback(() => {
    return `${currentDimensions.name} (${currentDimensions.width}×${currentDimensions.height})`;
  }, [currentDimensions]);
  
  return (
    <div className="wireframe-preview-system flex flex-col h-full">
      <PreviewHeader
        activeDevice={deviceType}
        isRotated={isRotated}
        darkMode={darkMode}
        onDeviceChange={handleDeviceChange}
        onRotate={handleRotateDevice}
        onToggleDarkMode={toggleDarkMode}
        formatDimensions={formatDeviceDimensions}
        onExport={handleExportClick}
      />
      
      <div className="flex-1 overflow-hidden">
        <DevicePreviewSystem 
          initialDevice={deviceType}
          showControls={false}
          className="h-full"
          onDeviceChange={handleDeviceChange}
        >
          <PreviewDisplay
            currentDimensions={currentDimensions}
            darkMode={darkMode}
            wireframe={wireframe}
            deviceType={deviceType}
            onSectionClick={onSectionClick}
          />
        </DevicePreviewSystem>
      </div>
      
      <WireframeExportDialog
        wireframe={wireframe}
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        projectId={projectId}
      />
    </div>
  );
};

export default WireframePreviewSystem;
