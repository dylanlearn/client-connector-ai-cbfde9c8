
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DeviceType } from '../preview/DeviceInfo';

interface WireframeCanvasProps {
  children: ReactNode;
  className?: string;
  viewMode?: 'edit' | 'preview' | 'code';
  deviceType?: DeviceType;
}

const WireframeCanvas: React.FC<WireframeCanvasProps> = ({
  children,
  className,
  viewMode = 'edit',
  deviceType = 'desktop'
}) => {
  // Calculate canvas width based on device type for preview
  const getCanvasWidth = () => {
    if (viewMode !== 'preview') return '100%';
    
    switch (deviceType) {
      case 'mobile':
      case 'mobileSm':
      case 'mobileLandscape':
        return '375px';
      case 'tablet':
      case 'tabletLandscape':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <div className={cn(
      "wireframe-canvas relative bg-background transition-all duration-300 mx-auto overflow-auto border rounded-md shadow-sm",
      className,
      viewMode === 'edit' && 'p-4',
      viewMode === 'preview' && 'p-0'
    )}
    style={{
      width: getCanvasWidth(),
      maxHeight: 'calc(100vh - 10rem)',
    }}>
      {children}
    </div>
  );
};

export default WireframeCanvas;
