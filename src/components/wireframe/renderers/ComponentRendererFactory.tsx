
import React from 'react';
import ContainerComponentRenderer from './specialized/ContainerComponentRenderer';
import { BaseComponentRendererProps } from './specialized/BaseComponentRenderer';

/**
 * Factory component that renders the appropriate component renderer based on component type
 */
export const ComponentRendererFactory: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  if (!component) {
    return null;
  }
  
  // Use the container renderer as default for now
  // In a full implementation, you would have specialized renderers for different component types
  return (
    <ContainerComponentRenderer
      component={component}
      darkMode={darkMode}
      interactive={interactive}
      onClick={onClick}
      isSelected={isSelected}
      deviceType={deviceType}
    />
  );
};

export default ComponentRendererFactory;
