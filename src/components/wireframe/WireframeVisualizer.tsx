
import React, { useState } from 'react';
import { WireframeProps } from './types';
import WireframeSectionRenderer from './WireframeSectionRenderer';
import { Separator } from '@/components/ui/separator';

interface WireframeVisualizerProps {
  wireframe: WireframeProps;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
}

export const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  darkMode = false,
  onSectionClick,
  activeSection = null,
}) => {
  if (!wireframe || !wireframe.sections) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg font-medium mb-2">No wireframe data available</div>
        <p className="text-muted-foreground">Please generate a wireframe first</p>
      </div>
    );
  }

  return (
    <div className={`wireframe-visualizer ${darkMode ? 'dark' : ''}`}>
      <div className="wireframe-header p-4 border-b">
        <h1 className="text-xl font-bold">{wireframe.title}</h1>
        {wireframe.description && (
          <p className="text-muted-foreground mt-1">{wireframe.description}</p>
        )}
      </div>
      
      <div className="wireframe-sections">
        {wireframe.sections.map((section, index) => (
          <React.Fragment key={section.id || index}>
            <div
              className={`wireframe-section relative ${
                activeSection === section.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSectionClick && section.id && onSectionClick(section.id)}
            >
              <WireframeSectionRenderer 
                section={section}
                viewMode={viewMode}
                darkMode={darkMode}
                sectionIndex={index}
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
