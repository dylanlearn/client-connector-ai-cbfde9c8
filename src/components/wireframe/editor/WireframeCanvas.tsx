
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DeviceType } from '../preview/DeviceInfo';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';
import { useResponsiveStyles } from '@/hooks/use-responsive-styles';

interface WireframeCanvasProps {
  children: ReactNode;
  className?: string;
  viewMode?: 'edit' | 'preview' | 'code';
  deviceType?: DeviceType | 'desktop' | 'tablet' | 'mobile' | 'mobileSm';
  responsive?: boolean;
}

const WireframeCanvas: React.FC<WireframeCanvasProps> = ({
  children,
  className,
  viewMode = 'edit',
  deviceType = 'desktop',
  responsive = true
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

  // Use responsive styles for padding and other properties
  const styles = useResponsiveStyles({
    padding: {
      base: viewMode === 'edit' ? '1rem' : '0',
    },
    maxHeight: {
      base: 'calc(100vh - 10rem)',
      lg: 'calc(100vh - 8rem)'
    }
  });

  return (
    <ResponsiveProvider>
      <div className={cn(
        "wireframe-canvas relative bg-background transition-all duration-300 mx-auto overflow-auto border rounded-md shadow-sm",
        className
      )}
      style={{
        width: getCanvasWidth(),
        ...styles
      }}>
        {children}
      </div>
    </ResponsiveProvider>
  );
};

export default WireframeCanvas;
