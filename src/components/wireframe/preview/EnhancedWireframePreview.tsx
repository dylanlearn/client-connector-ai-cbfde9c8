
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeviceType } from '../types';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { DEVICE_DIMENSIONS } from './DeviceInfo';
import WireframePreviewSection from './WireframePreviewSection';
import { Download, MonitorSmartphone, Smartphone, Tablet } from 'lucide-react';
import { saveAs } from 'file-saver';
import WireframeExportDialog from '../export/WireframeExportDialog';
import { exportWireframeAsImage } from '@/utils/wireframe/export-utils';

interface EnhancedWireframePreviewProps {
  wireframe: WireframeData;
  darkMode?: boolean;
  onExport?: (format: string) => void;
  className?: string;
}

const EnhancedWireframePreview: React.FC<EnhancedWireframePreviewProps> = ({
  wireframe,
  darkMode = false,
  onExport,
  className
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [zoom, setZoom] = useState<number>(1);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleDeviceChange = (device: DeviceType) => {
    setDeviceType(device);
  };
  
  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.min(Math.max(0.25, newZoom), 2));
  };
  
  // Get device dimensions based on selected device
  const deviceDimensions = DEVICE_DIMENSIONS[deviceType];
  
  // Calculate container style based on device and zoom
  const containerStyle: React.CSSProperties = {
    width: `${deviceDimensions.width * zoom}px`,
    height: `${deviceDimensions.height * zoom}px`,
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: darkMode ? '#1a202c' : '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease'
  };
  
  // Calculate wrapper dimensions to account for scaling
  const wrapperStyle: React.CSSProperties = {
    width: `${deviceDimensions.width * zoom}px`,
    height: `${deviceDimensions.height * zoom}px`,
  };
  
  const handleQuickExport = async () => {
    if (containerRef.current) {
      try {
        const blob = await exportWireframeAsImage(containerRef.current, wireframe);
        saveAs(blob, `${wireframe.title || 'wireframe'}.png`);
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    }
  };
  
  return (
    <div className={`enhanced-wireframe-preview ${className}`}>
      <div className="controls-bar flex items-center justify-between mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="device-selector">
          <Tabs 
            value={deviceType} 
            onValueChange={(v) => handleDeviceChange(v as DeviceType)}
            className="device-tabs"
          >
            <TabsList>
              <TabsTrigger value="desktop" className="flex items-center gap-1">
                <MonitorSmartphone className="h-4 w-4" /> Desktop
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-1">
                <Tablet className="h-4 w-4" /> Tablet
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" /> Mobile
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="tools flex items-center gap-2">
          <div className="zoom-controls flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleZoomChange(zoom - 0.25)}
              disabled={zoom <= 0.25}
            >
              -
            </Button>
            <span className="text-sm font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleZoomChange(zoom + 0.25)}
              disabled={zoom >= 2}
            >
              +
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleQuickExport}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowExportDialog(true)}
          >
            More Options
          </Button>
        </div>
      </div>
      
      <div className="preview-device-info text-sm text-gray-500 mb-2">
        {deviceDimensions.name} - {deviceDimensions.width}x{deviceDimensions.height}px
      </div>
      
      <div className="preview-wrapper" style={wrapperStyle}>
        <div 
          ref={containerRef}
          className="preview-container" 
          style={containerStyle}
        >
          <div className="wireframe-content">
            {wireframe && wireframe.sections && wireframe.sections.map((section, index) => (
              <WireframePreviewSection 
                key={section.id || `section-${index}`}
                section={section}
                darkMode={darkMode}
                deviceType={
                  deviceType === 'mobile' || deviceType === 'mobileLandscape' || deviceType === 'mobileSm' ? 'mobile' : 
                  deviceType === 'tablet' || deviceType === 'tabletLandscape' ? 'tablet' : 
                  'desktop'
                }
              />
            ))}
          </div>
        </div>
      </div>
      
      <WireframeExportDialog 
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        wireframe={wireframe}
        containerRef={containerRef}
      />
    </div>
  );
};

export default EnhancedWireframePreview;
