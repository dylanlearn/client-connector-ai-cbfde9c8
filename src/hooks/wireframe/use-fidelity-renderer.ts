import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFidelity } from '@/components/wireframe/fidelity/FidelityContext';
import { FidelitySettings, FidelityLevel } from '@/components/wireframe/fidelity/FidelityLevels';
import { fabric } from 'fabric';

export interface FidelityRenderOptions {
  canvas?: fabric.Canvas | null;
  applyToDOM?: boolean;
  container?: HTMLElement | null;
}

/**
 * Hook to manage rendering optimizations based on fidelity level
 */
export function useFidelityRenderer(options: FidelityRenderOptions = {}) {
  const { canvas, applyToDOM = true, container } = options;
  const { currentLevel, settings, isTransitioning } = useFidelity();
  const prevSettingsRef = useRef<FidelitySettings | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  
  // Store reference to container
  useEffect(() => {
    if (container) {
      containerRef.current = container;
    }
  }, [container]);
  
  // Calculate performance budget based on fidelity level
  const performanceBudget = useMemo(() => {
    // Values in milliseconds for different operations
    const budgets = {
      wireframe: {
        frameBudget: 16, // ~60fps
        renderDelay: 0,
        batchSize: 50,
        throttleInterval: 0
      },
      low: {
        frameBudget: 16, // ~60fps
        renderDelay: 0,
        batchSize: 30,
        throttleInterval: 0
      },
      medium: {
        frameBudget: 33, // ~30fps
        renderDelay: 10,
        batchSize: 20,
        throttleInterval: 10
      },
      high: {
        frameBudget: 50, // ~20fps
        renderDelay: 20,
        batchSize: 10,
        throttleInterval: 20
      }
    };
    
    return budgets[currentLevel];
  }, [currentLevel]);
  
  // Apply fidelity settings to canvas objects
  const applyCanvasSettings = useCallback(() => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    
    // Apply settings to each object based on fidelity level
    objects.forEach(obj => {
      // Skip non-visible objects for performance
      if (!obj.visible) return;
      
      // Apply shadow settings
      if (obj.shadow && typeof obj.shadow === 'object') {
        if (settings.showShadows) {
          obj.shadow.blur = settings.detailLevel * 15;
          obj.shadow.offsetX = settings.detailLevel * 5;
          obj.shadow.offsetY = settings.detailLevel * 5;
          obj.shadow.opacity = settings.detailLevel * 0.3;
        } else {
          obj.shadow = null;
        }
      }
      
      // Handle stroke rendering
      if (currentLevel === 'wireframe') {
        // In wireframe mode, ensure all objects have a visible outline
        const strokeWidth = obj.strokeWidth || 0;
        obj.set({
          strokeWidth: Math.max(1, strokeWidth),
          stroke: obj.stroke || '#000000',
          fill: settings.colorDepth === 'grayscale' ? '#ffffff' : obj.fill
        });
      }
      
      // Apply opacity based on render quality
      if (obj.opacity !== undefined) {
        // Keep original opacity but scale by render quality
        const originalOpacity = obj._originalOpacity || obj.opacity;
        obj._originalOpacity = originalOpacity;
        obj.opacity = originalOpacity * settings.renderQuality;
      }
      
      // Apply object caching for performance
      if (currentLevel === 'wireframe' || currentLevel === 'low') {
        obj.objectCaching = true;
      } else {
        // For higher fidelity, only cache larger objects
        obj.objectCaching = true;
      }
    });
    
    // Optimize rendering
    canvas.renderOnAddRemove = currentLevel !== 'wireframe';
    canvas.skipTargetFind = currentLevel === 'wireframe';
    canvas.selection = currentLevel !== 'wireframe';
    
    // Request a render
    canvas.requestRenderAll();
  }, [canvas, currentLevel, settings]);
  
  // Apply DOM-level styling for fidelity
  const applyDOMStyling = useCallback(() => {
    if (!applyToDOM) return;
    
    const container = containerRef.current || document.documentElement;
    if (!container) return;
    
    // Apply CSS variables for styling based on fidelity
    container.style.setProperty('--fidelity-shadow-strength', settings.showShadows ? '1' : '0');
    container.style.setProperty('--fidelity-detail-level', String(settings.detailLevel));
    container.style.setProperty('--fidelity-render-quality', String(settings.renderQuality));
    container.style.setProperty('--fidelity-color-depth', settings.colorDepth);
    container.style.setProperty('--fidelity-round-corners', settings.roundCorners ? '1' : '0');
    
    // Add class based on current fidelity level
    container.setAttribute('data-fidelity-level', currentLevel);
    
    // Handle animations
    if (settings.showAnimations) {
      container.classList.remove('disable-animations');
    } else {
      container.classList.add('disable-animations');
    }
    
    // Toggle grayscale for the entire container
    if (settings.colorDepth === 'grayscale') {
      container.style.filter = 'grayscale(1)';
    } else if (settings.colorDepth === 'limited') {
      container.style.filter = 'saturate(0.7)';
    } else {
      container.style.filter = '';
    }
  }, [applyToDOM, currentLevel, settings]);
  
  // Apply settings when they change
  useEffect(() => {
    // Skip if settings haven't changed
    if (prevSettingsRef.current && 
        JSON.stringify(prevSettingsRef.current) === JSON.stringify(settings)) {
      return;
    }
    
    applyCanvasSettings();
    applyDOMStyling();
    
    // Store current settings
    prevSettingsRef.current = { ...settings };
  }, [applyCanvasSettings, applyDOMStyling, settings]);
  
  // Optimize rendering when fidelity changes
  useEffect(() => {
    if (!canvas) return;
    
    // Apply performance optimizations
    const throttleTime = performanceBudget.throttleInterval;
    canvas.enableRetinaScaling = currentLevel === 'high';
    canvas.renderOnAddRemove = currentLevel !== 'wireframe';
    
    // Add delay before rendering for smoother transitions
    if (isTransitioning && performanceBudget.renderDelay > 0) {
      const delay = setTimeout(() => {
        canvas.requestRenderAll();
      }, performanceBudget.renderDelay);
      
      return () => clearTimeout(delay);
    }
    
  }, [canvas, currentLevel, isTransitioning, performanceBudget]);
  
  // Methods to manually apply fidelity settings
  const applyFidelityToElement = useCallback((element: HTMLElement) => {
    // Apply fidelity-based CSS to a specific element
    element.style.setProperty('--fidelity-detail-level', String(settings.detailLevel));
    element.style.setProperty('--fidelity-shadow-strength', settings.showShadows ? '1' : '0');
    
    if (settings.colorDepth === 'grayscale') {
      element.style.filter = 'grayscale(1)';
    } else if (settings.colorDepth === 'limited') {
      element.style.filter = 'saturate(0.7)';
    } else {
      element.style.filter = '';
    }
    
    element.setAttribute('data-fidelity-level', currentLevel);
  }, [currentLevel, settings]);
  
  // Force update rendering
  const refreshRendering = useCallback(() => {
    applyCanvasSettings();
    applyDOMStyling();
  }, [applyCanvasSettings, applyDOMStyling]);
  
  return {
    currentLevel,
    settings,
    performanceBudget,
    isTransitioning,
    applyFidelityToElement,
    refreshRendering
  };
}
