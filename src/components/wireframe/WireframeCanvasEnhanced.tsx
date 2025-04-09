
import React, { useRef, useState, useEffect } from 'react';
import { WireframeSection } from '@/types/wireframe';

export interface WireframeCanvasEnhancedProps {
  sections: WireframeSection[];
  width?: number;
  height?: number;
  editable?: boolean;
  showGrid?: boolean;
  snapToGrid?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  responsiveMode?: boolean;
  onSectionSelect?: (sectionId: string) => void;
  onSectionUpdate?: (section: WireframeSection) => void;
  onSectionMove?: (section: WireframeSection, x: number, y: number) => void;
  onSectionResize?: (section: WireframeSection, width: number, height: number) => void;
}

export const WireframeCanvasEnhanced: React.FC<WireframeCanvasEnhancedProps> = ({
  sections,
  width = 1200,
  height = 2000,
  editable = false,
  showGrid = true,
  snapToGrid = true,
  deviceType = 'desktop',
  responsiveMode = false,
  onSectionSelect,
  onSectionUpdate,
  onSectionMove,
  onSectionResize
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Handle section selection
  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent) => {
    if (!editable) return;
    
    e.stopPropagation();
    setSelectedSection(sectionId);
    
    if (onSectionSelect) {
      onSectionSelect(sectionId);
    }
  };

  // Clear selection when clicking canvas
  const handleCanvasClick = () => {
    if (editable) {
      setSelectedSection(null);
    }
  };

  // Render sections
  const renderSections = () => {
    if (!sections || sections.length === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full text-gray-400">
          No sections to display
        </div>
      );
    }

    return sections.map((section) => {
      // Determine section style
      const sectionStyle: React.CSSProperties = {
        position: 'relative',
        marginBottom: '20px',
        border: selectedSection === section.id ? '2px dashed blue' : '1px solid #e5e7eb',
        // Get style properties either from direct props or from style object
        backgroundColor: section.backgroundColor || section.style?.backgroundColor || '#ffffff',
        textAlign: (section.textAlign || section.style?.textAlign || 'left') as any,
        padding: section.padding || section.style?.padding || '20px',
        gap: section.gap || section.style?.gap || '10px',
      };

      // Add specific styles based on section type
      if (section.sectionType === 'hero') {
        sectionStyle.minHeight = '400px';
      } else if (section.sectionType === 'features') {
        sectionStyle.display = 'flex';
        sectionStyle.flexWrap = 'wrap';
        sectionStyle.justifyContent = 'space-between';
      }

      return (
        <div 
          key={section.id}
          className={`wireframe-section wireframe-section-${section.sectionType}`}
          style={sectionStyle}
          onClick={handleSectionClick(section.id)}
        >
          <div className="section-content">
            <h3 className="section-name text-lg font-medium mb-2">{section.name}</h3>
            {section.description && (
              <p className="section-description text-sm text-gray-500">{section.description}</p>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div 
      className="wireframe-canvas-enhanced"
      ref={canvasRef}
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
        backgroundColor: '#f9fafb',
        position: 'relative',
        overflow: 'auto'
      }}
      onClick={handleCanvasClick}
    >
      {showGrid && (
        <div className="wireframe-grid absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />
      )}
      
      <div className={`wireframe-sections ${responsiveMode ? 'responsive' : ''}`}>
        {renderSections()}
      </div>
    </div>
  );
};

export default WireframeCanvasEnhanced;
