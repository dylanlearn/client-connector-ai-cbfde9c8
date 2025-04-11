
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet, Moon, Sun, Download } from 'lucide-react';
import { DeviceType, DEVICE_DIMENSIONS, DeviceDimensions } from './DeviceInfo';
import PreviewDisplay from './PreviewDisplay';
import WireframeExportDialog from '../export/WireframeExportDialog';
import { exportWireframeAsPDF, exportWireframeAsImage, exportWireframeAsHTML } from '@/utils/wireframe/export-utils';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

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
            <TabsList>
              <TabsTrigger value="desktop" className="flex items-center gap-1">
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-1">
                <Tablet className="h-4 w-4" />
                <span className="hidden sm:inline">Tablet</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleDarkMode}
                className="flex items-center gap-1"
              >
                {darkMode ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportClick}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </Tabs>
      </div>
      
      <div className="flex justify-center p-4 bg-muted/30 min-h-[400px]">
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
