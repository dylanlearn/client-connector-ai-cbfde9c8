
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { ViewMode, DeviceType } from './types';
import { cn } from '@/lib/utils';
import SectionRendererFactory from './renderers/SectionRendererFactory';

interface WireframeSectionRendererProps {
  section: WireframeSection;
  viewMode?: ViewMode;
  darkMode?: boolean;
  deviceType?: DeviceType;
  isSelected?: boolean;
  onClick?: (sectionId: string) => void;
  className?: string;
}

const WireframeSectionRenderer: React.FC<WireframeSectionRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick,
  className
}) => {
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  return (
    <div
      className={cn(
        'wireframe-section w-full',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
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
