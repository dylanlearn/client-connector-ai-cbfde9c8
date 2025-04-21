
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CheckIcon, XIcon, RefreshCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DesignOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography?: {
    headings: string;
    body: string;
  };
  layoutStyle?: string;
  toneDescriptor?: string;
}

interface AnimatedVisualPickerProps {
  options: DesignOption[];
  onSelect: (option: DesignOption) => void;
  category: DesignOption["category"];
  className?: string;
}

const AnimatedVisualPicker: React.FC<AnimatedVisualPickerProps> = ({ 
  options, 
  onSelect, 
  category, 
  className 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"" | "left" | "right">("");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

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
                          style={{ backgroundColor: color }}
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
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-red-100 hover:bg-red-200 border-red-200"
          onClick={handleDislike}
        >
          <ThumbsDown className="h-5 w-5 text-red-500" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-10 h-10"
          onClick={restartSwiping}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-green-100 hover:bg-green-200 border-green-200"
          onClick={handleLike}
        >
          <ThumbsUp className="h-5 w-5 text-green-500" />
        </Button>
      </div>
    </div>
  );
};

export default AnimatedVisualPicker;
