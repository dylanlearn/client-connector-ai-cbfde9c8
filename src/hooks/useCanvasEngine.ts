
import { useState, useCallback, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig, AlignmentGuide, GridGuideline } from '@/components/wireframe/utils/types';
import { generateSnapGuidelines } from '@/components/wireframe/utils/grid-utils';

export interface UseCanvasEngineOptions {
  width?: number;
  height?: number;
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  snapToEdges?: boolean;
  snapToElements?: boolean;
}

export interface WireframeComponent {
  id: string;
  type: 'box' | 'text' | 'image' | 'group' | string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  rotation?: number;
  resizeStrategy?: 'fixed' | 'auto-height' | 'stretch-children';
  children?: WireframeComponent[];
  props?: Record<string, any>;
}

export function useCanvasEngine(options: UseCanvasEngineOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [components, setComponents] = useState<WireframeComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<WireframeComponent | null>(null);
  const [guidelines, setGuidelines] = useState<GridGuideline[]>([]);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  // Default config based on options or sensible defaults
  const config = {
    width: options.width || 1200,
    height: options.height || 800,
    showGrid: options.showGrid !== undefined ? options.showGrid : true,
    snapToGrid: options.snapToGrid !== undefined ? options.snapToGrid : true,
    gridSize: options.gridSize || 10,
    snapToEdges: options.snapToEdges !== undefined ? options.snapToEdges : true,
    snapToElements: options.snapToElements !== undefined ? options.snapToElements : true,
  };

  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: config.width,
      height: config.height,
      backgroundColor: '#ffffff',
      selection: true
    });
    
    // Set up event handlers
    fabricCanvas.on('object:moving', handleObjectMoving);
    fabricCanvas.on('object:scaling', handleObjectScaling);
    fabricCanvas.on('object:rotating', handleObjectRotating);
    fabricCanvas.on('selection:created', handleSelectionCreated);
    fabricCanvas.on('selection:cleared', handleSelectionCleared);
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
    setCanvas(fabricCanvas);
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [config.width, config.height]);

  // Handle object moving with snapping
  const handleObjectMoving = useCallback((e: fabric.IEvent<MouseEvent>) => {
    if (!canvas || !e.target) return;
    
    const target = e.target;
    setIsDragging(true);
    
    // Grid snapping
    if (config.snapToGrid) {
      const gridSize = config.gridSize;
      target.set({
        left: Math.round(target.left! / gridSize) * gridSize,
        top: Math.round(target.top! / gridSize) * gridSize
      });
    }
    
    // Edge snapping
    if (config.snapToEdges && canvas) {
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const objectWidth = target.getScaledWidth();
      const objectHeight = target.getScaledHeight();
      const snapThreshold = 10; // Pixels to snap within
      
      // Snap to canvas edges
      if (Math.abs(target.left!) < snapThreshold) {
        target.set({ left: 0 });
      }
      
      if (Math.abs(target.top!) < snapThreshold) {
        target.set({ top: 0 });
      }
      
      if (Math.abs(target.left! + objectWidth - canvasWidth) < snapThreshold) {
        target.set({ left: canvasWidth - objectWidth });
      }
      
      if (Math.abs(target.top! + objectHeight - canvasHeight) < snapThreshold) {
        target.set({ top: canvasHeight - objectHeight });
      }
    }
    
    // Element snapping
    if (config.snapToElements && canvas) {
      const allObjects = canvas.getObjects().filter(obj => obj !== target);
      const newGuidelines = generateSnapGuidelines(allObjects, target, 10);
      setGuidelines(newGuidelines);
    }
    
  }, [canvas, config.snapToGrid, config.snapToEdges, config.snapToElements, config.gridSize]);
  
  // Handle object scaling
  const handleObjectScaling = useCallback((e: fabric.IEvent<MouseEvent>) => {
    // Implementation of content-aware resizing based on resizeStrategy
    if (!e.target) return;
    
    // Get component metadata from the fabric object
    const targetComponent = components.find(comp => comp.id === e.target?.data?.id);
    
    if (targetComponent && targetComponent.resizeStrategy) {
      switch (targetComponent.resizeStrategy) {
        case 'auto-height':
          // Maintain height based on content (useful for text)
          break;
        case 'stretch-children':
          // Resize all children proportionally
          break;
        case 'fixed':
        default:
          // Default fabric behavior (no special handling)
          break;
      }
    }
  }, [components]);
  
  // Handle object rotating
  const handleObjectRotating = useCallback((e: fabric.IEvent<MouseEvent>) => {
    // Snapping to common angles (0, 45, 90, etc.)
    if (!e.target) return;
    
    const target = e.target;
    const angle = target.angle || 0;
    const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    const snapThreshold = 5;
    
    for (const snapAngle of snapAngles) {
      if (Math.abs(angle % 360 - snapAngle) < snapThreshold || 
          Math.abs((angle % 360) - 360 - snapAngle) < snapThreshold) {
        target.set({ angle: snapAngle });
        break;
      }
    }
  }, []);
  
  // Handle selection created
  const handleSelectionCreated = useCallback((e: fabric.IEvent<MouseEvent>) => {
    if (!e.selected || e.selected.length === 0) return;
    
    const selectedObject = e.selected[0];
    const componentId = selectedObject.data?.id;
    
    if (componentId) {
      const selectedComp = components.find(comp => comp.id === componentId);
      if (selectedComp) {
        setSelectedComponent(selectedComp);
      }
    }
  }, [components]);
  
  // Handle selection cleared
  const handleSelectionCleared = useCallback(() => {
    setSelectedComponent(null);
  }, []);
  
  // Handle mouse down
  const handleMouseDown = useCallback(() => {
    // Implementation for tracking drag start, etc.
  }, []);
  
  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setGuidelines([]);
  }, []);
  
  // Add component
  const addComponent = useCallback((component: WireframeComponent) => {
    setComponents(prev => [...prev, component]);
    
    // We'd also add the component to the fabric canvas here
    if (canvas) {
      // Convert WireframeComponent to fabric.Object
      // This would be much more complex in a real implementation
      const options = {
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height,
        data: { id: component.id, type: component.type, ...component.props }
      };
      
      let fabricObject;
      
      switch (component.type) {
        case 'box':
          fabricObject = new fabric.Rect({
            ...options,
            fill: component.props?.backgroundColor || '#f0f0f0',
            stroke: component.props?.borderColor || '#cccccc',
            strokeWidth: component.props?.borderWidth || 1
          });
          break;
        case 'text':
          fabricObject = new fabric.Textbox(component.props?.text || 'Text', {
            ...options,
            fontSize: component.props?.fontSize || 16,
            fontFamily: component.props?.fontFamily || 'Arial',
            fill: component.props?.color || '#000000'
          });
          break;
        case 'image':
          // For images, we'd load the image first, then create fabric.Image
          fabric.Image.fromURL(component.props?.src || '', (img) => {
            img.set({
              ...options,
              scaleX: component.size.width / img.width!,
              scaleY: component.size.height / img.height!
            });
            canvas.add(img);
            canvas.renderAll();
          });
          return; // Early return since image loading is async
        case 'group':
          // For groups, we'd recursively create child components
          // This is simplified and would need more implementation
          fabricObject = new fabric.Group([], options);
          break;
        default:
          fabricObject = new fabric.Rect({
            ...options,
            fill: '#f0f0f0'
          });
      }
      
      if (fabricObject) {
        canvas.add(fabricObject);
        canvas.renderAll();
      }
    }
  }, [canvas]);
  
  // Remove component
  const removeComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    
    // Remove from fabric canvas
    if (canvas) {
      const objectToRemove = canvas.getObjects().find(obj => obj.data?.id === id);
      if (objectToRemove) {
        canvas.remove(objectToRemove);
        canvas.renderAll();
      }
    }
  }, [canvas]);
  
  // Group components
  const groupComponents = useCallback((componentIds: string[], groupName: string) => {
    if (!canvas || componentIds.length < 2) return;
    
    const componentsToGroup = components.filter(comp => componentIds.includes(comp.id));
    
    // Create a new group component
    const groupBounds = calculateGroupBounds(componentsToGroup);
    
    const groupComponent: WireframeComponent = {
      id: `group-${Date.now()}`,
      type: 'group',
      position: { x: groupBounds.left, y: groupBounds.top },
      size: { width: groupBounds.width, height: groupBounds.height },
      zIndex: Math.max(...componentsToGroup.map(c => c.zIndex)) + 1,
      children: componentsToGroup,
      props: { name: groupName }
    };
    
    // Add the group and remove individual components
    setComponents(prev => {
      return [
        ...prev.filter(comp => !componentIds.includes(comp.id)),
        groupComponent
      ];
    });
    
    // Update fabric canvas (simplified version)
    const objectsToGroup = canvas.getObjects().filter(obj => 
      obj.data?.id && componentIds.includes(obj.data.id)
    );
    
    if (objectsToGroup.length > 0) {
      const group = new fabric.Group(objectsToGroup, {
        left: groupBounds.left,
        top: groupBounds.top,
        data: { 
          id: groupComponent.id,
          type: 'group',
          name: groupName
        }
      });
      
      // Remove individual objects and add group
      objectsToGroup.forEach(obj => canvas.remove(obj));
      canvas.add(group);
      canvas.renderAll();
    }
  }, [canvas, components]);
  
  // Helper function to calculate group bounds
  const calculateGroupBounds = (comps: WireframeComponent[]) => {
    if (comps.length === 0) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }
    
    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;
    
    comps.forEach(comp => {
      minLeft = Math.min(minLeft, comp.position.x);
      minTop = Math.min(minTop, comp.position.y);
      maxRight = Math.max(maxRight, comp.position.x + comp.size.width);
      maxBottom = Math.max(maxBottom, comp.position.y + comp.size.height);
    });
    
    return {
      left: minLeft,
      top: minTop,
      width: maxRight - minLeft,
      height: maxBottom - minTop
    };
  };
  
  // Initialize the canvas on mount
  useEffect(() => {
    const cleanupFn = initializeCanvas();
    return cleanupFn;
  }, [initializeCanvas]);
  
  // Return the hook's API
  return {
    canvasRef,
    canvas,
    components,
    selectedComponent,
    guidelines,
    zoom,
    isDragging,
    addComponent,
    removeComponent,
    groupComponents,
    setZoom
  };
}

export default useCanvasEngine;
