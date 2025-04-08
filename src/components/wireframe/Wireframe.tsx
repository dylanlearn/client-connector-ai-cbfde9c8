
import React, { useState } from 'react';
import { WireframeProps as WireframeData } from './types';
import WireframeSectionRenderer from './WireframeSectionRenderer';

interface WireframeComponentProps {
  wireframe: WireframeData;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (id: string) => void;
  activeSection?: string | null;
}

export const Wireframe: React.FC<WireframeComponentProps> = ({
  wireframe,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  onSectionClick,
  activeSection,
}) => {
  if (!wireframe || !wireframe.sections || wireframe.sections.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No wireframe data available to display</p>
      </div>
    );
  }

  return (
    <div 
      className={`wireframe ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white'}`}
      style={{ 
        maxWidth: deviceType === 'mobile' ? '375px' : deviceType === 'tablet' ? '768px' : '100%',
        margin: '0 auto'
      }}
    >
      <div className="wireframe-sections">
        {wireframe.sections.map((section, index) => (
          <div 
            key={section.id || `section-${index}`} 
            className={`mb-0 ${activeSection === section.id ? 'ring-2 ring-primary' : ''}`}
          >
            <WireframeSectionRenderer
              section={section}
              viewMode={viewMode}
              darkMode={darkMode}
              onSectionClick={onSectionClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wireframe;
