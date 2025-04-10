
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { ViewMode, DeviceType, WireframeSectionRendererProps } from './types';
import { cn } from '@/lib/utils';
import SectionRendererFactory from './renderers/SectionRendererFactory';

const WireframeSectionRenderer: React.FC<WireframeSectionRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  sectionIndex,
  onSectionClick
}) => {
  const handleClick = () => {
    if (onSectionClick && section.id) {
      onSectionClick(section.id);
    }
  };

  return (
    <div
      className={cn(
        'wireframe-section w-full',
        isSelected && 'ring-2 ring-primary ring-offset-2',
      )}
      data-section-id={section.id}
    >
      <SectionRendererFactory 
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
