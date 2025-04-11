
import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { Play, FilmIcon } from 'lucide-react';

/**
 * Specialized renderer for video components
 */
const VideoComponentRenderer: React.FC<BaseComponentRendererProps> = ({
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

  // Extract video styles
  const {
    borderRadius = '0.375rem',
    aspectRatio = '16/9',
    width = '100%',
    height = 'auto',
    objectFit = 'cover',
  } = component.style || {};

  // Get video source or thumbnail
  const videoSrc = component.props?.src || '';
  const thumbnailSrc = component.props?.thumbnail || '';

  return (
    <div 
      className={cn(
        "wireframe-video-component relative",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer"
      )}
      style={{
        width,
        height,
        aspectRatio,
        borderRadius,
        overflow: 'hidden'
      }}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type="video"
    >
      {thumbnailSrc ? (
        <img 
          src={thumbnailSrc} 
          alt="Video thumbnail" 
          className="w-full h-full object-cover"
          style={{ borderRadius }}
        />
      ) : (
        <div className={cn(
          "flex items-center justify-center w-full h-full",
          darkMode ? "bg-gray-800" : "bg-gray-100"
        )}>
          <FilmIcon className={cn(
            "h-12 w-12",
            darkMode ? "text-gray-600" : "text-gray-400"
          )} />
        </div>
      )}
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center",
          "bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
        )}>
          <Play className="h-7 w-7 text-white ml-1" />
        </div>
      </div>
      
      {/* Video title if provided */}
      {component.props?.title && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
          <h4 className="text-white text-sm font-medium">{component.props.title}</h4>
        </div>
      )}
    </div>
  );
};

export default VideoComponentRenderer;
