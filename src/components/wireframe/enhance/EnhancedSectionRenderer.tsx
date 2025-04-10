
import React from 'react';
import { WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { ComponentRendererFactory } from '../renderers/ComponentRendererFactory';

export interface EnhancedSectionRendererProps {
  section: WireframeSection;
  viewMode: 'preview' | 'code' | 'flowchart';
  darkMode: boolean;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  interactive?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onComponentClick?: (componentId: string) => void;
}

/**
 * Enhanced section renderer that uses specialized component renderers
 */
const EnhancedSectionRenderer: React.FC<EnhancedSectionRendererProps> = ({
  section,
  viewMode,
  darkMode,
  deviceType,
  interactive = true,
  isSelected = false,
  onClick,
  onComponentClick,
}) => {
  // Handle section click
  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  // If in code view mode, render JSON representation
  if (viewMode === 'code') {
    return (
      <div className="p-4 bg-gray-900 text-gray-300 rounded font-mono text-xs overflow-auto">
        <pre>{JSON.stringify(section, null, 2)}</pre>
      </div>
    );
  }

  // If in flowchart view, render a simplified structural view
  if (viewMode === 'flowchart') {
    return (
      <div 
        className={cn(
          "p-2 border rounded",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-100",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={handleClick}
      >
        <div className={cn(
          "p-2 rounded-t text-center font-medium",
          darkMode ? "bg-blue-900" : "bg-blue-100"
        )}>
          {section.name || `Section: ${section.sectionType}`}
        </div>
        <div className="p-2 text-sm">
          <div>Type: {section.sectionType}</div>
          {section.description && (
            <div className={cn(
              "text-xs",
              darkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {section.description}
            </div>
          )}
          {section.components && (
            <div className="mt-2">
              <div className="font-medium">Components ({section.components.length}):</div>
              <ul className="list-disc pl-5">
                {section.components.map((comp, idx) => (
                  <li key={idx}>{comp.type}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get layout information
  const sectionLayout = section.layout || { type: 'flex', direction: 'column' };
  const layoutType = typeof sectionLayout === 'string' ? sectionLayout : sectionLayout.type;

  // Section style configuration
  const sectionStyle = {
    backgroundColor: section.backgroundColor || (darkMode ? '#1f2937' : '#f9fafb'),
    padding: section.style?.padding || '1rem',
    minHeight: section.dimensions?.height || (section.height || '200px'),
    width: section.dimensions?.width || (section.width || '100%'),
    display: 'flex',
    flexDirection: 'column' as const,
    gap: section.style?.gap || section.gap || '1rem',
    position: 'relative' as const,
  };

  // Convert section to a container component for rendering
  const sectionAsContainer: WireframeComponent = {
    id: section.id,
    type: 'container',
    children: section.components || [],
    layout: section.layout,
    style: {
      ...section.style,
      backgroundColor: section.backgroundColor,
      padding: section.style?.padding || section.padding,
      gap: section.style?.gap || section.gap,
    },
    dimensions: section.dimensions || {
      width: section.width || '100%',
      height: section.height || '200px',
    },
    position: section.position || { x: 0, y: 0 },
  };

  return (
    <div
      className={cn(
        "enhanced-section-renderer",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer"
      )}
      onClick={handleClick}
      data-section-id={section.id}
      data-section-type={section.sectionType}
    >
      <div className={cn(
        "section-header p-2 text-sm font-medium border-b",
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
      )}>
        {section.name || `${section.sectionType} Section`}
      </div>

      <ComponentRendererFactory
        component={sectionAsContainer}
        darkMode={darkMode}
        interactive={interactive}
        onClick={onComponentClick}
        deviceType={deviceType}
      />
    </div>
  );
};

export default EnhancedSectionRenderer;
