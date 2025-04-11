
import React from 'react';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { cn } from '@/lib/utils';

/**
 * Specialized renderer for button components
 */
const ButtonComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (interactive) {
      // In interactive mode, allow the button to do its native action
    } else {
      // In edit/preview mode, select the component instead
      e.preventDefault();
      e.stopPropagation();
      if (onClick) {
        onClick(component.id);
      }
    }
  };

  // Get button variant from component props
  const variant = component.props?.variant || 'default';
  const size = component.props?.size || 'default';

  // Apply device-specific styles
  const responsiveStyles = component.responsive?.[deviceType] || {};
  
  // Merge all styles
  const styles = {
    ...component.style,
    ...responsiveStyles,
  };

  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium transition-colors',
        variant === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : '',
        variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : '',
        variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : '',
        size === 'sm' ? 'text-sm px-3 py-1' : '',
        size === 'lg' ? 'text-lg px-5 py-3' : '',
        darkMode ? 'dark-theme' : '',
        isSelected ? 'ring-2 ring-primary ring-offset-2' : '',
        component.className
      )}
      onClick={handleClick}
      style={styles}
      aria-label={component.props?.ariaLabel}
      disabled={component.props?.disabled}
      data-component-id={component.id}
      data-component-type="button"
    >
      {component.content || 'Button'}
    </button>
  );
};

export default ButtonComponentRenderer;
