
import { useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesignOption } from "../VisualPicker";

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
  const cardRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing",
        getCardStyle()
      )}
      style={{ transform: `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)` }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <div className="h-[65%] overflow-hidden bg-muted">
        <img 
          src={option.imageUrl} 
          alt={option.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h4 className="text-lg font-semibold">{option.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{option.description}</p>
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
  );
};

export default DesignCard;
