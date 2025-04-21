
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from 'lucide-react';
import { DesignOption } from '../AnimatedVisualPicker';

// Extend the DesignOption interface to include the properties used in this component
interface ExtendedDesignOption extends DesignOption {
  colorScheme?: Record<string, string>;
  typography?: {
    headings: string;
    body: string;
  };
  layoutStyle?: string;
  toneDescriptor?: string;
}

interface DesignCardProps {
  currentOption: ExtendedDesignOption;
  direction: string;
  isLiked: Record<string, boolean>;
  offsetX: number;
  isDragging: boolean;
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  handleDragEnd: () => void;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  currentOption,
  direction,
  isLiked,
  offsetX,
  isDragging,
  isPreviewVisible,
  setIsPreviewVisible,
  handleDragEnd,
  handleMouseDown,
  handleMouseMove,
  handleTouchStart,
  handleTouchMove
}) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 rounded-xl overflow-hidden shadow-lg cursor-grab transition-transform",
        isDragging && "cursor-grabbing",
        direction === "left" && "animate-slide-out-left",
        direction === "right" && "animate-slide-out-right"
      )}
      style={{ 
        transform: isDragging ? `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)` : undefined,
        backgroundImage: `url(${currentOption.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div 
        className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/80 to-transparent"
        onClick={() => setIsPreviewVisible(!isPreviewVisible)}
      >
        <div className="flex justify-between items-start">
          <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentOption.title}
          </div>
          
          {isLiked[currentOption.id] !== undefined && (
            <div 
              className={cn(
                "rounded-full p-2",
                isLiked[currentOption.id] 
                  ? "bg-green-500 text-white" 
                  : "bg-red-500 text-white"
              )}
            >
              {isLiked[currentOption.id] ? <CheckIcon size={16} /> : <XIcon size={16} />}
            </div>
          )}
        </div>
        
        <div className="bg-black/60 text-white p-3 rounded-lg backdrop-blur-sm">
          <p className="font-bold text-lg">{currentOption.title}</p>
          <p className="text-sm opacity-90">{currentOption.description}</p>
          
          {isPreviewVisible && (
            <div className="mt-3 pt-3 border-t border-white/20">
              {currentOption.colorScheme && (
                <div className="flex gap-2 my-2">
                  {Object.entries(currentOption.colorScheme).slice(0, 3).map(([key, color]) => (
                    <div 
                      key={key}
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: color as string }}
                      title={`${key}: ${color}`}
                    ></div>
                  ))}
                </div>
              )}
              
              {currentOption.typography && (
                <p className="text-xs">
                  {currentOption.typography.headings} / {currentOption.typography.body}
                </p>
              )}
              
              {currentOption.layoutStyle && (
                <p className="text-xs">Layout: {currentOption.layoutStyle}</p>
              )}
              
              {currentOption.toneDescriptor && (
                <p className="text-xs">Tone: {currentOption.toneDescriptor}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
