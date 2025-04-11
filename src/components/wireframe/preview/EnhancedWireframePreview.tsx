
import React, { useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet, Moon, Sun, Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { saveAs } from 'file-saver';
import WireframePreviewSection from './WireframePreviewSection';
import WireframeExportDialog from '../export/WireframeExportDialog';

export interface EnhancedWireframePreviewProps {
  wireframe: WireframeData;
  onExport?: (format: string) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  onSectionClick?: (sectionId: string) => void;
}

const EnhancedWireframePreview: React.FC<EnhancedWireframePreviewProps> = ({
  wireframe,
  onExport,
  containerRef: externalContainerRef,
  onSectionClick
}) => {
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  
  // Create a local ref if an external one is not provided
  const localContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = externalContainerRef || localContainerRef;
  
  const deviceDimensions = {
    desktop: { width: 1200, height: 'auto' },
    tablet: { width: 768, height: 'auto' },
    mobile: { width: 375, height: 'auto' }
  };
  
  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    setDeviceType(device);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format);
    }
  };
  
  const handleZoomIn = () => {
    if (zoom < 2) {
      setZoom(prev => Math.min(prev + 0.1, 2));
    }
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(prev => Math.max(prev - 0.1, 0.5));
    }
  };
  
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  return (
    <div className="enhanced-wireframe-preview">
      <div className="controls flex flex-wrap justify-between items-center p-2 border-b mb-4">
        <Tabs 
          value={deviceType}
          onValueChange={(value) => handleDeviceChange(value as 'desktop' | 'tablet' | 'mobile')}
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
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center gap-1"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetZoom}
            title="Reset Zoom"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowExportDialog(true)}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div
        ref={containerRef}
        className={`wireframe-preview ${darkMode ? 'dark-mode bg-gray-900 text-white' : 'light-mode bg-white text-gray-900'} overflow-auto border rounded-md transition-all`}
        style={{
          width: `${deviceDimensions[deviceType].width}px`,
          maxWidth: '100%',
          margin: '0 auto',
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.3s ease'
        }}
      >
        {wireframe.sections?.map((section, index) => (
          <div key={section.id || index} onClick={() => handleSectionClick(section.id)}>
            <WireframePreviewSection
              section={section}
              darkMode={darkMode}
              deviceType={deviceType}
              className={`mb-4 ${section.backgroundColor ? '' : 'border'}`}
            />
          </div>
        ))}
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
