
import React from 'react';
import { cn } from '@/lib/utils';
import { DeviceType } from './preview/DeviceInfo';

interface WireframeCanvasProps {
  children?: React.ReactNode;
  deviceType?: DeviceType;
  darkMode?: boolean;
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

/**
 * A container component that provides proper device framing for wireframe previews
 */
const WireframeCanvas: React.FC<WireframeCanvasProps> = ({
  children,
  deviceType = 'desktop',
  darkMode = false,
  onSectionClick,
  className
}) => {
  // Device-specific styles
  const deviceStyles = {
    desktop: {
      padding: '1rem',
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
    },
    tablet: {
      padding: '1rem',
      borderRadius: '8px',
      border: darkMode ? '8px solid #333' : '8px solid #ddd',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    mobile: {
      padding: '0.5rem',
      borderRadius: '16px',
      border: darkMode ? '8px solid #333' : '8px solid #ddd',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  };
  
  // Device notch for mobile
  const renderDeviceNotch = () => {
    if (deviceType !== 'mobile') return null;
    
    return (
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none">
        <div className={cn(
          'h-5 w-24 rounded-b-lg',
          darkMode ? 'bg-gray-800' : 'bg-gray-200'
        )}></div>
      </div>
    );
  };
  
  // When a section is clicked, call the parent's onSectionClick handler
  const handleSectionClick = (e: React.MouseEvent) => {
    if (!onSectionClick) return;
    
    // Find the closest section element by looking for data-section-id
    let target: HTMLElement | null = e.target as HTMLElement;
    while (target && (!target.dataset || !target.dataset.sectionId)) {
      target = target.parentElement;
    }
    
    if (target && target.dataset.sectionId) {
      onSectionClick(target.dataset.sectionId);
    }
  };
  
  return (
    <div 
      className={cn(
        'wireframe-canvas relative',
        deviceType,
        darkMode ? 'wireframe-dark' : 'wireframe-light',
        className
      )}
      style={deviceStyles[deviceType] as React.CSSProperties}
      onClick={handleSectionClick}
    >
      {renderDeviceNotch()}
      <div className={cn(
        'wireframe-content h-full overflow-x-hidden overflow-y-auto',
        deviceType === 'mobile' && 'scrollbar-thin'
      )}>
        {children}
      </div>
    </div>
  );
};

export default WireframeCanvas;
