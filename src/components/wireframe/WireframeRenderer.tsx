
import React from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeRendererProps } from './types';
import WireframeSectionRenderer from './WireframeSectionRenderer';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const WireframeRenderer: React.FC<WireframeRendererProps> = ({
  wireframeData,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  onSectionClick,
  activeSection = null
}) => {
  if (!wireframeData || !wireframeData.sections || wireframeData.sections.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg font-medium mb-2">No wireframe data available</div>
        <p className="text-muted-foreground">Please generate a wireframe first</p>
      </div>
    );
  }

  // Apply device-specific styles
  const deviceStyles = {
    desktop: {},
    tablet: { maxWidth: '768px' },
    mobile: { maxWidth: '375px' }
  };

  return (
    <div 
      className={cn(
        "wireframe-renderer", 
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      )}
      style={deviceStyles[deviceType]}
    >
      <div className="wireframe-header p-4 border-b">
        <h1 className="text-xl font-bold">{wireframeData.title}</h1>
        {wireframeData.description && (
          <p className="text-muted-foreground mt-1">{wireframeData.description}</p>
        )}
      </div>
      
      <div className="wireframe-sections">
        {wireframeData.sections.map((section, index) => (
          <React.Fragment key={section.id || `section-${index}`}>
            <div
              className={cn(
                "wireframe-section relative",
                activeSection === section.id && "ring-2 ring-primary"
              )}
            >
              <WireframeSectionRenderer 
                section={section}
                viewMode={viewMode}
                darkMode={darkMode}
                deviceType={deviceType}
                sectionIndex={index}
                onSectionClick={onSectionClick}
                isSelected={activeSection === section.id}
              />
            </div>
            {index < wireframeData.sections.length - 1 && <Separator className="my-2" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WireframeRenderer;
