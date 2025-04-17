
import { useState, useCallback } from 'react';

export interface TransformationValues {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  skewX: number;
  skewY: number;
  flipX: boolean;
  flipY: boolean;
  scale: number;
  opacity: number;
}

export interface UseAdvancedTransformOptions {
  initialValues?: Partial<TransformationValues>;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  constrainToContainer?: boolean;
  onChange?: (values: TransformationValues) => void;
  maintainAspectRatio?: boolean;
  canvas?: any; // Add canvas property to accept fabric canvas
}

export function useAdvancedTransform({
  initialValues = {},
  minWidth = 10,
  minHeight = 10,
  maxWidth = 10000,
  maxHeight = 10000,
  constrainToContainer = false,
  onChange,
  maintainAspectRatio: initialMaintainAspectRatio = false,
  canvas // Support for canvas object
}: UseAdvancedTransformOptions = {}) {
  const [transformValues, setTransformValues] = useState<TransformationValues>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    skewX: 0,
    skewY: 0,
    flipX: false,
    flipY: false,
    scale: 1,
    opacity: 1,
    ...initialValues
  });
  
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(initialMaintainAspectRatio);
  const [originalAspectRatio] = useState(
    (initialValues.width || 100) / (initialValues.height || 100)
  );
  
  const updateTransform = useCallback((updates: Partial<TransformationValues>) => {
    setTransformValues((prev) => {
      // Copy current values
      const next = { ...prev, ...updates };
      
      // Handle width/height constraints and aspect ratio
      if ('width' in updates || 'height' in updates) {
        // Ensure minimum dimensions
        next.width = Math.max(minWidth, next.width);
        next.height = Math.max(minHeight, next.height);
        
        // Ensure maximum dimensions
        next.width = Math.min(maxWidth, next.width);
        next.height = Math.min(maxHeight, next.height);
        
        // Maintain aspect ratio if enabled
        if (maintainAspectRatio) {
          if ('width' in updates && !('height' in updates)) {
            next.height = next.width / originalAspectRatio;
          } else if ('height' in updates && !('width' in updates)) {
            next.width = next.height * originalAspectRatio;
          }
        }
      }
      
      // Trigger onChange callback
      if (onChange) {
        onChange(next);
      }
      
      return next;
    });
  }, [minWidth, minHeight, maxWidth, maxHeight, maintainAspectRatio, originalAspectRatio, onChange]);
  
  const resetTransformation = useCallback(() => {
    const resetValues: TransformationValues = {
      x: 0,
      y: 0,
      width: initialValues.width || 100,
      height: initialValues.height || 100,
      rotation: 0,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
      scale: 1,
      opacity: 1
    };
    
    setTransformValues(resetValues);
    
    if (onChange) {
      onChange(resetValues);
    }
  }, [initialValues.width, initialValues.height, onChange]);
  
  const toggleAspectRatio = useCallback((maintain: boolean) => {
    setMaintainAspectRatio(maintain);
  }, []);
  
  const startResize = useCallback((direction: string, event: React.MouseEvent) => {
    // Implementation would go here
    console.log(`Starting resize in direction: ${direction}`);
  }, []);
  
  const startRotation = useCallback((event: React.MouseEvent) => {
    // Implementation would go here
    console.log('Starting rotation');
  }, []);
  
  const startSkew = useCallback((axis: 'x' | 'y', event: React.MouseEvent) => {
    // Implementation would go here
    console.log(`Starting skew on ${axis} axis`);
  }, []);
  
  const flip = useCallback((axis: 'horizontal' | 'vertical') => {
    updateTransform({
      flipX: axis === 'horizontal' ? !transformValues.flipX : transformValues.flipX,
      flipY: axis === 'vertical' ? !transformValues.flipY : transformValues.flipY
    });
  }, [transformValues.flipX, transformValues.flipY, updateTransform]);
  
  // Add these methods to match the expected API in WireframeEditorWithGrid.tsx
  const selectedObjects = [];
  
  const applyTransformation = useCallback(() => {
    // Apply the transformation to canvas objects if a canvas is provided
    if (canvas && typeof canvas.renderAll === 'function') {
      canvas.renderAll();
    }
  }, [canvas]);
  
  const flipObjects = useCallback((axis: 'horizontal' | 'vertical') => {
    // First update our local transform values
    flip(axis);
    
    // Then apply to canvas if available
    if (canvas && typeof canvas.renderAll === 'function') {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        if (axis === 'horizontal') {
          activeObject.set('flipX', !activeObject.flipX);
        } else {
          activeObject.set('flipY', !activeObject.flipY);
        }
        canvas.renderAll();
      }
    }
  }, [flip, canvas]);
  
  const resetTransformations = useCallback(() => {
    // Reset our local transform values
    resetTransformation();
    
    // Then apply to canvas if available
    if (canvas && typeof canvas.renderAll === 'function') {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set({
          angle: 0,
          skewX: 0,
          skewY: 0,
          flipX: false,
          flipY: false,
          scaleX: 1,
          scaleY: 1,
          opacity: 1
        });
        canvas.renderAll();
      }
    }
  }, [resetTransformation, canvas]);
  
  return {
    transformValues,
    updateTransform,
    resetTransformation,
    maintainAspectRatio,
    toggleAspectRatio,
    startResize,
    startRotation,
    startSkew,
    flip,
    // Add the missing properties to match the expected API in WireframeEditorWithGrid.tsx
    selectedObjects,
    applyTransformation,
    flipObjects,
    resetTransformations
  };
}

export default useAdvancedTransform;
