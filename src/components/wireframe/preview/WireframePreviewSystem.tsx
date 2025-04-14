
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DeviceType, DEVICE_DIMENSIONS, DeviceDimensions } from './DeviceInfo';
import PreviewDisplay from './PreviewDisplay';
import WireframeExportDialog from '../export/WireframeExportDialog';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import DeviceSelector from './DeviceSelector';
import ViewControls from './ViewControls';

interface WireframePreviewSystemProps {
  wireframe: WireframeData;
  onSectionClick?: (sectionId: string) => void;
  onExport?: (format: string) => void;
  projectId?: string;
}

const WireframePreviewSystem: React.FC<WireframePreviewSystemProps> = ({
  wireframe,
  onSectionClick,
  onExport,
  projectId
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  
  // Get current device dimensions
  const currentDimensions: DeviceDimensions = DEVICE_DIMENSIONS[deviceType];
  
  // Handle device type change
  const handleDeviceChange = (newDevice: DeviceType) => {
    setDeviceType(newDevice);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Handle export button click
  const handleExportClick = () => {
    setExportDialogOpen(true);
    
    // If onExport callback is provided, call it
    if (onExport) {
      onExport('dialog-opened');
    }
  };
  
  return (
    <div className="wireframe-preview-system">
      <div className="flex justify-between items-center p-2 border-b">
        <Tabs 
          defaultValue="desktop" 
          value={deviceType}
          onValueChange={(value) => handleDeviceChange(value as DeviceType)}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <DeviceSelector 
              deviceType={deviceType} 
              onChange={handleDeviceChange}
            />
            
            <ViewControls 
              darkMode={darkMode} 
              onToggleDarkMode={toggleDarkMode} 
              onExport={handleExportClick} 
            />
          </div>
        </Tabs>
      </div>
      
      <div id="wireframe-preview-container" className="flex justify-center p-4 bg-muted/30 min-h-[400px]">
        <PreviewDisplay
          currentDimensions={currentDimensions}
          darkMode={darkMode}
          wireframe={wireframe}
          deviceType={deviceType}
          onSectionClick={onSectionClick}
        />
      </div>
      
      <WireframeExportDialog
        wireframe={wireframe}
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
    </div>
  );
};

export default WireframePreviewSystem;
