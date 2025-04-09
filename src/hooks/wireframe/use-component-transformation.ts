
import { useState, useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { WireframeSection } from '@/types/wireframe';

interface TransformationState {
  isTransforming: boolean;
  transformationType: 'move' | 'resize' | 'rotate' | 'skew' | null;
  activeObjectId: string | null;
  startPoint: { x: number; y: number } | null;
  originalProps: any | null;
}

interface TransformationResult {
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
  rotation?: number;
  skew?: { x: number; y: number };
}

export function useComponentTransformation(canvas: fabric.Canvas | null) {
  const [state, setState] = useState<TransformationState>({
    isTransforming: false,
    transformationType: null,
    activeObjectId: null,
    startPoint: null,
    originalProps: null
  });
  
  // Store the transformation history for undo/redo
  const historyRef = useRef<{
    past: TransformationResult[],
    future: TransformationResult[]
  }>({
    past: [],
    future: []
  });
  
  // Start moving a component
  const startMove = useCallback((objectId: string, x: number, y: number) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
    if (!object) return;
    
    setState({
      isTransforming: true,
      transformationType: 'move',
      activeObjectId: objectId,
      startPoint: { x, y },
      originalProps: {
        left: object.left,
        top: object.top
      }
    });
    
    canvas.setActiveObject(object);
    canvas.renderAll();
  }, [canvas]);
  
  // Move the active component
  const move = useCallback((x: number, y: number) => {
    if (!canvas || !state.isTransforming || state.transformationType !== 'move' || !state.startPoint) return;
    
    const object = canvas.getActiveObject();
    if (!object) return;
    
    const deltaX = x - state.startPoint.x;
    const deltaY = y - state.startPoint.y;
    
    object.set({
      left: state.originalProps.left + deltaX,
      top: state.originalProps.top + deltaY
    });
    
    object.setCoords();
    canvas.renderAll();
    
    return {
      position: {
        x: object.left as number,
        y: object.top as number
      }
    };
  }, [canvas, state]);
  
  // Start resizing a component
  const startResize = useCallback((objectId: string, x: number, y: number, direction: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
    if (!object) return;
    
    setState({
      isTransforming: true,
      transformationType: 'resize',
      activeObjectId: objectId,
      startPoint: { x, y },
      originalProps: {
        left: object.left,
        top: object.top,
        width: object.getScaledWidth(),
        height: object.getScaledHeight(),
        direction
      }
    });
    
    canvas.setActiveObject(object);
    canvas.renderAll();
  }, [canvas]);
  
  // Resize the active component
  const resize = useCallback((x: number, y: number) => {
    if (!canvas || !state.isTransforming || state.transformationType !== 'resize' || !state.startPoint) return;
    
    const object = canvas.getActiveObject();
    if (!object) return;
    
    const deltaX = x - state.startPoint.x;
    const deltaY = y - state.startPoint.y;
    const direction = state.originalProps.direction;
    
    const newProps: any = {};
    const result: TransformationResult = {
      dimensions: { 
        width: state.originalProps.width,
        height: state.originalProps.height 
      },
      position: {
        x: state.originalProps.left,
        y: state.originalProps.top
      }
    };
    
    // Handle different resize directions
    switch (direction) {
      case 'n': // North
        newProps.top = state.originalProps.top + deltaY;
        newProps.height = Math.max(20, state.originalProps.height - deltaY);
        break;
      case 'e': // East
        newProps.width = Math.max(20, state.originalProps.width + deltaX);
        break;
      case 's': // South
        newProps.height = Math.max(20, state.originalProps.height + deltaY);
        break;
      case 'w': // West
        newProps.left = state.originalProps.left + deltaX;
        newProps.width = Math.max(20, state.originalProps.width - deltaX);
        break;
      case 'ne': // Northeast
        newProps.top = state.originalProps.top + deltaY;
        newProps.width = Math.max(20, state.originalProps.width + deltaX);
        newProps.height = Math.max(20, state.originalProps.height - deltaY);
        break;
      case 'se': // Southeast
        newProps.width = Math.max(20, state.originalProps.width + deltaX);
        newProps.height = Math.max(20, state.originalProps.height + deltaY);
        break;
      case 'sw': // Southwest
        newProps.left = state.originalProps.left + deltaX;
        newProps.width = Math.max(20, state.originalProps.width - deltaX);
        newProps.height = Math.max(20, state.originalProps.height + deltaY);
        break;
      case 'nw': // Northwest
        newProps.left = state.originalProps.left + deltaX;
        newProps.top = state.originalProps.top + deltaY;
        newProps.width = Math.max(20, state.originalProps.width - deltaX);
        newProps.height = Math.max(20, state.originalProps.height - deltaY);
        break;
    }
    
    // Apply the new properties
    object.set(newProps);
    object.setCoords();
    canvas.renderAll();
    
    // Update result
    if (newProps.width !== undefined) result.dimensions!.width = newProps.width;
    if (newProps.height !== undefined) result.dimensions!.height = newProps.height;
    if (newProps.left !== undefined) result.position!.x = newProps.left;
    if (newProps.top !== undefined) result.position!.y = newProps.top;
    
    return result;
  }, [canvas, state]);
  
  // Start rotating a component
  const startRotate = useCallback((objectId: string, x: number, y: number) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
    if (!object) return;
    
    // Get the object center point
    const centerX = object.left! + object.getScaledWidth() / 2;
    const centerY = object.top! + object.getScaledHeight() / 2;
    
    setState({
      isTransforming: true,
      transformationType: 'rotate',
      activeObjectId: objectId,
      startPoint: { x, y },
      originalProps: {
        angle: object.angle || 0,
        centerX,
        centerY,
        // Calculate the initial angle from center to mouse
        startAngle: Math.atan2(y - centerY, x - centerX) * (180 / Math.PI)
      }
    });
    
    canvas.setActiveObject(object);
    canvas.renderAll();
  }, [canvas]);
  
  // Rotate the active component
  const rotate = useCallback((x: number, y: number) => {
    if (!canvas || !state.isTransforming || state.transformationType !== 'rotate') return;
    
    const object = canvas.getActiveObject();
    if (!object) return;
    
    // Calculate the current angle from center to mouse
    const { centerX, centerY, startAngle, angle: startRotation } = state.originalProps;
    const currentAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    
    // Calculate the angle difference
    let angleDiff = currentAngle - startAngle;
    
    // Apply the new angle
    const newAngle = (startRotation + angleDiff) % 360;
    object.set('angle', newAngle);
    
    object.setCoords();
    canvas.renderAll();
    
    return {
      rotation: newAngle
    };
  }, [canvas, state]);
  
  // Start skewing a component
  const startSkew = useCallback((objectId: string, x: number, y: number, axis: 'x' | 'y') => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
    if (!object) return;
    
    setState({
      isTransforming: true,
      transformationType: 'skew',
      activeObjectId: objectId,
      startPoint: { x, y },
      originalProps: {
        skewX: object.skewX || 0,
        skewY: object.skewY || 0,
        axis
      }
    });
    
    canvas.setActiveObject(object);
    canvas.renderAll();
  }, [canvas]);
  
  // Skew the active component
  const skew = useCallback((x: number, y: number) => {
    if (!canvas || !state.isTransforming || state.transformationType !== 'skew' || !state.startPoint) return;
    
    const object = canvas.getActiveObject();
    if (!object) return;
    
    const deltaX = x - state.startPoint.x;
    const deltaY = y - state.startPoint.y;
    const axis = state.originalProps.axis;
    
    // Apply skew based on axis
    if (axis === 'x') {
      const newSkewX = state.originalProps.skewX + deltaX * 0.01;
      object.set('skewX', newSkewX);
    } else {
      const newSkewY = state.originalProps.skewY + deltaY * 0.01;
      object.set('skewY', newSkewY);
    }
    
    object.setCoords();
    canvas.renderAll();
    
    return {
      skew: {
        x: object.skewX || 0,
        y: object.skewY || 0
      }
    };
  }, [canvas, state]);
  
  // Finish any transformation
  const stopTransformation = useCallback(() => {
    if (!canvas || !state.isTransforming) return;
    
    const object = canvas.getActiveObject();
    if (object && state.activeObjectId) {
      // Save the transformation to history
      historyRef.current.past.push({
        position: {
          x: object.left as number,
          y: object.top as number
        },
        dimensions: {
          width: object.getScaledWidth(),
          height: object.getScaledHeight()
        },
        rotation: object.angle as number,
        skew: {
          x: object.skewX as number,
          y: object.skewY as number
        }
      });
      
      // Limit history size
      if (historyRef.current.past.length > 30) {
        historyRef.current.past.shift();
      }
      
      // Clear future history after a new transformation
      historyRef.current.future = [];
      
      // Create a custom event for object modified
      const event = new CustomEvent('object:transformed', {
        detail: {
          id: state.activeObjectId,
          type: state.transformationType,
          position: {
            x: object.left,
            y: object.top
          },
          dimensions: {
            width: object.getScaledWidth(),
            height: object.getScaledHeight()
          },
          rotation: object.angle,
          skew: {
            x: object.skewX,
            y: object.skewY
          }
        }
      });
      document.dispatchEvent(event);
    }
    
    setState({
      isTransforming: false,
      transformationType: null,
      activeObjectId: null,
      startPoint: null,
      originalProps: null
    });
  }, [canvas, state]);
  
  // Apply quick action to a component
  const applyQuickAction = useCallback((objectId: string, action: 'bringToFront' | 'sendToBack' | 'duplicate' | 'delete') => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
    if (!object) return;
    
    switch (action) {
      case 'bringToFront':
        object.bringToFront();
        break;
      case 'sendToBack':
        object.sendToBack();
        break;
      case 'duplicate':
        if (object.toObject) {
          object.clone((cloned: fabric.Object) => {
            cloned.set({
              left: (object.left || 0) + 20,
              top: (object.top || 0) + 20,
              data: {
                ...object.data,
                id: `${object.data.id}-copy-${Date.now()}`
              }
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();
            
            // Emit duplication event
            const event = new CustomEvent('object:duplicated', {
              detail: {
                originalId: object.data.id,
                newId: cloned.data.id,
                object: cloned
              }
            });
            document.dispatchEvent(event);
          });
        }
        break;
      case 'delete':
        canvas.remove(object);
        
        // Emit deletion event
        const event = new CustomEvent('object:deleted', {
          detail: {
            id: object.data.id
          }
        });
        document.dispatchEvent(event);
        break;
    }
    
    canvas.renderAll();
  }, [canvas]);
  
  // Undo the last transformation
  const undoTransformation = useCallback(() => {
    if (!canvas || historyRef.current.past.length === 0) return;
    
    const lastState = historyRef.current.past.pop();
    if (lastState && state.activeObjectId) {
      const object = canvas.getObjects().find(obj => obj.data?.id === state.activeObjectId);
      if (object) {
        historyRef.current.future.push({
          position: {
            x: object.left as number,
            y: object.top as number
          },
          dimensions: {
            width: object.getScaledWidth(),
            height: object.getScaledHeight()
          },
          rotation: object.angle as number,
          skew: {
            x: object.skewX as number,
            y: object.skewY as number
          }
        });
        
        // Apply the previous state
        if (lastState.position) {
          object.set({
            left: lastState.position.x,
            top: lastState.position.y
          });
        }
        
        if (lastState.dimensions) {
          object.set({
            scaleX: lastState.dimensions.width / object.width!,
            scaleY: lastState.dimensions.height / object.height!
          });
        }
        
        if (lastState.rotation !== undefined) {
          object.set('angle', lastState.rotation);
        }
        
        if (lastState.skew) {
          object.set({
            skewX: lastState.skew.x,
            skewY: lastState.skew.y
          });
        }
        
        object.setCoords();
        canvas.renderAll();
      }
    }
  }, [canvas, state.activeObjectId]);
  
  // Redo a previously undone transformation
  const redoTransformation = useCallback(() => {
    if (!canvas || historyRef.current.future.length === 0) return;
    
    const nextState = historyRef.current.future.pop();
    if (nextState && state.activeObjectId) {
      const object = canvas.getObjects().find(obj => obj.data?.id === state.activeObjectId);
      if (object) {
        historyRef.current.past.push({
          position: {
            x: object.left as number,
            y: object.top as number
          },
          dimensions: {
            width: object.getScaledWidth(),
            height: object.getScaledHeight()
          },
          rotation: object.angle as number,
          skew: {
            x: object.skewX as number,
            y: object.skewY as number
          }
        });
        
        // Apply the next state
        if (nextState.position) {
          object.set({
            left: nextState.position.x,
            top: nextState.position.y
          });
        }
        
        if (nextState.dimensions) {
          object.set({
            scaleX: nextState.dimensions.width / object.width!,
            scaleY: nextState.dimensions.height / object.height!
          });
        }
        
        if (nextState.rotation !== undefined) {
          object.set('angle', nextState.rotation);
        }
        
        if (nextState.skew) {
          object.set({
            skewX: nextState.skew.x,
            skewY: nextState.skew.y
          });
        }
        
        object.setCoords();
        canvas.renderAll();
      }
    }
  }, [canvas, state.activeObjectId]);
  
  return {
    isTransforming: state.isTransforming,
    transformationType: state.transformationType,
    activeObjectId: state.activeObjectId,
    
    startMove,
    move,
    startResize,
    resize,
    startRotate,
    rotate,
    startSkew,
    skew,
    stopTransformation,
    
    applyQuickAction,
    undoTransformation,
    redoTransformation,
    
    canUndo: historyRef.current.past.length > 0,
    canRedo: historyRef.current.future.length > 0
  };
}
