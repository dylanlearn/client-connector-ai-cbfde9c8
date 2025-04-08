
import React, { useState } from 'react';
import { WireframeProps, WireframeVisualizerProps } from './types';
import WireframeSectionRenderer from './WireframeSectionRenderer';
import { Separator } from '@/components/ui/separator';

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  darkMode = false,
  onSectionClick,
  activeSection = null,
  deviceType = 'desktop',
  onSelect,
}) => {
  if (!wireframe || !wireframe.sections) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg font-medium mb-2">No wireframe data available</div>
        <p className="text-muted-foreground">Please generate a wireframe first</p>
      </div>
    );
  }

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  const handleWireframeClick = () => {
    if (onSelect && wireframe.id) {
      onSelect(wireframe.id);
    }
  };

  return (
    <div 
      className={`wireframe-visualizer ${darkMode ? 'dark' : ''}`}
      onClick={onSelect ? handleWireframeClick : undefined}
    >
      <div className="wireframe-header p-4 border-b">
        <h1 className="text-xl font-bold">{wireframe.title}</h1>
        {wireframe.description && (
          <p className="text-muted-foreground mt-1">{wireframe.description}</p>
        )}
      </div>
      
      <div 
        className="wireframe-sections"
        style={{ 
          maxWidth: deviceType === 'mobile' ? '375px' : deviceType === 'tablet' ? '768px' : '100%',
          margin: deviceType !== 'desktop' ? '0 auto' : undefined
        }}
      >
        {wireframe.sections.map((section, index) => (
          <React.Fragment key={section.id || index}>
            <div
              className={`wireframe-section relative ${
                activeSection === section.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <WireframeSectionRenderer 
                section={section}
                viewMode={viewMode}
                darkMode={darkMode}
                sectionIndex={index}
                onSectionClick={onSectionClick ? () => handleSectionClick(section.id) : undefined}
              />
            </div>
            {index < wireframe.sections.length - 1 && <Separator className="my-2" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WireframeVisualizer;
