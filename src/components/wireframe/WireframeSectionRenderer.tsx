
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import ComponentRenderer from './renderers/ComponentRenderer';
import { WireframeSectionRendererProps } from './types';

const WireframeSectionRenderer: React.FC<WireframeSectionRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  sectionIndex,
  onSectionClick,
}) => {
  const { id } = section;
  
  const handleClick = () => {
    if (onSectionClick && id) {
      onSectionClick(id);
    }
  };

  return (
    <div 
      className={`wireframe-section relative ${darkMode ? 'dark' : ''}`}
      onClick={handleClick}
      data-section-index={sectionIndex}
    >
      <ComponentRenderer 
        section={section}
        viewMode={viewMode}
        darkMode={darkMode}
      />
    </div>
  );
};

export default WireframeSectionRenderer;
