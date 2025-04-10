
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { ComponentRendererFactory } from '../ComponentRendererFactory';

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

  // Get container styles
  const {
    backgroundColor,
    borderRadius = '0',
    padding = '1rem',
    margin = '0',
    border,
    display = 'flex',
    flexDirection = 'column',
    alignItems = 'start',
    justifyContent = 'start',
    gap = '1rem',
  } = component.style || {};

  // Layout configuration
  const layout = component.layout || { type: 'flex', direction: 'column' };
  const layoutType = typeof layout === 'string' ? layout : layout.type;
  
  // Determine container layout styles with proper TypeScript types
  const getLayoutStyles = () => {
    if (layoutType === 'grid') {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${typeof layout === 'object' ? layout.columns || 3 : 3}, 1fr)`,
        gap: typeof layout === 'object' ? layout.gap || '1rem' : '1rem',
      } as React.CSSProperties;
    } else {
      // Define the flexDirection with proper typing
      const flexDir = typeof layout === 'object' 
        ? layout.direction === 'horizontal' ? 'row' as const : 'column' as const
        : flexDirection as React.CSSProperties['flexDirection'];
      
      // Define flexWrap with proper typing
      const flexWrap = typeof layout === 'object' 
        ? (layout.wrap ? 'wrap' as const : 'nowrap' as const) 
        : 'wrap' as const;
      
      return {
        display: 'flex',
        flexDirection: flexDir,
        flexWrap, 
        alignItems: typeof layout === 'object' ? layout.alignment || alignItems : alignItems,
        justifyContent: typeof layout === 'object' ? layout.justifyContent || justifyContent : justifyContent,
        gap: typeof layout === 'object' ? layout.gap || gap : gap,
      } as React.CSSProperties;
    }
  };

  const containerStyles = {
    width: component.dimensions?.width || '100%',
    height: component.dimensions?.height || 'auto',
    backgroundColor: backgroundColor || (darkMode ? '#1f2937' : '#f9fafb'),
    borderRadius,
    padding,
    margin,
    border,
    opacity: component.style?.opacity !== undefined ? component.style.opacity : 1,
    ...getLayoutStyles(),
  } as React.CSSProperties;

  // Render children components if any
  const renderChildren = () => {
    if (!component.children || component.children.length === 0) {
      return (
        <div className={cn(
          "text-center p-4 text-sm w-full",
          darkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {component.type === 'container' ? 'Container - No content' : `${component.type} - No content`}
        </div>
      );
    }

    return component.children.map((child, index) => (
      <ComponentRendererFactory 
        key={child.id || `child-${index}`}
        component={child}
        darkMode={darkMode}
        interactive={interactive}
        onClick={onClick}
        isSelected={false}
        deviceType={deviceType}
      />
    ));
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
      {renderChildren()}
    </div>
  );
};

export default ContainerComponentRenderer;
