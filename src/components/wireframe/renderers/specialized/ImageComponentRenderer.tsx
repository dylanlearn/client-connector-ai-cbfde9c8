
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { ImageIcon } from 'lucide-react';

/**
 * Specialized renderer for image components
 */
const ImageComponentRenderer: React.FC<BaseComponentRendererProps> = ({
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

  // Get image styles
  const {
    borderRadius = '0.25rem',
    objectFit = 'cover',
    aspectRatio,
  } = component.style || {};

  const imageUrl = component.props?.src || component.src;
  const altText = component.props?.alt || component.alt || 'Image';
  
  const baseStyles = {
    width: component.dimensions?.width || '100%',
    height: component.dimensions?.height || 'auto',
    opacity: component.style?.opacity !== undefined ? component.style.opacity : 1,
    borderRadius,
    aspectRatio: aspectRatio || 'auto',
  };

  return (
    <div
      className={cn(
        "wireframe-image-component",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer"
      )}
      style={baseStyles}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type="image"
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={altText}
          className="w-full h-full object-cover"
          style={{ objectFit, borderRadius }}
        />
      ) : (
        <div className={cn(
          "flex items-center justify-center w-full h-full border-2 border-dashed",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-100"
        )}>
          <div className="flex flex-col items-center justify-center p-4">
            <ImageIcon className={cn(
              "h-8 w-8 mb-2",
              darkMode ? "text-gray-500" : "text-gray-400"
            )} />
            <span className="text-xs text-center text-muted-foreground">Image Placeholder</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageComponentRenderer;
