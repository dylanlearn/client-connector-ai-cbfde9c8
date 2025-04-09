
import React from 'react';
import { WireframeSection } from '@/types/wireframe';
import WireframeSectionRenderer from './WireframeSectionRenderer';
import { WireframeProps } from './types';

const Wireframe: React.FC<WireframeProps> = ({
  wireframe,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  onSectionClick,
  activeSection,
  onSelect,
}) => {
  if (!wireframe || !wireframe.sections || wireframe.sections.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No wireframe data available to display</p>
      </div>
    );
  }

  const handleClick = () => {
    if (onSelect && wireframe.id) {
      onSelect(wireframe.id);
    }
  };

  return (
    <div 
      className={`wireframe ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white'}`}
      style={{ 
        maxWidth: deviceType === 'mobile' ? '375px' : deviceType === 'tablet' ? '768px' : '100%',
        margin: '0 auto'
      }}
      onClick={onSelect ? handleClick : undefined}
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
              sectionIndex={index}
              onSectionClick={onSectionClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wireframe;
