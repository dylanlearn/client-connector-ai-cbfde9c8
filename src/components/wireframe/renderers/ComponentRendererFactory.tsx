
import React from 'react';
import ContainerComponentRenderer from './specialized/ContainerComponentRenderer';
import ButtonComponentRenderer from './specialized/ButtonComponentRenderer';
import TextComponentRenderer from './specialized/TextComponentRenderer';
import ImageComponentRenderer from './specialized/ImageComponentRenderer';
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
  
  // Select the appropriate renderer based on component type
  switch(component.type?.toLowerCase()) {
    case 'button':
      return (
        <ButtonComponentRenderer
          component={component}
          darkMode={darkMode}
          interactive={interactive}
          onClick={onClick}
          isSelected={isSelected}
          deviceType={deviceType}
        />
      );
      
    case 'text':
      return (
        <TextComponentRenderer
          component={component}
          darkMode={darkMode}
          interactive={interactive}
          onClick={onClick}
          isSelected={isSelected}
          deviceType={deviceType}
        />
      );
      
    case 'image':
      return (
        <ImageComponentRenderer
          component={component}
          darkMode={darkMode}
          interactive={interactive}
          onClick={onClick}
          isSelected={isSelected}
          deviceType={deviceType}
        />
      );
      
    case 'container':
    case 'group':
    case 'box':
    default:
      // Use container renderer for container types and as fallback
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
  }
};

export default ComponentRendererFactory;
