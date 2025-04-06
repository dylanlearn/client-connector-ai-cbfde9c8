
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
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
  const renderPreviewDemo = () => {
    if (currentOption.category === "animation") {
      return renderAnimationPreviewDemo(currentOption);
    } else if (currentOption.category === "interaction") {
      return (
        <InteractionPreviewDemo 
          currentOption={currentOption} 
          isPreviewVisible={isPreviewVisible}
          setIsPreviewVisible={setIsPreviewVisible} 
        />
      );
    }
    
    return null;
  };

  return (
    <AnimatePresence>
      <motion.div
        key={currentOption.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: offsetX,
          rotate: offsetX * 0.1,
          zIndex: 10
        }}
        exit={{ 
          x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
          opacity: 0,
          scale: 0.8,
          rotate: direction === "left" ? -30 : direction === "right" ? 30 : 0,
          transition: { duration: 0.3 }
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute inset-0 bg-white rounded-xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        whileTap={{ scale: 0.95 }}
      >
        <div className="h-[65%] overflow-hidden bg-muted relative">
          {(currentOption.category === "animation" || currentOption.category === "interaction") ? (
            <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
              {renderPreviewDemo()}
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
              <div className="h-5 w-5 fill-white">❤️</div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h4 className="text-lg font-semibold">{currentOption.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{currentOption.description}</p>
        </div>
        
        {isDragging && (
          <motion.div 
            className={cn("absolute inset-0 flex items-center justify-center", 
              offsetX > 50 ? "bg-green-500/20" : offsetX < -50 ? "bg-red-500/20" : "")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {offsetX > 50 && (
              <motion.div 
                className="bg-green-500 text-white p-2 rounded-full"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Check size={32} />
              </motion.div>
            )}
            {offsetX < -50 && (
              <motion.div 
                className="bg-red-500 text-white p-2 rounded-full"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <X size={32} />
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
