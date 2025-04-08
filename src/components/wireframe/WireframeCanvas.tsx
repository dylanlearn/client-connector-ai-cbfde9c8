
import React from 'react';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeDataVisualizer } from '@/components/wireframe';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Layout, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

interface WireframeCanvasProps {
  projectId?: string;
  className?: string;
}

const WireframeCanvas: React.FC<WireframeCanvasProps> = ({ projectId, className }) => {
  const wireframe = useWireframeStore((state) => state.wireframe);
  const activeDevice = useWireframeStore((state) => state.activeDevice);
  const darkMode = useWireframeStore((state) => state.darkMode);
  const showGrid = useWireframeStore((state) => state.showGrid);
  const highlightSections = useWireframeStore((state) => state.highlightSections);
  const activeSection = useWireframeStore((state) => state.activeSection);
  const hiddenSections = useWireframeStore((state) => state.hiddenSections);
  const showAllSections = useWireframeStore((state) => state.showAllSections);
  const reorderSections = useWireframeStore((state) => state.reorderSections);
  
  // Filter out hidden sections for display
  const visibleSections = wireframe.sections
    ? wireframe.sections.filter(section => !hiddenSections.includes(section.id))
    : [];
  
  // Create a new wireframe object with only visible sections
  const visibleWireframe = {
    ...wireframe,
    sections: visibleSections
  };

  // Determine if all sections are hidden
  const allSectionsHidden = wireframe.sections && 
    wireframe.sections.length > 0 && 
    hiddenSections.length === wireframe.sections.length;

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) return;
    
    // Find the actual indices in the original sections array
    const allSectionIds = wireframe.sections.map(section => section.id);
    const visibleSectionIds = visibleSections.map(section => section.id);
    
    const fromIndex = allSectionIds.indexOf(visibleSectionIds[result.source.index]);
    const toIndex = allSectionIds.indexOf(visibleSectionIds[result.destination.index]);
    
    // Reorder sections using the store method
    reorderSections(fromIndex, toIndex);
  };
  
  if (!wireframe) {
    return (
      <Card className={cn("border rounded-lg p-4 relative min-h-80", className)}>
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </Card>
    );
  }

  if (wireframe.sections.length === 0) {
    return (
      <Card className={cn("border rounded-lg p-4 relative min-h-80", className)}>
        <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
          <Layout className="h-16 w-16 text-gray-300" />
          <div>
            <h3 className="text-lg font-medium mb-1">Empty Wireframe</h3>
            <p className="text-muted-foreground max-w-md">
              Add sections using the controls to create your wireframe.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (allSectionsHidden) {
    return (
      <div className={cn("border rounded-lg p-4 relative min-h-80", className)}>
        <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
          <EyeOff className="h-16 w-16 text-gray-300" />
          <div>
            <h3 className="text-lg font-medium mb-1">All Sections Hidden</h3>
            <p className="text-muted-foreground max-w-md">
              All sections are currently hidden from view.
            </p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={showAllSections}
            >
              <Eye className="h-4 w-4 mr-2" />
              Show All Sections
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg p-4 relative min-h-80", className)}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <WireframeDataVisualizer 
          wireframeData={{
            ...visibleWireframe,
            id: visibleWireframe.id || `wireframe-${Date.now()}` // Ensure ID exists
          }}
          viewMode="preview"
          deviceType={activeDevice}
          darkMode={darkMode}
          showGrid={showGrid}
          highlightSections={highlightSections}
          activeSection={activeSection}
          isDraggable={true} // New prop to enable drag-and-drop in the visualizer
        />
      </DragDropContext>
    </div>
  );
};

export default WireframeCanvas;
