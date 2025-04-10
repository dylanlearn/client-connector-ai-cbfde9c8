
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';

/**
 * Props interface for all component renderers
 */
export interface BaseComponentRendererProps {
  component: WireframeComponent;
  darkMode?: boolean;
  interactive?: boolean;
  onClick?: (componentId: string) => void;
  isSelected?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  [key: string]: any;
}

/**
 * Base renderer for wireframe components
 * This is a generic placeholder - specific component renderers should be implemented
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

  if (!component) {
    return null;
  }

  // Safe rendering of content
  const renderContent = () => {
    if (typeof component.content === 'string') {
      return component.content;
    }
    return JSON.stringify(component.content);
  };

  // Return a placeholder - this would be overridden in actual component renderers
  return (
    <div
      className={`wireframe-base-component ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{
        border: '1px dashed #999',
        padding: '1rem',
        backgroundColor: darkMode ? '#2d3748' : '#f7fafc',
        color: darkMode ? 'white' : 'black',
        width: 'auto',
        height: 'auto',
        ...component.style
      }}
    >
      {component.type}: {renderContent()}
    </div>
  );
};

export default BaseComponentRenderer;
