
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, X, Heart, Sparkles, MousePointer } from "lucide-react";
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

interface AnimatedVisualPickerProps {
  options: DesignOption[];
  onSelect: (option: DesignOption) => void;
  category: DesignOption["category"];
  className?: string;
}

const AnimatedVisualPicker = ({ options, onSelect, category, className }: AnimatedVisualPickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"" | "left" | "right">("");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
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

  // Animation preview handlers
  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  // Demonstration UI for animation and interaction categories
  const renderPreviewDemo = () => {
    if (category === "animation") {
      // Simple animation demonstrations
      switch (currentOption.id) {
        case "animation-1": // Fade & Slide In
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full"/>
              <div className="w-full h-2 bg-gray-200 rounded-full"/>
              <div className="w-4/5 h-2 bg-gray-200 rounded-full"/>
            </motion.div>
          );
        case "animation-2": // Scroll Reveal
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"/>
              <div className="w-full h-2 bg-gray-200 rounded-full"/>
              <div className="w-4/5 h-2 bg-gray-200 rounded-full"/>
            </motion.div>
          );
        case "animation-3": // Parallax Effects
          return (
            <div className="relative h-full">
              <motion.div 
                initial={{ y: 20 }}
                animate={{ y: -20 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-x-0 top-0 bg-indigo-100 h-16 rounded-t-lg"
              />
              <motion.div 
                initial={{ y: 10 }}
                animate={{ y: -10 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                className="absolute inset-x-8 top-8 bg-white p-4 rounded-lg shadow-lg z-10"
              >
                <div className="w-full h-2 bg-gray-200 rounded-full mb-2"/>
                <div className="w-3/4 h-2 bg-gray-200 rounded-full"/>
              </motion.div>
            </div>
          );
        case "animation-4": // 3D Transforms
          return (
            <motion.div 
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ perspective: 1000 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg"
            />
          );
        case "animation-5": // Microinteractions
          return (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md"
            >
              Hover Me
            </motion.button>
          );
        default:
          return (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-lg flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-gray-400" />
            </div>
          );
      }
    } else if (category === "interaction") {
      // Simple interaction demonstrations
      switch (currentOption.id) {
        case "interaction-1": // Hover Effects
          return (
            <motion.div 
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
              }}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 w-full"
            >
              <div className="w-full h-3 bg-gray-200 rounded-full"/>
              <div className="w-4/5 h-3 bg-gray-200 rounded-full"/>
              <p className="text-xs text-gray-400 mt-2 text-center">Hover me</p>
            </motion.div>
          );
        case "interaction-2": // Modal Dialogs
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePreview();
                }}
              >
                Open Modal
              </Button>
              
              <AnimatePresence>
                {isPreviewVisible && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPreviewVisible(false);
                    }}
                  >
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      transition={{ type: "spring", damping: 25 }}
                      className="bg-white p-3 rounded-lg shadow-lg w-4/5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-full h-2 bg-gray-200 rounded-full mb-2"/>
                      <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-3"/>
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPreviewVisible(false);
                          }}
                        >
                          Close
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        case "interaction-3": // Custom Cursors
          return (
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ x: [-10, 10], y: [-5, 5] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white"
              >
                <MousePointer className="h-4 w-4" />
              </motion.div>
              <p className="text-xs text-gray-500">Custom cursor follow effect</p>
            </div>
          );
        case "interaction-4": // Scroll Animations
          return (
            <div className="w-full flex flex-col gap-2 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-4 bg-gray-200 rounded-full"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-4/5 h-4 bg-gray-200 rounded-full"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-3/5 h-4 bg-gray-200 rounded-full"
              />
              <p className="text-xs text-gray-400 mt-2">Scroll reveal elements</p>
            </div>
          );
        case "interaction-5": // Drag Interactions
          return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-full h-full flex items-center justify-center">
              <motion.div 
                drag
                dragConstraints={{
                  top: -20,
                  left: -20,
                  right: 20,
                  bottom: 20,
                }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs cursor-grab active:cursor-grabbing"
              >
                Drag me
              </motion.div>
            </div>
          );
        default:
          return (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-lg flex items-center justify-center">
              <MousePointer className="h-10 w-10 text-gray-400" />
            </div>
          );
      }
    }
    
    // Default preview for other categories
    return null;
  };

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
      // End of options
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
      
      <div 
        className="relative w-full max-w-md h-[400px] mb-4"
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchEnd={handleDragEnd}
      >
        <AnimatePresence>
          <motion.div
            ref={cardRef}
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            whileTap={{ scale: 0.95 }}
          >
            <div className="h-[65%] overflow-hidden bg-muted relative">
              {/* Special visual preview for animation and interaction categories */}
              {(category === "animation" || category === "interaction") ? (
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
                  <Heart className="h-5 w-5 fill-white" />
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
      </div>
      
      <div className="flex items-center gap-4">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 bg-red-100 hover:bg-red-200 border-red-200"
            onClick={handleDislike}
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 bg-green-100 hover:bg-green-200 border-green-200"
            onClick={handleLike}
          >
            <Check className="h-6 w-6 text-green-500" />
          </Button>
        </motion.div>
      </div>
      
      {currentIndex === filteredOptions.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={restartSwiping}
            className="mt-4"
          >
            See options again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedVisualPicker;
