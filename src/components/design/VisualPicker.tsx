
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import CardContainer from "./card/CardContainer";
import DesignCard from "./card/DesignCard";
import ControlButtons from "./card/ControlButtons";
import EmptyState from "./card/EmptyState";

export type DesignOption = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "hero" | "navbar" | "about" | "footer" | "font" | "animation" | "interaction";
};

interface VisualPickerProps {
  options: DesignOption[];
  onSelect: (option: DesignOption) => void;
  category: DesignOption["category"];
  className?: string;
}

const VisualPicker = ({ options, onSelect, category, className }: VisualPickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"" | "left" | "right">("");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  // Filter options by category
  const filteredOptions = options.filter(option => option.category === category);
  
  // If no options match the category
  if (filteredOptions.length === 0) {
    return <EmptyState category={category} />;
  }

  const currentOption = filteredOptions[currentIndex];

  const handleLike = () => {
    onSelect(currentOption);
    
    if (currentIndex < filteredOptions.length - 1) {
      setDirection("right");
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDirection("");
        setOffsetX(0);
      }, 300);
    } else {
      // End of options
      toast.success("You've seen all options!");
    }
  };

  const handleDislike = () => {
    if (currentIndex < filteredOptions.length - 1) {
      setDirection("left");
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDirection("");
        setOffsetX(0);
      }, 300);
    } else {
      // End of options
      toast.success("You've seen all options!");
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
    
    // Threshold for swipe action
    const threshold = 100;
    
    if (offsetX > threshold) {
      // Swiped right
      handleLike();
    } else if (offsetX < -threshold) {
      // Swiped left
      handleDislike();
    } else {
      // Reset position if not swiped enough
      setOffsetX(0);
    }
  };

  const restartSwiping = () => {
    setCurrentIndex(0);
    setDirection("");
    setOffsetX(0);
    toast.info("Starting from the beginning");
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold capitalize">{category} Selection</h3>
        <p className="text-sm text-muted-foreground">
          Swipe right to select, left to skip. {currentIndex + 1} of {filteredOptions.length}
        </p>
      </div>
      
      <CardContainer onDragEnd={handleDragEnd}>
        <DesignCard
          option={currentOption}
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
        showRestartButton={currentIndex === filteredOptions.length - 1}
        onRestart={restartSwiping}
      />
    </div>
  );
};

export default VisualPicker;
