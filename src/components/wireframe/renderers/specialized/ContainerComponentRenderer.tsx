
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { ComponentRendererFactory } from '../ComponentRendererFactory';
import { createStyleObject } from '../utilities';

/**
 * Specialized renderer for container/layout components that holds other components
 */
const ContainerComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if clicking directly on container, not children
    if (interactive && onClick && component.id && e.target === e.currentTarget) {
      onClick(component.id);
    }
  };

  // Get container styles from component and ensure they're valid CSS properties
  const styleObj = {
    backgroundColor: component.style?.backgroundColor || (darkMode ? '#1f2937' : '#f9fafb'),
    borderRadius: component.style?.borderRadius || '0',
    padding: component.style?.padding || '1rem',
    margin: component.style?.margin || '0',
    border: component.style?.border,
    opacity: component.style?.opacity !== undefined ? component.style.opacity : 1,
    ...(component.style || {})
  };
  
  // Create a properly typed style object
  const baseStyles = createStyleObject(styleObj);

  // Layout configuration
  const layout = component.layout || { type: 'flex', direction: 'column' };
  const layoutType = typeof layout === 'string' ? layout : layout.type;
  
  // Determine container layout styles
  const getLayoutStyles = (): React.CSSProperties => {
    if (layoutType === 'grid') {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${typeof layout === 'object' ? layout.columns || 3 : 3}, 1fr)`,
        gap: typeof layout === 'object' ? layout.gap || '1rem' : '1rem',
      };
    } else {
      // Define the flexDirection with proper typing
      const flexDir = typeof layout === 'object' 
        ? layout.direction === 'horizontal' ? 'row' : 'column'
        : 'column';
      
      // Define flexWrap with proper typing
      const flexWrap = typeof layout === 'object' 
        ? (layout.wrap ? 'wrap' : 'nowrap')
        : 'wrap';
      
      return {
        display: 'flex',
        flexDirection: flexDir as React.CSSProperties['flexDirection'],
        flexWrap: flexWrap as React.CSSProperties['flexWrap'], 
        alignItems: typeof layout === 'object' ? layout.alignment || 'start' : 'start',
        justifyContent: typeof layout === 'object' ? layout.justifyContent || 'start' : 'start',
        gap: typeof layout === 'object' ? layout.gap || '1rem' : '1rem',
      };
    }
  };

  const containerStyles = {
    width: component.dimensions?.width || '100%',
    height: component.dimensions?.height || 'auto',
    ...baseStyles,
    ...getLayoutStyles(),
  };

  // For responsive behavior based on device type
  const responsiveStyles: Record<string, React.CSSProperties> = {
    desktop: {},
    tablet: { width: '100%' },
    mobile: { width: '100%', flexDirection: 'column' as const },
  };

  return (
    <div
      className={cn(
        "wireframe-container-component",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer",
      )}
      style={{
        ...containerStyles,
        ...(deviceType !== 'desktop' ? responsiveStyles[deviceType] : {}),
      }}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      {/* Render children components if any */}
      {(!component.children || component.children.length === 0) ? (
        <div className={cn(
          "text-center p-4 text-sm w-full",
          darkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {component.type === 'container' ? 'Container - No content' : `${component.type} - No content`}
        </div>
      ) : (
        component.children.map((child, index) => (
          <ComponentRendererFactory 
            key={child.id || `child-${index}`}
            component={child}
            darkMode={darkMode}
            interactive={interactive}
            onClick={onClick}
            isSelected={false}
            deviceType={deviceType}
          />
        ))
      )}
    </div>
  );
};

export default ContainerComponentRenderer;
