
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useWireframeStore } from '@/stores/wireframe-store';
import { useSectionManipulation } from '@/hooks/wireframe/use-section-manipulation';

interface WireframeCanvasProps {
  children: React.ReactNode;
  className?: string;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  editable?: boolean;
  darkMode?: boolean;
  onSectionClick?: (sectionId: string) => void;
}

const WireframeCanvas: React.FC<WireframeCanvasProps> = ({ 
  children,
  className,
  deviceType = 'desktop',
  editable = true,
  darkMode = false,
  onSectionClick
}) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const { 
    activeSection, 
    draggingSection, 
    resizingSection,
    selectSection, 
    stopManipulation 
  } = useSectionManipulation();

  // Handle canvas click (deselect active section)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectSection(null);
    }
  };

  // Handle canvas mouseup (stop any manipulation)
  const handleCanvasMouseUp = () => {
    if (draggingSection || resizingSection) {
      stopManipulation();
    }
  };

  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    selectSection(sectionId);
    
    // If a callback was provided for section clicks, call it
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  // Update canvas size on mount and window resize
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight - 100 // Adjust height to account for headers
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div
      className={cn(
        "wireframe-canvas relative overflow-hidden border rounded-lg transition-colors",
        darkMode ? "bg-gray-900 dark" : "bg-white",
        {
          "cursor-not-allowed": !editable,
          "max-w-3xl mx-auto": deviceType === 'tablet',
          "max-w-sm mx-auto": deviceType === 'mobile',
        },
        className
      )}
      style={{
        height: canvasSize.height,
        minHeight: '300px'
      }}
      onClick={handleCanvasClick}
      onMouseUp={handleCanvasMouseUp}
    >
      <div 
        className="wireframe-content relative"
        onClick={(e) => {
          // Prevent propagation to allow section click handling
          e.stopPropagation();
        }}
      >
        {React.Children.map(children, child => {
          // Pass handleSectionClick to wireframe children
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onSectionClick: handleSectionClick
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default WireframeCanvas;
