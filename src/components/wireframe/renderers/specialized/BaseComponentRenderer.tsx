
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';

export interface BaseComponentRendererProps {
  component: WireframeComponent;
  darkMode?: boolean;
  interactive?: boolean;
  onClick?: (componentId: string) => void;
  isSelected?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
}

/**
 * Base component renderer that all specialized renderers inherit from
 */
const BaseComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleClick = () => {
    if (interactive && onClick && component.id) {
      onClick(component.id);
    }
  };

  // Default styling based on component properties
  const baseStyles = {
    position: 'relative' as const,
    width: component.dimensions?.width || '100%',
    height: component.dimensions?.height || 'auto',
    opacity: component.style?.opacity !== undefined ? component.style.opacity : 1,
  };

  return (
    <div
      className={cn(
        "wireframe-component",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer",
        darkMode ? "text-white" : "text-gray-900"
      )}
      style={baseStyles}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      <div className="p-2 text-center text-xs text-muted-foreground border border-dashed">
        {component.type} Component
      </div>
    </div>
  );
};

export default BaseComponentRenderer;
