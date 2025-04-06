
import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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
  handleMouseDown,
  handleMouseMove,
  handleTouchStart,
  handleTouchMove,
}) => {
  // Calculate rotation based on drag offset
  const rotate = isDragging ? offsetX * 0.1 : 0;

  return (
    <motion.div
      key={currentOption.id}
      className="absolute w-full h-full bg-white rounded-xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
      style={{ 
        x: offsetX,
        rotate: rotate,
        perspective: 1000
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ 
        x: direction === "left" ? -500 : direction === "right" ? 500 : 0,
        rotate: direction === "left" ? -30 : direction === "right" ? 30 : 0,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Like/Dislike indicators */}
      {isDragging && offsetX > 50 && (
        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
          <Heart className="h-5 w-5 fill-white" />
        </div>
      )}
      
      {isDragging && offsetX < -50 && (
        <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      )}
      
      {/* Card content */}
      <div className="h-[65%] bg-muted flex items-center justify-center overflow-hidden">
        {(currentOption.category === "animation") ? (
          <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
            {renderAnimationPreviewDemo(currentOption)}
          </div>
        ) : (currentOption.category === "interaction") ? (
          <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <InteractionPreviewDemo 
              currentOption={currentOption}
              isPreviewVisible={isPreviewVisible}
              setIsPreviewVisible={setIsPreviewVisible}
            />
          </div>
        ) : (
          <img 
            src={currentOption.imageUrl} 
            alt={currentOption.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {isLiked[currentOption.id] && (
          <div className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full">
            <Heart className="h-5 w-5 fill-white" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h4 className="text-lg font-semibold">{currentOption.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{currentOption.description}</p>
      </div>
    </motion.div>
  );
};

export default DesignCard;
