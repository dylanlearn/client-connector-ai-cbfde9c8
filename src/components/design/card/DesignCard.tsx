
import React from "react";
import { motion } from "framer-motion";
import { DesignOption } from "../../design/VisualPicker";
import { Check, X } from "lucide-react";

interface DesignCardProps {
  option: DesignOption;
  onLike: () => void;
  onDislike: () => void;
  direction: "" | "left" | "right";
  isDragging: boolean;
  offsetX: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
}

const DesignCard = ({
  option,
  onLike,
  onDislike,
  direction,
  isDragging,
  offsetX,
  onMouseDown,
  onMouseMove,
  onTouchStart,
  onTouchMove,
}: DesignCardProps) => {
  // Calculate card rotation and position based on drag
  const rotate = isDragging ? offsetX * 0.1 : 0;
  const x = isDragging ? offsetX : 0;

  // Different animations based on swipe direction
  const getCardAnimation = () => {
    if (direction === "left") {
      return {
        x: -500,
        rotate: -30,
        opacity: 0,
        transition: { duration: 0.3 }
      };
    }
    if (direction === "right") {
      return {
        x: 500,
        rotate: 30,
        opacity: 0,
        transition: { duration: 0.3 }
      };
    }
    return {
      x,
      rotate,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    };
  };

  // Determine action indicators (like/dislike) based on drag amount
  const showLikeIndicator = isDragging && offsetX > 50;
  const showDislikeIndicator = isDragging && offsetX < -50;

  // Render different content based on category type
  const renderCardContent = () => {
    // For animations and interactions, render a demo preview
    if (option.category === 'animation' || option.category === 'interaction') {
      return (
        <div className="flex flex-col h-full">
          <div 
            className="w-full h-[70%] bg-cover bg-center flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            {/* Demo preview element based on type */}
            <motion.div
              className={`w-24 h-24 ${option.category === 'animation' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-purple-500 to-pink-600'} rounded-lg shadow-lg flex items-center justify-center`}
              animate={option.category === 'animation' ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
                transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
              } : {
                y: [0, -5, 0],
                transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white font-medium">{option.category === 'animation' ? 'Anim' : 'Inter'}</span>
            </motion.div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
            <p className="text-sm text-gray-500">{option.description}</p>
          </div>
        </div>
      );
    }
    
    // Default rendering for other categories
    return (
      <>
        <div 
          className="w-full h-[70%] bg-cover bg-center"
          style={{ backgroundImage: `url(${option.imageUrl})` }}
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
          <p className="text-sm text-gray-500">{option.description}</p>
        </div>
      </>
    );
  };

  return (
    <motion.div
      className="absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ 
        perspective: 1000,
        transformStyle: "preserve-3d"
      }}
      animate={getCardAnimation()}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      {renderCardContent()}

      {/* Like/Dislike indicators */}
      {showLikeIndicator && (
        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
          <Check className="h-5 w-5" />
        </div>
      )}
      {showDislikeIndicator && (
        <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full">
          <X className="h-5 w-5" />
        </div>
      )}
    </motion.div>
  );
};

export default DesignCard;
