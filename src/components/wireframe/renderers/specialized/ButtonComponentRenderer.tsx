
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { Button } from '@/components/ui/button';

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
    // Prevent event bubbling if interactive
    if (interactive) {
      e.stopPropagation();
      if (onClick && component.id) {
        onClick(component.id);
      }
    }
  };

  // Get button styles
  const {
    backgroundColor = '#3b82f6',
    color = '#ffffff',
    borderRadius = '0.375rem',
    fontSize = '0.875rem',
    fontWeight = '500',
    padding = '0.5rem 1rem',
    width,
    height,
    variant = 'default',
    size = 'default',
  } = component.style || {};

  // Get button content - ensure it's a string
  const buttonText = typeof component.content === 'string' 
    ? component.content 
    : 'Button';
  
  // Handle button variants
  const getButtonVariant = () => {
    switch (variant) {
      case 'outline':
        return 'outline';
      case 'ghost':
        return 'ghost';
      case 'link':
        return 'link';
      case 'destructive':
        return 'destructive';
      case 'secondary':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Custom styling for when we want to override shadcn defaults
  const customStyle = component.style?.customStyle ? {
    backgroundColor,
    color,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    width: width || 'auto',
    height: height || 'auto',
  } : {};

  return (
    <div 
      className={cn(
        "wireframe-button-component",
        isSelected && "ring-2 ring-primary p-1",
        interactive && !component.style?.disabled && "cursor-pointer"
      )}
      data-component-id={component.id}
      data-component-type="button"
      onClick={(e) => e.stopPropagation()} // Prevent parent clicks
    >
      <Button
        variant={getButtonVariant() as any}
        size={size as any}
        disabled={component.style?.disabled}
        className={cn(component.style?.className)}
        style={component.style?.customStyle ? customStyle : {}}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ButtonComponentRenderer;
