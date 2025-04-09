
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

  // Function to handle section click that will be passed to children
  const handleSectionClick = (sectionId: string) => {
    selectSection(sectionId);
    
    // Call the external onSectionClick handler if provided
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

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
          // Pass handleSectionClick to Wireframe children
          if (React.isValidElement(child)) {
            // Clone the element with the additional prop
            return React.cloneElement(child, {
              onSectionClick: handleSectionClick
            } as {});
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default WireframeCanvas;
