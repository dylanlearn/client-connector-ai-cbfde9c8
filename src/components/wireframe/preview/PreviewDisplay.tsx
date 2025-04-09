
import React from 'react';
import { cn } from '@/lib/utils';
import WireframeCanvas from '../WireframeCanvas';
import WireframeSectionRenderer from '../WireframeSectionRenderer';

interface DeviceDimension {
  width: string;
  height: string;
  label: string;
}

interface PreviewDisplayProps {
  currentDimensions: DeviceDimension;
  darkMode: boolean;
  wireframe: any;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  onSectionClick?: (sectionId: string) => void;
}

const PreviewDisplay: React.FC<PreviewDisplayProps> = ({
  currentDimensions,
  darkMode,
  wireframe,
  deviceType,
  onSectionClick
}) => {
  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };
  
  return (
    <div
      className={cn(
        "flex items-center justify-center transition-all duration-300 overflow-hidden", 
        darkMode ? "bg-gray-900" : "bg-white",
        "border rounded-md shadow-sm"
      )}
      style={{
        width: currentDimensions.width,
        height: currentDimensions.height,
        maxHeight: '80vh'
      }}
    >
      <div className="w-full h-full overflow-auto">
        <WireframeCanvas
          className="border-0 shadow-none"
          deviceType={deviceType}
          onSectionClick={handleSectionClick}
        >
          {wireframe && wireframe.sections && (
            <div className="p-4">
              {wireframe.sections.map((section, index) => (
                <div 
                  key={section.id || `section-${index}`} 
                  className="mb-4"
                  onClick={() => onSectionClick && section.id && onSectionClick(section.id)}
                >
                  <WireframeSectionRenderer
                    section={section}
                    viewMode="preview"
                    darkMode={darkMode}
                    deviceType={deviceType}
                    sectionIndex={index}
                    onSectionClick={onSectionClick}
                  />
                </div>
              ))}
            </div>
          )}
        </WireframeCanvas>
      </div>
    </div>
  );
};

export default PreviewDisplay;
