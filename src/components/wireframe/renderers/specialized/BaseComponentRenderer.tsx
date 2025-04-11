
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { DeviceType } from '@/components/wireframe/preview/DeviceInfo';

export interface BaseComponentRendererProps {
  component: WireframeComponent;
  darkMode?: boolean;
  interactive?: boolean;
  onClick?: (componentId: string) => void;
  isSelected?: boolean;
  deviceType?: DeviceType;
}

/**
 * Base component renderer that provides common functionality 
 * for all specialized component renderers
 */
export const BaseComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  if (!component) {
    console.error('BaseComponentRenderer: No component provided');
    return null;
  }

  // Default rendering - normally this would be extended by specialized renderers
  return (
    <div 
      className={`base-component ${darkMode ? 'dark-mode' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick?.(component.id)}
    >
      {component.content || `${component.type} component`}
    </div>
  );
};

export default BaseComponentRenderer;
