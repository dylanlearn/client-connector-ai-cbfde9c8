
import React, { CSSProperties } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeCanvasEnhancedProps {
  sections: WireframeSection[];
  width: number;
  height: number;
  editable: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  responsiveMode?: boolean;
  onSectionClick?: (sectionId: string) => void;
  onSectionChange?: (section: WireframeSection) => void;
  scale?: number; // Add scale as an optional prop
}

export const WireframeCanvasEnhanced: React.FC<WireframeCanvasEnhancedProps> = ({
  sections,
  width,
  height,
  editable,
  showGrid,
  snapToGrid,
  deviceType,
  responsiveMode = false,
  onSectionClick,
  onSectionChange,
  scale = 1 // Default scale to 1 if not provided
}) => {
  // Placeholder implementation - you would want to replace this with your actual implementation
  return (
    <div 
      className="wireframe-canvas relative bg-white"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left'
      }}
    >
      {showGrid && (
        <div className="absolute inset-0 grid-pattern opacity-10" />
      )}
      
      {sections.map((section) => {
        // Define a properly typed style object
        const sectionStyle: CSSProperties = {
          left: `${section.position?.x || 0}px`,
          top: `${section.position?.y || 0}px`,
          width: `${section.dimensions?.width || 300}px`,
          height: `${section.dimensions?.height || 200}px`,
          cursor: editable ? 'pointer' : 'default',
          // These were causing type errors - use proper CSS property types
          textAlign: section.style?.textAlign as "left" | "center" | "right" | "justify" | undefined || 'left',
          padding: section.style?.padding || '16px',
          gap: section.style?.gap || undefined,
          backgroundColor: section.style?.backgroundColor || 'transparent'
        };
        
        return (
          <div
            key={section.id}
            className="absolute border border-dashed border-gray-300 bg-gray-50 p-4"
            style={sectionStyle}
            onClick={() => onSectionClick && onSectionClick(section.id)}
          >
            <div className="font-medium">{section.name}</div>
            <div className="text-sm text-gray-500">{section.sectionType}</div>
            {section.components && section.components.length > 0 && (
              <div className="mt-2 text-xs text-gray-400">
                {section.components.length} component(s)
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
