
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
  }, [dragState, canvas, toast]);

  /**
   * Cancel the current drag operation
   */
  const cancelDrag = useCallback(() => {
    // Reset canvas cursor
    if (canvas) {
      canvas.defaultCursor = 'default';
    }
    
    setDragState({
      isDragging: false,
      draggedComponent: null,
      dragStartPosition: null
    });
    
    return true;
  }, [canvas]);
  
  return {
    ...dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag
  };
}

/**
 * Helper function to create a fabric object from a wireframe component
 */
function createFabricObjectFromComponent(
  component: WireframeComponent, 
  position: { x: number, y: number }
): fabric.Object | null {
  const { type } = component;
  
  // Basic properties all objects will have
  const commonProps = {
    left: position.x,
    top: position.y,
    width: component.size.width,
    height: component.size.height,
    originX: 'left',
    originY: 'top',
    data: {
      id: component.id || uuidv4(),
      type: component.type,
      componentData: component
    }
  };
  
  switch (type.toLowerCase()) {
    case 'box':
    case 'container':
    case 'section':
      return new fabric.Rect({
        ...commonProps,
        fill: component.props?.backgroundColor || 'rgba(200, 200, 200, 0.3)',
        stroke: '#cccccc',
        strokeWidth: 1,
        rx: 4,
        ry: 4
      });
      
    case 'text':
      return new fabric.Textbox(component.props?.text || 'Text', {
        ...commonProps,
        fill: component.props?.color || '#000000',
        fontFamily: component.props?.fontFamily || 'Arial',
        fontSize: component.props?.fontSize || 16
      });
      
    case 'image':
      // Create a placeholder rectangle until image loads
      const rect = new fabric.Rect({
        ...commonProps,
        fill: 'rgba(200, 200, 200, 0.3)',
        stroke: '#cccccc',
        strokeWidth: 1
      });
      
      // If we have an image URL, load it
      if (component.props?.src) {
        fabric.Image.fromURL(component.props.src, (img) => {
          img.set({
            ...commonProps,
            scaleX: commonProps.width / img.width,
            scaleY: commonProps.height / img.height
          });
          
          // Replace the placeholder with the actual image
          if (rect.canvas) {
            const canvas = rect.canvas;
            canvas.remove(rect);
            canvas.add(img);
            canvas.renderAll();
          }
        });
      }
      
      return rect;
      
    case 'button':
      const buttonBg = new fabric.Rect({
        width: component.size.width,
        height: component.size.height,
        fill: component.props?.backgroundColor || '#3b82f6',
        rx: 4,
        ry: 4
      });
      
      const buttonText = new fabric.Text(
        component.props?.text || 'Button',
        {
          fontSize: component.props?.fontSize || 14,
          fill: component.props?.color || '#ffffff',
          fontFamily: component.props?.fontFamily || 'Arial',
          originX: 'center',
          originY: 'center',
          left: component.size.width / 2,
          top: component.size.height / 2
        }
      );
      
      return new fabric.Group([buttonBg, buttonText], {
        ...commonProps
      });
      
    default:
      // Generic placeholder for unsupported component types
      return new fabric.Rect({
        ...commonProps,
        fill: 'rgba(200, 200, 200, 0.3)',
        stroke: '#cccccc',
        strokeWidth: 1,
        rx: 4,
        ry: 4
      });
  }
}
