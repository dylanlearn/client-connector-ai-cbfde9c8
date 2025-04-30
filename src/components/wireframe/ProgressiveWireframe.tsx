
import React, { useRef, useEffect } from 'react';
import { useProgressiveLoading } from '@/hooks/useProgressiveLoading';
import { WireframeData, WireframeSection } from '@/types/wireframe';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressiveWireframeProps {
  wireframe: WireframeData;
  className?: string;
  renderSection: (section: WireframeSection, index: number) => React.ReactNode;
}

const ProgressiveWireframe = ({
  wireframe,
  className,
  renderSection
}: ProgressiveWireframeProps) => {
  if (!wireframe || !wireframe.sections) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No wireframe data available</p>
      </div>
    );
  }

  const { 
    isVisible, 
    registerElement, 
    registerSentinel,
    loading 
  } = useProgressiveLoading({
    wireframeId: wireframe.id,
    elements: wireframe.sections
  });

  // Render a section or a skeleton placeholder
  const renderProgressiveSection = (section: WireframeSection, index: number) => {
    const sectionVisible = isVisible(section.id);
    
    return (
      <div 
        key={section.id || `section-${index}`}
        ref={(el) => registerElement(section.id, el)}
        className={cn(
          "transition-opacity duration-300",
          sectionVisible ? "opacity-100" : "opacity-0"
        )}
      >
        {sectionVisible ? (
          renderSection(section, index)
        ) : (
          <Skeleton className="w-full h-64" />
        )}
      </div>
    );
  };

  return (
    <div className={cn("progressive-wireframe", className)}>
      {/* Render sections */}
      {wireframe.sections.map((section, index) => 
        renderProgressiveSection(section, index)
      )}
      
      {/* Sentinel element to trigger loading more content */}
      <div 
        ref={registerSentinel} 
        className="sentinel h-1 w-full"
      />
    </div>
  );
};

export default ProgressiveWireframe;
