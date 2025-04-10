
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';

interface NavigationRendererProps {
  component: WireframeComponent;
  darkMode?: boolean;
  interactive?: boolean;
  onClick?: (componentId: string) => void;
  isSelected?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  [key: string]: any;
}

const NavigationRenderer: React.FC<NavigationRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const isActive = isSelected;

  const handleComponentClick = (componentId: string) => (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (onClick) {
      onClick(componentId);
    }
  };

  const renderContent = () => {
    if (typeof component.content === 'string') {
      return component.content;
    }
    return JSON.stringify(component.content);
  };

  return (
    <div
      className="wireframe-navigation"
      style={{
        backgroundColor: darkMode ? '#2d3748' : '#f7fafc',
        color: darkMode ? 'white' : 'black',
        width: '100%',
        height: 'auto',
        ...component.style
      }}
    >
      {component.components && component.components.map(item => (
        <div 
          key={item.id} 
          className={`navigation-item ${isActive ? 'active' : ''}`}
          onClick={handleComponentClick(item.id)}
        >
          {typeof item.content === 'string' ? item.content : JSON.stringify(item.content)}
        </div>
      ))}
    </div>
  );
};

export default NavigationRenderer;
