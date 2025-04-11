import React, { useState, useEffect, useRef } from 'react';
import { DeviceType, DEVICE_DIMENSIONS } from './DeviceInfo';
import WireframeCanvas from '../WireframeCanvas';
import Wireframe from '../Wireframe';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Monitor, Tablet, Smartphone, Moon, Sun, Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportWireframeAsHTML, exportWireframeAsImage, exportWireframeAsPDF } from '@/utils/wireframe/export-utils';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';

interface EnhancedWireframePreviewProps {
  wireframe: WireframeData;
  onSectionClick?: (sectionId: string) => void;
  onExport?: (format: string) => void;
  className?: string;
}

/**
 * Enhanced wireframe preview component with device switching, dark mode, and export options
 */
const EnhancedWireframePreview: React.FC<EnhancedWireframePreviewProps> = ({
  wireframe,
  onSectionClick,
  onExport,
  className
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Get current dimensions based on device type and rotation
  const getCurrentDimensions = () => {
    const baseDimensions = DEVICE_DIMENSIONS[deviceType];
    if (isRotated && deviceType !== 'desktop') {
      return {
        width: baseDimensions.height,
        height: baseDimensions.width
      };
    }
    return baseDimensions;
  };
  
  const currentDimensions = getCurrentDimensions();
  
  // Format dimensions for display
  const formatDimensions = () => {
    const { width, height } = currentDimensions;
    return `${width}×${height}`;
  };
  
  // Handle device type change
  const handleDeviceChange = (newDevice: DeviceType) => {
    setDeviceType(newDevice);
    // Reset rotation when changing devices
    setIsRotated(false);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Toggle device rotation
  const handleRotate = () => {
    if (deviceType !== 'desktop') {
      setIsRotated(!isRotated);
    }
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };
  
  // Reset zoom
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  // Export wireframe
  const handleExport = async (format: 'html' | 'pdf' | 'png') => {
    if (!wireframe) return;
    
    try {
      // Show loading toast
      toast({
        title: 'Exporting wireframe...',
        description: `Preparing ${format.toUpperCase()} export`,
      });
      
      // Call onExport callback if provided
      if (onExport) {
        onExport(format);
      }
      
      switch (format) {
        case 'html':
          const htmlContent = await exportWireframeAsHTML(wireframe);
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          saveAs(htmlBlob, `${wireframe.title || 'wireframe'}.html`);
          break;
          
        case 'pdf':
          if (previewRef.current) {
            const pdfBlob = await exportWireframeAsPDF(previewRef.current, wireframe);
            saveAs(pdfBlob, `${wireframe.title || 'wireframe'}.pdf`);
          }
          break;
          
        case 'png':
          if (previewRef.current) {
            const pngBlob = await exportWireframeAsImage(previewRef.current, wireframe);
            saveAs(pngBlob, `${wireframe.title || 'wireframe'}.png`);
          }
          break;
      }
      
      // Show success toast
      toast({
        title: 'Export successful',
        description: `Wireframe exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: `Failed to export as ${format.toUpperCase()}. Please try again.`,
        variant: 'destructive',
      });
    }
  };
  
  // Get device name for display
  const getDeviceName = (deviceType: DeviceType): string => {
    switch (deviceType) {
      case 'desktop': return 'Desktop';
      case 'tablet': return 'Tablet';
      case 'tabletLandscape': return 'Tablet Landscape';
      case 'mobile': return 'Mobile';
      case 'mobileLandscape': return 'Mobile Landscape';
      case 'mobileSm': return 'Small Mobile';
      default: return 'Device';
    }
  };
  
  return (
    <div className={cn('wireframe-preview', className)}>
      <div className="flex flex-col space-y-4">
        {/* Device controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 border rounded-lg bg-card">
          <div className="flex flex-wrap gap-2">
            <Tabs 
              value={deviceType} 
              onValueChange={(value) => handleDeviceChange(value as DeviceType)}
              className="w-full sm:w-auto"
            >
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
            </Tabs>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRotate}
              disabled={deviceType === 'desktop'}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Rotate</span>
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
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
            
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetZoom}
                disabled={zoom === 1}
              >
                {Math.round(zoom * 100)}%
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleZoomIn}
                disabled={zoom >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs defaultValue="html" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="html" onClick={() => handleExport('html')}>
                  HTML
                </TabsTrigger>
                <TabsTrigger value="pdf" onClick={() => handleExport('pdf')}>
                  PDF
                </TabsTrigger>
                <TabsTrigger value="png" onClick={() => handleExport('png')}>
                  PNG
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Device info */}
        <div className="flex justify-between items-center px-4">
          <div className="text-sm text-muted-foreground">
            {getDeviceName(deviceType)} • {formatDimensions()}
          </div>
          <div className="text-sm text-muted-foreground">
            {wireframe.title}
          </div>
        </div>
        
        {/* Preview container */}
        <div className="flex justify-center p-8 bg-muted/30 rounded-lg overflow-auto">
          <div 
            ref={previewRef}
            className="transition-all duration-300"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center'
            }}
          >
            <WireframeCanvas
              deviceType={deviceType === 'desktop' ? 'desktop' : deviceType === 'tablet' || deviceType === 'tabletLandscape' ? 'tablet' : 'mobile'}
              darkMode={darkMode}
              onSectionClick={onSectionClick}
              className="shadow-lg"
            >
              <Wireframe
                wireframe={wireframe}
                viewMode="preview"
                darkMode={darkMode}
                deviceType={deviceType === 'desktop' ? 'desktop' : deviceType === 'tablet' || deviceType === 'tabletLandscape' ? 'tablet' : 'mobile'}
                onSectionClick={onSectionClick}
              />
            </WireframeCanvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWireframePreview;
