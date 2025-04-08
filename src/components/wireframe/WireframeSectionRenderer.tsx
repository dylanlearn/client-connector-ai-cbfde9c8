
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import ComponentRenderer from './renderers/ComponentRenderer';

interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  onSectionClick?: (sectionId: string) => void;
}

export const WireframeSectionRenderer: React.FC<WireframeSectionRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
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
