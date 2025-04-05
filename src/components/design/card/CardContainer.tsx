
import { ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  onDragEnd: () => void;
}

const CardContainer = ({ children, onDragEnd }: CardContainerProps) => {
  return (
    <div 
      className="relative w-full max-w-md h-[400px] mb-4"
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchEnd={onDragEnd}
    >
      {children}
    </div>
  );
};

export default CardContainer;
