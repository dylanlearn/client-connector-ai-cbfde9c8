
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import WireframeSectionRenderer from './WireframeSectionRenderer';
import { WireframeProps } from './types';
import { cn } from '@/lib/utils';

const Wireframe: React.FC<WireframeProps> = ({
  wireframe,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  onSectionClick,
  activeSection,
  onSelect,
  className
}) => {
  if (!wireframe || !wireframe.sections) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No wireframe data available</p>
      </div>
    );
  }

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
    
    if (onSelect) {
      onSelect(sectionId);
    }
  };

  const sortedSections = [...wireframe.sections].sort((a, b) => {
    // Sort by position.y if available, otherwise by order in array
    if (a.position && b.position) {
      return a.position.y - b.position.y;
    } else if (a.y !== undefined && b.y !== undefined) {
      return a.y - b.y;
    }
    
    // Fall back to order property if available
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    
    return 0;
  });

  return (
    <div 
      className={cn(
        "wireframe-container",
        darkMode ? 'dark' : '',
        className
      )}
      data-testid="wireframe-container"
      style={{
        width: '100%',
        backgroundColor: darkMode ? 'rgb(17, 24, 39)' : 'white',
        color: darkMode ? 'white' : 'inherit',
      }}
    >
      {sortedSections.map((section: WireframeSection, index: number) => (
        <WireframeSectionRenderer
          key={section.id || `section-${index}`}
          section={section}
          viewMode={viewMode}
          darkMode={darkMode}
          deviceType={deviceType}
          sectionIndex={index}
          onSectionClick={handleSectionClick}
          isSelected={activeSection === section.id}
        />
      ))}
    </div>
  );
};

export default Wireframe;
