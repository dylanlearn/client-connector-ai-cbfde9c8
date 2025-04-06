
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { DesignOption } from "../AnimatedVisualPicker";
import { renderAnimationPreviewDemo, InteractionPreviewDemo } from "./PreviewDemos";

interface DesignCardProps {
  currentOption: DesignOption;
  direction: "" | "left" | "right";
  isLiked: Record<string, boolean>;
  offsetX: number;
  isDragging: boolean;
  isPreviewVisible: boolean;
  setIsPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
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
  handleTouchMove,
}) => {
  // Calculate rotation based on drag offset
  const rotation = offsetX * 0.05;
  
  // Define responsive card animation
  const cardAnimations = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { 
      x: direction === "left" ? -300 : direction === "right" ? 300 : 0, 
      opacity: 0, 
      transition: { duration: 0.2 } 
    },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden"
      style={{ 
        x: isDragging ? offsetX : 0,
        rotate: isDragging ? rotation : 0,
        cursor: isDragging ? "grabbing" : "grab"
      }}
      {...cardAnimations}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Like/Dislike Indicators */}
      {offsetX > 50 && (
        <div className="absolute top-4 right-4 bg-green-100 p-2 rounded-full z-10">
          <Check className="h-6 w-6 text-green-500" />
        </div>
      )}
      {offsetX < -50 && (
        <div className="absolute top-4 left-4 bg-red-100 p-2 rounded-full z-10">
          <X className="h-6 w-6 text-red-500" />
        </div>
      )}
      
      {/* Card Header */}
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg">{currentOption.title}</h3>
        <p className="text-sm text-gray-500">{currentOption.description}</p>
      </div>
      
      {/* Preview Section */}
      <div className="relative h-[250px] bg-gray-50 flex items-center justify-center p-4">
        {currentOption.category === "animation" && renderAnimationPreviewDemo(currentOption)}
        
        {currentOption.category === "interaction" && (
          <InteractionPreviewDemo 
            currentOption={currentOption}
            isPreviewVisible={isPreviewVisible}
            setIsPreviewVisible={setIsPreviewVisible}
          />
        )}
      </div>
      
      {/* Card Actions */}
      <div className="p-4 flex justify-between items-center">
        <div>
          {isLiked[currentOption.id] === true && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              Selected
            </span>
          )}
          {isLiked[currentOption.id] === false && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
              Skipped
            </span>
          )}
        </div>
        
        {currentOption.preview && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewVisible(!isPreviewVisible);
            }}
            className="ml-auto"
          >
            <Eye className="h-3 w-3 mr-1" />
            {isPreviewVisible ? "Close Preview" : "Full Preview"}
          </Button>
        )}
      </div>
    </motion.div>
  );
};
