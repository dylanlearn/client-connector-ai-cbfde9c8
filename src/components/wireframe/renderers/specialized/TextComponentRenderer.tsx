
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';

/**
 * Specialized renderer for text components (headings, paragraphs, etc.)
 */
const TextComponentRenderer: React.FC<BaseComponentRendererProps> = ({
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

  // Get text styles from component
  const {
    fontSize = component.type === 'heading' ? '1.5rem' : '1rem',
    fontWeight = component.type === 'heading' ? '600' : '400',
    textAlign = 'left',
    color,
    lineHeight,
  } = component.style || {};

  // Get specific text content or use placeholder
  const textContent = component.content || 
    (component.type === 'heading' ? 'Heading Text' : 'Paragraph text content goes here. This is a placeholder for your actual content.');

  // Determine component type for rendering
  const getTextElement = () => {
    switch (component.type) {
      case 'heading':
      case 'h1':
        return <h1 style={{ fontSize, fontWeight, textAlign, color, lineHeight }}>{textContent}</h1>;
      case 'h2':
        return <h2 style={{ fontSize, fontWeight, textAlign, color, lineHeight }}>{textContent}</h2>;
      case 'h3':
        return <h3 style={{ fontSize, fontWeight, textAlign, color, lineHeight }}>{textContent}</h3>;
      case 'h4':
        return <h4 style={{ fontSize, fontWeight, textAlign, color, lineHeight }}>{textContent}</h4>;
      case 'paragraph':
      case 'text':
      default:
        return <p style={{ fontSize, fontWeight, textAlign, color, lineHeight }}>{textContent}</p>;
    }
  };

  const baseStyles = {
    width: component.dimensions?.width || '100%',
    height: component.dimensions?.height || 'auto',
    opacity: component.style?.opacity !== undefined ? component.style.opacity : 1,
  };

  return (
    <div
      className={cn(
        "wireframe-text-component",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer",
        darkMode ? "text-white" : "text-gray-900"
      )}
      style={baseStyles}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      {getTextElement()}
    </div>
  );
};

export default TextComponentRenderer;
