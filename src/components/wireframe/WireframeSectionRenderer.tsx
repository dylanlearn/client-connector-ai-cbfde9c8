
import React from 'react';
import { WireframeSectionRendererProps } from './types';
import ComponentRenderer from './renderers/ComponentRenderer';

const WireframeSectionRenderer: React.FC<WireframeSectionRendererProps> = ({ 
  section, 
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  sectionIndex,
  onSectionClick,
  isSelected = false
}) => {
  // Handle section click
  const handleClick = () => {
    if (onSectionClick && section.id) {
      onSectionClick(section.id);
    }
  };
  
  return (
    <div 
      className={`wireframe-section-renderer ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <ComponentRenderer 
        section={section}
        viewMode={viewMode}
        darkMode={darkMode}
        deviceType={deviceType}
        isSelected={isSelected}
        onClick={handleClick}
      />
    </div>
  );
};

export default WireframeSectionRenderer;
