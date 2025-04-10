
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import BaseComponentRenderer, { BaseComponentRendererProps } from './specialized/BaseComponentRenderer';
import TextComponentRenderer from './specialized/TextComponentRenderer';
import ButtonComponentRenderer from './specialized/ButtonComponentRenderer';
import ImageComponentRenderer from './specialized/ImageComponentRenderer';
import ContainerComponentRenderer from './specialized/ContainerComponentRenderer';

/**
 * Factory that returns the appropriate renderer for a component based on its type
 */
export const ComponentRendererFactory: React.FC<BaseComponentRendererProps> = (props) => {
  const { component } = props;
  
  // If component is undefined or null, return nothing
  if (!component) {
    return null;
  }

  // Select the appropriate renderer based on component type
  switch (component.type) {
    // Text components
    case 'heading':
    case 'h1':
    case 'h2': 
    case 'h3':
    case 'h4':
    case 'paragraph':
    case 'text':
      return <TextComponentRenderer {...props} />;
      
    // Button components
    case 'button':
    case 'cta':
      return <ButtonComponentRenderer {...props} />;
      
    // Image components
    case 'image':
    case 'img':
      return <ImageComponentRenderer {...props} />;
      
    // Container components
    case 'container':
    case 'section':
    case 'flex':
    case 'grid':
    case 'layout':
    case 'row':
    case 'column':
    case 'div':
      return <ContainerComponentRenderer {...props} />;
      
    // Fallback for any other component types
    default:
      return <BaseComponentRenderer {...props} />;
  }
};

export default ComponentRendererFactory;
