
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Filter options by category
  const filteredOptions = options.filter(option => option.category === category);
  
  // If no options match the category
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

  const getCardStyle = () => {
    if (direction === "left") {
      return "translate-x-[-150%] rotate-[-30deg] opacity-0";
    } else if (direction === "right") {
      return "translate-x-[150%] rotate-[30deg] opacity-0";
    } else if (isDragging) {
      return `translate-x-[${offsetX}px] rotate-[${offsetX * 0.1}deg]`;
    }
    return "";
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
        <div
          ref={cardRef}
          className={cn(
            "absolute inset-0 bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing",
            getCardStyle()
          )}
          style={{ transform: `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="h-[65%] overflow-hidden bg-muted">
            <img 
              src={currentOption.imageUrl} 
              alt={currentOption.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-4">
            <h4 className="text-lg font-semibold">{currentOption.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{currentOption.description}</p>
          </div>
          
          {isDragging && (
            <div className={cn("absolute inset-0 flex items-center justify-center", 
              offsetX > 50 ? "bg-green-500/20" : offsetX < -50 ? "bg-red-500/20" : "")}>
              {offsetX > 50 && (
                <div className="bg-green-500 text-white p-2 rounded-full">
                  <Check size={32} />
                </div>
              )}
              {offsetX < -50 && (
                <div className="bg-red-500 text-white p-2 rounded-full">
                  <X size={32} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-red-100 hover:bg-red-200 border-red-200"
          onClick={handleDislike}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-green-100 hover:bg-green-200 border-green-200"
          onClick={handleLike}
        >
          <Check className="h-6 w-6 text-green-500" />
        </Button>
      </div>
      
      {currentIndex === filteredOptions.length - 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={restartSwiping}
          className="mt-4"
        >
          See options again
        </Button>
      )}
    </div>
  );
};

export default VisualPicker;
