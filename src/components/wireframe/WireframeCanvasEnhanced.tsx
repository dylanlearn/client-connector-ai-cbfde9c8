
import React, { useRef, useEffect, useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { CSSProperties } from 'react';

export interface WireframeCanvasEnhancedProps {
  sections: WireframeSection[];
  width: number;
  height: number;
  editable: boolean;
  showGrid: boolean;
  snapToGrid?: boolean;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  responsiveMode?: boolean;
  onSectionSelect?: (section: WireframeSection) => void;
  onSectionMove?: (section: WireframeSection, x: number, y: number) => void;
  onSectionResize?: (section: WireframeSection, width: number, height: number) => void;
}

export const WireframeCanvasEnhanced: React.FC<WireframeCanvasEnhancedProps> = ({
  sections,
  width,
  height,
  editable = false,
  showGrid = true,
  snapToGrid = false,
  deviceType = 'desktop',
  responsiveMode = false,
  onSectionSelect,
  onSectionMove,
  onSectionResize
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  // Grid settings
  const gridSize = 10;
  const gridColor = 'rgba(200, 200, 200, 0.15)';
  const gridColorDarker = 'rgba(200, 200, 200, 0.3)';
  
  useEffect(() => {
    if (!editable) return;
    
    const handleClick = (e: MouseEvent) => {
      // Deselect if clicking on canvas background
      if (e.target === canvasRef.current) {
        setSelectedSection(null);
      }
    };
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [editable]);
  
  const handleSectionClick = (e: React.MouseEvent, section: WireframeSection) => {
    if (!editable) return;
    
    e.stopPropagation();
    setSelectedSection(section.id);
    if (onSectionSelect) {
      onSectionSelect(section);
    }
  };
  
  const renderSection = (section: WireframeSection) => {
    const isSelected = selectedSection === section.id;
    
    // Apply any responsive adjustments based on device type if in responsive mode
    const position = section.position || { x: 0, y: 0 };
    const dimensions = section.dimensions || { width: 100, height: 100 };
    
    const sectionStyle: CSSProperties = {
      backgroundColor: section.backgroundColor || '#ffffff',
      textAlign: section.textAlign as "left" | "center" | "right" | "justify" | undefined, // Fix typing issue
      padding: section.padding || '0',
      gap: section.gap || '0',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      cursor: editable ? 'pointer' : 'default',
    };
    
    return (
      <div
        key={section.id}
        className={`absolute border ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
        style={sectionStyle}
        onClick={(e) => handleSectionClick(e, section)}
      >
        <div className="text-xs border-b p-1 bg-gray-50">
          {section.name || section.sectionType || 'Section'}
        </div>
        <div className="p-2">
          {section.components && section.components.length > 0 ? (
            <div className="text-xs text-gray-500">
              {section.components.length} component(s)
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic">Empty section</div>
          )}
        </div>
      </div>
    );
  };
  
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const horizontalLines = [];
    const verticalLines = [];
    
    // Create horizontal grid lines
    for (let i = 0; i <= height; i += gridSize) {
      const isMajor = i % (gridSize * 10) === 0;
      horizontalLines.push(
        <div 
          key={`h-${i}`} 
          className="absolute left-0 right-0"
          style={{
            top: `${i}px`,
            height: '1px',
            backgroundColor: isMajor ? gridColorDarker : gridColor
          }}
        />
      );
    }
    
    // Create vertical grid lines
    for (let i = 0; i <= width; i += gridSize) {
      const isMajor = i % (gridSize * 10) === 0;
      verticalLines.push(
        <div 
          key={`v-${i}`} 
          className="absolute top-0 bottom-0"
          style={{
            left: `${i}px`,
            width: '1px',
            backgroundColor: isMajor ? gridColorDarker : gridColor
          }}
        />
      );
    }
    
    return (
      <>
        {horizontalLines}
        {verticalLines}
      </>
    );
  };

  return (
    <div 
      ref={canvasRef}
      className="relative bg-white"
      style={{ width: `${width}px`, height: `${height}px`, overflow: 'hidden' }}
    >
      {showGrid && renderGrid()}
      {sections.map(renderSection)}
    </div>
  );
};

export default WireframeCanvasEnhanced;
