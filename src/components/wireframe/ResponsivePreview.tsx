
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useWireframeStore } from '@/stores/wireframe-store';
import { DEVICE_DIMENSIONS, DeviceType } from './preview/DeviceInfo';
import PreviewHeader from './preview/PreviewHeader';
import PreviewDisplay from './preview/PreviewDisplay';

interface ResponsivePreviewProps {
  className?: string;
  onSectionClick?: (sectionId: string) => void;
}

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({ className, onSectionClick }) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [isRotated, setIsRotated] = useState(false);
  const { darkMode, wireframe } = useWireframeStore();
  
  // Handle device rotation
  const handleRotate = () => {
    setIsRotated(!isRotated);
    
    // Switch between portrait and landscape modes
    if (activeDevice === 'mobile' && !isRotated) {
      setActiveDevice('mobileLandscape');
    } else if (activeDevice === 'mobileLandscape' && isRotated) {
      setActiveDevice('mobile');
    } else if (activeDevice === 'tablet' && !isRotated) {
      setActiveDevice('tabletLandscape');
    } else if (activeDevice === 'tabletLandscape' && isRotated) {
      setActiveDevice('tablet');
    }
  };
  
  // Handle device change
  const handleDeviceChange = (device: DeviceType) => {
    setActiveDevice(device);
    setIsRotated(device === 'mobileLandscape' || device === 'tabletLandscape');
  };
  
  // Get current dimensions
  const currentDimensions = DEVICE_DIMENSIONS[activeDevice];
  
  // Format device dimensions for display
  const formatDimensions = () => {
    const { width, height } = currentDimensions;
    return `${width} × ${height}`;
  };

  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };
  
  // Determine device type for rendering
  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    if (activeDevice.includes('mobile')) return 'mobile';
    if (activeDevice.includes('tablet')) return 'tablet';
    return 'desktop';
  };
  
  return (
    <Card className={cn("shadow-md overflow-hidden", className)}>
      <CardHeader className="p-0">
        <PreviewHeader
          activeDevice={activeDevice}
          isRotated={isRotated}
          onDeviceChange={handleDeviceChange}
          onRotate={handleRotate}
          formatDimensions={formatDimensions}
        />
      </CardHeader>
      
      <CardContent className={cn(
        "flex justify-center p-4 bg-gray-50 dark:bg-gray-900/30 overflow-auto transition-all",
        darkMode ? "dark" : "",
      )}>
        <PreviewDisplay
          currentDimensions={currentDimensions}
          darkMode={darkMode}
          wireframe={wireframe}
          deviceType={getDeviceType()}
          onSectionClick={handleSectionClick}
        />
      </CardContent>
    </Card>
  );
};

export default ResponsivePreview;
