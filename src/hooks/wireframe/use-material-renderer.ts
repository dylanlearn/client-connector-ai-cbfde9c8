
import { useCallback, useEffect } from 'react';
import { useFidelity } from '@/components/wireframe/fidelity/FidelityContext';
import { FidelitySettings, MaterialType, SurfaceTreatment } from '@/components/wireframe/fidelity/FidelityLevels';
import { fabric } from 'fabric';

interface UseMaterialRendererOptions {
  canvas?: fabric.Canvas | null;
  defaultMaterial?: MaterialType;
  defaultSurface?: SurfaceTreatment;
  optimizationEnabled?: boolean;
}

/**
 * Hook for applying material rendering optimizations based on fidelity settings
 */
export function useMaterialRenderer({
  canvas,
  defaultMaterial = 'matte',
  defaultSurface = 'smooth',
  optimizationEnabled = true
}: UseMaterialRendererOptions = {}) {
  const { settings, currentLevel, isTransitioning } = useFidelity();
  
  // Apply material to a Fabric.js object
  const applyMaterial = useCallback((
    object: fabric.Object,
    material: MaterialType = defaultMaterial,
    surface: SurfaceTreatment = defaultSurface,
    color?: string
  ) => {
    if (!object) return;
    
    // Get current fidelity settings
    const currentSettings = settings;
    
    // Base shadow settings
    const shadowSettings = {
      color: 'rgba(0,0,0,0.2)',
      blur: 5,
      offsetX: 0,
      offsetY: 2
    };
    
    // Set fill color
    if (color) {
      object.set('fill', color);
    }
    
    // Skip enhancements in wireframe mode
    if (currentLevel === 'wireframe') {
      object.set({
        stroke: '#000',
        strokeWidth: 1,
        fill: '#fff',
        shadow: null
      });
      return;
    }
    
    // Apply material-specific settings
    switch (material) {
      case 'basic':
        object.set({
          shadow: null
        });
        break;
      
      case 'flat':
        if (currentSettings.showShadows) {
          object.set({
            shadow: new fabric.Shadow({
              ...shadowSettings,
              blur: 3,
              offsetY: 1
            })
          });
        }
        break;
      
      case 'matte':
        if (currentSettings.showShadows) {
          object.set({
            shadow: new fabric.Shadow({
              ...shadowSettings,
              blur: 5,
              offsetY: 2
            })
          });
        }
        break;
      
      case 'glossy':
        if (currentSettings.showShadows) {
          object.set({
            shadow: new fabric.Shadow({
              ...shadowSettings,
              blur: 8,
              offsetY: 3
            })
          });
        }
        
        if (currentSettings.showGradients) {
          // Simulate glossy effect with gradient if object is a rect/path
          if (object instanceof fabric.Rect) {
            const originalFill = object.fill?.toString() || '#000000';
            const gradient = new fabric.Gradient({
              type: 'linear',
              coords: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: object.height || 100
              },
              colorStops: [
                { offset: 0, color: fabric.Color.fromHex(originalFill).toLive('rgb') },
                { offset: 0.5, color: originalFill },
                { offset: 1, color: fabric.Color.fromHex(originalFill).darken(0.1).toLive('rgb') }
              ]
            });
            
            object.set('fill', gradient);
          }
        }
        break;
      
      case 'metallic':
        if (currentSettings.showShadows) {
          object.set({
            shadow: new fabric.Shadow({
              ...shadowSettings,
              blur: 7,
              offsetY: 2
            })
          });
        }
        
        if (currentSettings.showGradients) {
          // Simulate metallic effect with gradient
          if (object instanceof fabric.Rect) {
            const originalFill = object.fill?.toString() || '#000000';
            const gradient = new fabric.Gradient({
              type: 'linear',
              coords: {
                x1: 0,
                y1: 0,
                x2: object.width || 100,
                y2: object.height || 100
              },
              colorStops: [
                { offset: 0, color: fabric.Color.fromHex(originalFill).lighten(0.2).toLive('rgb') },
                { offset: 0.5, color: originalFill },
                { offset: 1, color: fabric.Color.fromHex(originalFill).darken(0.1).toLive('rgb') }
              ]
            });
            
            object.set('fill', gradient);
          }
        }
        break;
      
      case 'glass':
        // For glass material, adjust opacity
        object.set({
          opacity: 0.7
        });
        
        if (currentSettings.showShadows) {
          object.set({
            shadow: new fabric.Shadow({
              ...shadowSettings,
              blur: 10,
              offsetY: 2,
              opacity: 0.2
            })
          });
        }
        break;
      
      case 'textured':
        if (currentSettings.showTextures && object instanceof fabric.Rect) {
          // We would apply a texture pattern here in a real implementation
          // For this example, we'll just use a gradient pattern
          const originalFill = object.fill?.toString() || '#000000';
          const patternSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGZpbHRlciBpZD0iYSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJidWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjIiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjEiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHJlc3VsdD0idHVyYnVsZW5jZSIvPjxmZURpc3BsYWNlbWVudE1hcCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJ0dXJidWxlbmNlIiBzY2FsZT0iNSIgeENoYW5uZWxTZWxlY3Rvcj0iUiIgeUNoYW5uZWxTZWxlY3Rvcj0iRyIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0idHJhbnNwYXJlbnQiLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wOCIvPjwvc3ZnPg==';
          
          // This would be an async operation in a real implementation
          // using fabric.util.loadImage
          object.set({
            fill: originalFill
          });
        }
        
        if (currentSettings.showShadows) {
          object.set({
            shadow: new fabric.Shadow({
              ...shadowSettings,
              blur: 5,
              offsetY: 2
            })
          });
        }
        break;
    }
    
    // Apply surface treatment
    switch (surface) {
      case 'none':
        // No special treatment
        break;
      
      case 'smooth':
        object.set({
          rx: 5,
          ry: 5
        });
        break;
      
      case 'rough':
        // In a real implementation, we would apply a noise filter or pattern
        break;
      
      case 'bumpy':
        // In a real implementation, we would apply a bump map or displacement filter
        break;
      
      case 'engraved':
        if (currentSettings.showShadows) {
          // Simulate engraved effect with inner shadow
          // (In fabric.js, we'd typically use a composite shadow or filter for this)
          object.set({
            stroke: 'rgba(0,0,0,0.1)',
            strokeWidth: 1
          });
        }
        break;
      
      case 'embossed':
        if (currentSettings.showShadows) {
          // Simulate embossed effect
          // (In fabric.js, we'd typically use a composite shadow or filter for this)
          object.set({
            stroke: 'rgba(255,255,255,0.2)',
            strokeWidth: 1
          });
        }
        break;
    }
    
    // Update object
    if (canvas) {
      canvas.renderAll();
    }
    
  }, [canvas, settings, currentLevel, defaultMaterial, defaultSurface]);
  
  // Batch apply materials to multiple objects
  const applyMaterialToObjects = useCallback((
    objects: fabric.Object[],
    material?: MaterialType,
    surface?: SurfaceTreatment,
    colors?: string[]
  ) => {
    objects.forEach((obj, index) => {
      const color = colors ? colors[index % colors.length] : undefined;
      applyMaterial(obj, material, surface, color);
    });
    
    if (canvas) {
      canvas.renderAll();
    }
  }, [applyMaterial, canvas]);
  
  // Optimization: Apply performance optimizations based on fidelity level
  useEffect(() => {
    if (!optimizationEnabled || !canvas) return;
    
    // Get all objects on canvas
    const objects = canvas.getObjects();
    
    // Optimization strategies based on fidelity level
    switch (currentLevel) {
      case 'wireframe':
        // Maximum performance: disable object caching, simple strokes
        objects.forEach(obj => {
          obj.set({
            objectCaching: false,
            stroke: '#000',
            strokeWidth: 1,
            shadow: null,
            fill: '#fff'
          });
        });
        break;
      
      case 'low':
        // Balance performance: enable caching, simple shadows
        objects.forEach(obj => {
          obj.set({
            objectCaching: true,
            strokeWidth: settings.showBorders ? 1 : 0
          });
        });
        break;
      
      case 'medium':
        // Default settings
        objects.forEach(obj => {
          obj.set({
            objectCaching: true,
            strokeWidth: settings.showBorders ? 1 : 0
          });
        });
        break;
      
      case 'high':
        // Maximum quality: enable all effects
        objects.forEach(obj => {
          obj.set({
            objectCaching: true,
            strokeWidth: settings.showBorders ? 1 : 0,
            // Additional high-quality settings could be applied here
          });
        });
        break;
    }
    
    // Apply overall quality settings
    canvas.enableRetinaScaling = settings.renderQuality > 0.8;
    
    // Skip rendering during transitions for performance
    if (isTransitioning) {
      canvas.skipTargetFind = true;
      canvas.selection = false;
    } else {
      canvas.skipTargetFind = false;
      canvas.selection = true;
    }
    
    canvas.renderAll();
  }, [canvas, currentLevel, settings, optimizationEnabled, isTransitioning]);
  
  return {
    applyMaterial,
    applyMaterialToObjects,
    currentLevel,
    settings,
    isTransitioning
  };
}
