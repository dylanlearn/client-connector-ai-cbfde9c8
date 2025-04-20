
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { DeviceType, DEVICE_DIMENSIONS, DeviceDimensions } from './DeviceInfo';
import { generateDeviceGuides, Guide } from './alignment-guides';
import { useWireframeStore } from '@/stores/wireframe-store';
import Wireframe from '../Wireframe';

interface PreviewDisplayProps {
  currentDimensions: DeviceDimensions;
  darkMode: boolean;
  wireframe: any; // Using any for now, should be replaced with proper wireframe type
  deviceType: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  showGuides?: boolean;
}

const PreviewDisplay: React.FC<PreviewDisplayProps> = ({
  currentDimensions,
  darkMode,
  wireframe,
  deviceType,
  onSectionClick,
  showGuides = false
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const guidesRef = useRef<HTMLCanvasElement>(null);
  const { activeSection } = useWireframeStore();
  
  // Set up alignment guides
  useEffect(() => {
    if (!guidesRef.current || !showGuides) return;
    
    const canvas = guidesRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = currentDimensions.width;
    canvas.height = currentDimensions.height;
    
    // Generate device-specific guides
    const guides: Guide[] = generateDeviceGuides(
      currentDimensions.width, 
      currentDimensions.height
    );
    
    // Draw guidelines
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    guides.forEach(guide => {
      ctx.beginPath();
      ctx.strokeStyle = guide.color || 'rgba(0, 0, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      
      if (guide.orientation === 'horizontal') {
        ctx.moveTo(0, guide.position);
        ctx.lineTo(canvas.width, guide.position);
      } else {
        ctx.moveTo(guide.position, 0);
        ctx.lineTo(guide.position, canvas.height);
      }
      
      ctx.stroke();
    });
    
  }, [currentDimensions.width, currentDimensions.height, showGuides]);
  
  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };
  
  // Map the device type to the simplified type expected by Wireframe component
  const simplifiedDeviceType = deviceType.replace('Landscape', '') as 'desktop' | 'tablet' | 'mobile';
  
  return (
    <div 
      className={cn(
        "preview-container w-full h-full overflow-auto relative",
        darkMode ? "bg-gray-900" : "bg-white"
      )}
    >
      <div 
        ref={previewRef} 
        className="preview-content relative z-10"
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {wireframe && (
          <Wireframe
            wireframe={wireframe}
            viewMode="preview"
            darkMode={darkMode}
            deviceType={simplifiedDeviceType}
            onSectionClick={handleSectionClick}
            activeSection={activeSection}
          />
        )}
      </div>
      
      {showGuides && (
        <canvas 
          ref={guidesRef}
          className="absolute top-0 left-0 pointer-events-none z-20"
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      )}
      
      {currentDimensions.devicePixelRatio && currentDimensions.devicePixelRatio > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-30">
          @{currentDimensions.devicePixelRatio}x
        </div>
      )}
    </div>
  );
};

export default PreviewDisplay;
