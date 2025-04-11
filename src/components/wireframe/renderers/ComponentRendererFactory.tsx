
import React from 'react';
import ContainerComponentRenderer from './specialized/ContainerComponentRenderer';
import ButtonComponentRenderer from './specialized/ButtonComponentRenderer';
import TextComponentRenderer from './specialized/TextComponentRenderer';
import ImageComponentRenderer from './specialized/ImageComponentRenderer';
import { BaseComponentRendererProps } from './specialized/BaseComponentRenderer';
import InputComponentRenderer from './specialized/InputComponentRenderer';
import CardComponentRenderer from './specialized/CardComponentRenderer';
import ListComponentRenderer from './specialized/ListComponentRenderer';
import IconComponentRenderer from './specialized/IconComponentRenderer';
import VideoComponentRenderer from './specialized/VideoComponentRenderer';
import ChartComponentRenderer from './specialized/ChartComponentRenderer';
import FormComponentRenderer from './specialized/FormComponentRenderer';

/**
 * Factory component that renders the appropriate component renderer based on component type
 * Enterprise-level implementation with comprehensive type support
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
    console.warn('ComponentRendererFactory received null or undefined component');
    return null;
  }
  
  const componentType = component.type?.toLowerCase();
  if (!componentType) {
    console.warn('Component without type detected:', component.id);
    return null;
  }
  
  // Select the appropriate renderer based on component type
  try {
    switch(componentType) {
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
      case 'paragraph':
      case 'heading':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'label':
      case 'span':
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
      case 'img':
      case 'picture':
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
        
      case 'input':
      case 'textfield':
      case 'textarea':
      case 'select':
      case 'checkbox':
      case 'radio':
      case 'switch':
        return (
          <InputComponentRenderer
            component={component}
            darkMode={darkMode}
            interactive={interactive}
            onClick={onClick}
            isSelected={isSelected}
            deviceType={deviceType}
          />
        );
        
      case 'card':
      case 'panel':
      case 'tile':
        return (
          <CardComponentRenderer
            component={component}
            darkMode={darkMode}
            interactive={interactive}
            onClick={onClick}
            isSelected={isSelected}
            deviceType={deviceType}
          />
        );
        
      case 'list':
      case 'menu':
      case 'ul':
      case 'ol':
        return (
          <ListComponentRenderer
            component={component}
            darkMode={darkMode}
            interactive={interactive}
            onClick={onClick}
            isSelected={isSelected}
            deviceType={deviceType}
          />
        );
        
      case 'icon':
      case 'svg':
        return (
          <IconComponentRenderer
            component={component}
            darkMode={darkMode}
            interactive={interactive}
            onClick={onClick}
            isSelected={isSelected}
            deviceType={deviceType}
          />
        );
        
      case 'video':
      case 'player':
        return (
          <VideoComponentRenderer
            component={component}
            darkMode={darkMode}
            interactive={interactive}
            onClick={onClick}
            isSelected={isSelected}
            deviceType={deviceType}
          />
        );
        
      case 'chart':
      case 'graph':
      case 'diagram':
        return (
          <ChartComponentRenderer
            component={component}
            darkMode={darkMode}
            interactive={interactive}
            onClick={onClick}
            isSelected={isSelected}
            deviceType={deviceType}
          />
        );
        
      case 'form':
        return (
          <FormComponentRenderer
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
      case 'section':
      case 'div':
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
  } catch (error) {
    console.error(`Error rendering component of type ${componentType}:`, error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded">
        <p>Error rendering component: {component.type}</p>
      </div>
    );
  }
};

export default ComponentRendererFactory;
