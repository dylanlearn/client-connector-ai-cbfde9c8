
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CardContainer from "./card/CardContainer";
import DesignCard from "./card/DesignCard";
import ControlButtons from "./card/ControlButtons";
import EmptyState from "./card/EmptyState";

export interface DesignOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface VisualPickerProps {
  options: DesignOption[];
  onSelectOption: (option: DesignOption, liked: boolean) => void;
  category?: string;
  onComplete?: () => void;
}

const VisualPicker: React.FC<VisualPickerProps> = ({
  options,
  onSelectOption,
  category = "design",
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"" | "left" | "right">("");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [showRestartButton, setShowRestartButton] = useState(false);

  useEffect(() => {
    if (currentIndex >= options.length) {
      setShowRestartButton(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, options.length, onComplete]);

  const handleLike = () => {
    if (currentIndex < options.length) {
      onSelectOption(options[currentIndex], true);
      setDirection("right");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setDirection("");
      }, 300);
    }
  };

  const handleDislike = () => {
    if (currentIndex < options.length) {
      onSelectOption(options[currentIndex], false);
      setDirection("left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setDirection("");
      }, 300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // If dragged far enough, trigger like/dislike
    if (offsetX > 100) {
      handleLike();
    } else if (offsetX < -100) {
      handleDislike();
    }
    setOffsetX(0);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowRestartButton(false);
    setDirection("");
  };

  // Show empty state if no options or all options have been swiped
  if (options.length === 0 || (currentIndex >= options.length && !showRestartButton)) {
    return <EmptyState category={category} />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      {currentIndex < options.length ? (
        <>
          <CardContainer onDragEnd={handleDragEnd}>
            <DesignCard 
              option={options[currentIndex]} 
              onLike={handleLike} 
              onDislike={handleDislike}
              direction={direction}
              isDragging={isDragging}
              offsetX={offsetX}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            />
          </CardContainer>
          
          <ControlButtons 
            onLike={handleLike} 
            onDislike={handleDislike} 
            showRestartButton={false}
            onRestart={handleRestart}
          />
          
          <div className="text-sm text-muted-foreground mt-2">
            {currentIndex + 1} of {options.length}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <h3 className="text-xl font-medium mb-4">You've seen all {category} options</h3>
          <ControlButtons 
            onLike={handleLike} 
            onDislike={handleDislike} 
            showRestartButton={showRestartButton}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
};

export default VisualPicker;
