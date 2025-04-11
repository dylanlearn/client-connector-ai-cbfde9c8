
import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import * as LucideIcons from 'lucide-react';

/**
 * Specialized renderer for icon components
 */
const IconComponentRenderer: React.FC<BaseComponentRendererProps> = ({
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

  // Extract icon styles
  const {
    size = '24px',
    color = darkMode ? '#FFFFFF' : '#000000',
    stroke = '2',
    width = 'auto',
    height = 'auto',
  } = component.style || {};

  // Get icon name from props or fallback to 'Circle'
  const iconName = component.props?.icon || 'Circle';
  
  // Convert iconName to PascalCase for Lucide component lookup
  const formattedIconName = iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  // Get the icon component or fallback to Circle
  const IconComponent = (LucideIcons as any)[formattedIconName] || LucideIcons.Circle;

  return (
    <div 
      className={cn(
        "wireframe-icon-component inline-flex justify-center items-center",
        isSelected && "ring-2 ring-primary p-1 rounded-md",
        interactive && "cursor-pointer"
      )}
      style={{ width, height }}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type="icon"
    >
      <IconComponent
        size={size}
        color={color}
        strokeWidth={stroke}
        className={cn(component.props?.className)}
      />
    </div>
  );
};

export default IconComponentRenderer;
