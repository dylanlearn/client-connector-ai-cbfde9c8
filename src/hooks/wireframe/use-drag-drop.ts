
import { useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { WireframeComponent } from '@/types/wireframe-component';
import { useToast } from '@/hooks/use-toast';

interface DragDropState {
  isDragging: boolean;
  draggedComponent: WireframeComponent | null;
  dragStartPosition: { x: number, y: number } | null;
}

/**
 * Hook to manage drag and drop functionality for canvas components
 */
export function useDragDrop(canvas: fabric.Canvas | null) {
  const { toast } = useToast();
  const [dragState, setDragState] = useState<DragDropState>({
    isDragging: false,
    draggedComponent: null,
    dragStartPosition: null
  });

  /**
   * Start dragging a component
   */
  const startDrag = useCallback((component: WireframeComponent, position: { x: number, y: number }) => {
    setDragState({
      isDragging: true,
      draggedComponent: component,
      dragStartPosition: position
    });
    
    // Show dragging indicator
    if (canvas) {
      canvas.defaultCursor = 'move';
    }
    
    return true;
  }, [canvas]);

  /**
   * Update the current drag operation
   */
  const updateDrag = useCallback((position: { x: number, y: number }) => {
    if (!dragState.isDragging || !dragState.draggedComponent) return false;
    
    setDragState(prev => ({
      ...prev,
      dragStartPosition: position
    }));
    
    return true;
  }, [dragState.isDragging, dragState.draggedComponent]);
  
  /**
   * Complete the drag operation
   */
  const endDrag = useCallback((dropPosition: { x: number, y: number }, targetCanvas?: fabric.Canvas) => {
    const { draggedComponent } = dragState;
    
    if (!draggedComponent) {
      setDragState({
        isDragging: false,
        draggedComponent: null,
        dragStartPosition: null
      });
      return false;
    }
    
    // Reset canvas cursor
    if (canvas) {
      canvas.defaultCursor = 'default';
    }
    
    // Successful drop
    const canvasToUse = targetCanvas || canvas;
    if (canvasToUse) {
      try {
        // Create a fabric object based on component type
        const componentObject = createFabricObjectFromComponent(draggedComponent, dropPosition);
        
        if (componentObject) {
          canvasToUse.add(componentObject);
          canvasToUse.setActiveObject(componentObject);
          canvasToUse.renderAll();
          
          toast({
            title: "Component Added",
            description: `Added ${draggedComponent.type} to canvas`
          });
        }
      } catch (error) {
        console.error("Error dropping component:", error);
        toast({
          title: "Error",
          description: "Failed to add component to canvas",
          variant: "destructive"
        });
      }
    }
    
    // Reset drag state
    setDragState({
      isDragging: false,
      draggedComponent: null,
      dragStartPosition: null
    });
    
    return true;
  }, [canvas, dragState, toast]);

  /**
   * Cancel the current drag operation
   */
  const cancelDrag = useCallback(() => {
    if (canvas) {
      canvas.defaultCursor = 'default';
    }
    
    setDragState({
      isDragging: false,
      draggedComponent: null,
      dragStartPosition: null
    });
  }, [canvas]);

  return {
    isDragging: dragState.isDragging,
    draggedComponent: dragState.draggedComponent,
    dragStartPosition: dragState.dragStartPosition,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag
  };
}

// Helper function to create a Fabric.js object from a component
function createFabricObjectFromComponent(component: WireframeComponent, position: { x: number, y: number }) {
  const { type, size, props = {} } = component;
  let obj;
  
  // Common properties
  const commonProps = {
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    data: {
      id: `component-${uuidv4()}`,
      name: props.name || `${type} ${Date.now().toString().slice(-4)}`,
      componentType: type,
      ...props
    }
  };
  
  // Create specific objects based on type
  switch (type) {
    case 'rectangle':
    case 'box':
      obj = new fabric.Rect({
        ...commonProps,
        fill: props.fill || '#e2e8f0',
        stroke: props.stroke || '#94a3b8',
        strokeWidth: props.strokeWidth || 1,
        rx: props.borderRadius || 0,
        ry: props.borderRadius || 0
      });
      break;
    
    case 'text':
      obj = new fabric.Textbox(props.text || 'Text', {
        ...commonProps,
        fill: props.fill || '#000000',
        fontFamily: props.fontFamily || 'Arial',
        fontSize: props.fontSize || 16,
        fontWeight: props.fontWeight || 'normal',
        textAlign: props.textAlign || 'left'
      });
      break;
    
    case 'image':
      // For images, we need to create an Image object first
      // This is a placeholder for the actual implementation
      obj = new fabric.Rect({
        ...commonProps,
        fill: '#f0f0f0',
        stroke: '#d0d0d0',
        strokeWidth: 1
      });
      break;
    
    case 'circle':
      obj = new fabric.Circle({
        left: position.x,
        top: position.y,
        radius: Math.min(size.width, size.height) / 2,
        fill: props.fill || '#e2e8f0',
        stroke: props.stroke || '#94a3b8',
        strokeWidth: props.strokeWidth || 1,
        data: commonProps.data
      });
      break;
    
    case 'path':
      if (props.path) {
        obj = new fabric.Path(props.path, {
          ...commonProps,
          fill: props.fill || 'transparent',
          stroke: props.stroke || '#000000',
          strokeWidth: props.strokeWidth || 2
        });
      }
      break;
    
    default:
      // Default to a simple rect if type is not recognized
      obj = new fabric.Rect({
        ...commonProps,
        fill: '#e0e0e0',
        stroke: '#a0a0a0',
        strokeWidth: 1
      });
  }
  
  return obj;
}
