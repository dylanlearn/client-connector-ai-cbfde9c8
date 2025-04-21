
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DesignOption } from "../AnimatedVisualPicker";
import { DesignCard } from "./DesignCard";
import { ActionButtons } from "./ActionButtons";

// Extended design option interface to match the properties used in DesignCard
export interface ExtendedDesignOption extends DesignOption {
  colorScheme?: Record<string, string>;
  typography?: {
    headings: string;
    body: string;
  };
  layoutStyle?: string;
  toneDescriptor?: string;
}

interface AnimatedVisualPickerProps {
  options: ExtendedDesignOption[];
  onSelect: (option: ExtendedDesignOption) => void;
  category: DesignOption["category"];
  className?: string;
}

// Changed to a named function declaration that's exported as default
const AnimatedVisualPicker = ({ 
  options, 
  onSelect, 
  category, 
  className 
}: AnimatedVisualPickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"" | "left" | "right">("");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option => option.category === category);
  
  if (filteredOptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted">
        <p className="text-lg text-muted-foreground">No {category} options available</p>
      </div>
    );
  }

  const currentOption = filteredOptions[currentIndex];

  const handleLike = () => {
    onSelect(currentOption);
    setIsLiked(prev => ({ ...prev, [currentOption.id]: true }));
    
    if (currentIndex < filteredOptions.length - 1) {
      setDirection("right");
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDirection("");
        setOffsetX(0);
      }, 300);
    } else {
      toast.success("You've seen all options!");
    }
  };

  const handleDislike = () => {
    setIsLiked(prev => ({ ...prev, [currentOption.id]: false }));
    
    if (currentIndex < filteredOptions.length - 1) {
      setDirection("left");
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDirection("");
        setOffsetX(0);
      }, 300);
    } else {
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
    
    const threshold = 100;
    
    if (offsetX > threshold) {
      handleLike();
    } else if (offsetX < -threshold) {
      handleDislike();
    } else {
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
      
      <div 
        className="relative w-full max-w-md h-[400px] mb-4"
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchEnd={handleDragEnd}
      >
        <DesignCard
          currentOption={currentOption}
          direction={direction}
          isLiked={isLiked}
          offsetX={offsetX}
          isDragging={isDragging}
          isPreviewVisible={isPreviewVisible}
          setIsPreviewVisible={setIsPreviewVisible}
          handleDragEnd={handleDragEnd}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
        />
      </div>
      
      <ActionButtons
        handleLike={handleLike}
        handleDislike={handleDislike}
        currentIndex={currentIndex}
        optionsLength={filteredOptions.length}
        restartSwiping={restartSwiping}
      />
    </div>
  );
};

// Export as default
export default AnimatedVisualPicker;
