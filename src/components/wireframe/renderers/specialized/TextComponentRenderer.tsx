
import React from 'react';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { cn } from '@/lib/utils';

/**
 * Specialized renderer for text components (headings, paragraphs, etc)
 */
const TextComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(component.id);
    }
  };

  // Apply device-specific styles
  const responsiveStyles = component.responsive?.[deviceType] || {};
  
  // Merge all styles
  const styles = {
    ...component.style,
    ...responsiveStyles,
  };
  
  // Determine text element type based on component type
  const type = component.type.toLowerCase();
  
  // Check for heading types
  const isHeading = type === 'heading' || 
    type === 'h1' || 
    type === 'h2' || 
    type === 'h3' || 
    type === 'h4' || 
    type === 'h5' || 
    type === 'h6';
  
  // Get heading level
  let headingLevel = 2; // default to h2
  
  if (type === 'h1') headingLevel = 1;
  else if (type === 'h2') headingLevel = 2;
  else if (type === 'h3') headingLevel = 3;
  else if (type === 'h4') headingLevel = 4;
  else if (type === 'h5') headingLevel = 5;
  else if (type === 'h6') headingLevel = 6;
  
  // Default content
  const content = component.content || (isHeading ? `Heading ${headingLevel}` : 'Text content');
  
  // Apply appropriate class based on element type
  const baseClass = cn(
    isSelected ? 'ring-2 ring-primary ring-offset-2 rounded' : '',
    darkMode ? 'text-white' : '',
    component.className
  );

  // Render the appropriate element based on type
  switch (type) {
    case 'h1':
    case 'heading':
      return <h1 className={cn('text-4xl font-bold', baseClass)} style={styles} onClick={handleClick}>{content}</h1>;
    case 'h2':
      return <h2 className={cn('text-3xl font-bold', baseClass)} style={styles} onClick={handleClick}>{content}</h2>;
    case 'h3':
      return <h3 className={cn('text-2xl font-bold', baseClass)} style={styles} onClick={handleClick}>{content}</h3>;
    case 'h4':
      return <h4 className={cn('text-xl font-bold', baseClass)} style={styles} onClick={handleClick}>{content}</h4>;
    case 'h5':
      return <h5 className={cn('text-lg font-bold', baseClass)} style={styles} onClick={handleClick}>{content}</h5>;
    case 'h6':
      return <h6 className={cn('text-base font-bold', baseClass)} style={styles} onClick={handleClick}>{content}</h6>;
    case 'span':
      return <span className={baseClass} style={styles} onClick={handleClick}>{content}</span>;
    case 'label':
      return <label className={cn('font-medium', baseClass)} style={styles} onClick={handleClick}>{content}</label>;
    case 'paragraph':
    case 'text':
    default:
      return <p className={baseClass} style={styles} onClick={handleClick}>{content}</p>;
  }
};

export default TextComponentRenderer;
