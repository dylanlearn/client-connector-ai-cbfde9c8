
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import ComponentRenderer from './renderers/ComponentRenderer';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface WireframeDataVisualizerProps {
  wireframeData: WireframeData;
  viewMode?: 'preview' | 'flowchart';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  darkMode?: boolean;
  showGrid?: boolean;
  highlightSections?: boolean;
  activeSection?: string | null;
  isDraggable?: boolean; // New prop to control if sections can be dragged
  onDragEnd?: (result: DropResult) => void; // New prop for drag-and-drop callback
}

export const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  viewMode = 'preview',
  deviceType = 'desktop',
  darkMode = false,
  showGrid = false,
  highlightSections = false,
  activeSection = null,
  isDraggable = false,
  onDragEnd
}) => {
  // Add device-specific width constraints
  const deviceWidthClass = () => {
    switch (deviceType) {
      case 'mobile':
        return 'max-w-[375px] mx-auto';
      case 'tablet':
        return 'max-w-[768px] mx-auto';
      default:
        return 'w-full';
    }
  };

  // Handle sections with no grid
  if (!wireframeData.sections || wireframeData.sections.length === 0) {
    return (
      <div className={cn(
        "w-full min-h-[200px] flex items-center justify-center", 
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-600'
      )}>
        <p>No sections available</p>
      </div>
    );
  }

  // Render sections without drag-and-drop
  if (!isDraggable) {
    return (
      <div className={cn(
        deviceWidthClass(),
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-600'
      )}>
        {wireframeData.sections.map((section, index) => (
          <div 
            key={section.id}
            className={cn(
              'relative transition-all duration-200',
              showGrid ? 'border border-dashed border-gray-300 my-2' : '',
              highlightSections ? 'hover:outline hover:outline-blue-300' : '',
              activeSection === section.id ? 'outline outline-blue-500' : ''
            )}
          >
            <ComponentRenderer 
              section={section} 
              viewMode={viewMode} 
              darkMode={darkMode} 
            />
          </div>
        ))}
      </div>
    );
  }

  // Render sections with drag-and-drop
  return (
    <div className={cn(
      deviceWidthClass(),
      darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-600'
    )}>
      <Droppable droppableId="wireframe-sections">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-1"
          >
            {wireframeData.sections.map((section, index) => (
              <Draggable key={section.id} draggableId={section.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      'relative transition-all duration-200 group',
                      showGrid ? 'border border-dashed border-gray-300 my-2' : '',
                      highlightSections ? 'hover:outline hover:outline-blue-300' : '',
                      activeSection === section.id ? 'outline outline-blue-500' : ''
                    )}
                  >
                    {/* Drag handle */}
                    <div 
                      {...provided.dragHandleProps}
                      className="absolute top-0 left-0 z-10 p-2 bg-white bg-opacity-80 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <GripVertical className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    <ComponentRenderer 
                      section={section} 
                      viewMode={viewMode} 
                      darkMode={darkMode} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default WireframeDataVisualizer;
