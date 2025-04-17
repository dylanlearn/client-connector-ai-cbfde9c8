
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
  scale: number;  // Added scale property to match the expected interface
  opacity: number; // Added opacity property to match the expected interface
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
}

export function useAdvancedTransform({
  initialValues = {},
  minWidth = 10,
  minHeight = 10,
  maxWidth = 10000,
  maxHeight = 10000,
  constrainToContainer = false,
  onChange,
  maintainAspectRatio: initialMaintainAspectRatio = false
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
    scale: 1,    // Default scale value
    opacity: 1,  // Default opacity value
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
  
  return {
    transformValues,
    updateTransform,
    resetTransformation,
    maintainAspectRatio,
    toggleAspectRatio,
    startResize,
    startRotation,
    startSkew,
    flip
  };
}

export default useAdvancedTransform;
