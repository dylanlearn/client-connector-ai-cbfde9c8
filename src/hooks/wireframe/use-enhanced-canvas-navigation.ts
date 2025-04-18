import { useState, useEffect, useRef, useCallback } from 'react';
import { FocusArea } from './use-canvas-navigation';

export type ViewportMode = 'single' | 'split' | 'quad';

export interface EnhancedNavigationConfig {
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  rotationStep: number;
  animationDuration: number;
  enableAnimation: boolean;
  showMinimap: boolean;
  minimapSize: number;
  enableHistory: boolean;
  historyLimit: number;
  enablePersistence: boolean;
  storageKey: string;
}

export interface ViewportState {
  zoom: number;
  rotation: number;
  pan: { x: number; y: number };
  focusArea: FocusArea | null;
}

export interface NavigationHistoryItem {
  timestamp: number;
  state: ViewportState;
  label?: string;
}

const DEFAULT_CONFIG: EnhancedNavigationConfig = {
  minZoom: 0.1,
  maxZoom: 5,
  zoomStep: 0.1,
  rotationStep: 15,
  animationDuration: 300,
  enableAnimation: true,
  showMinimap: true,
  minimapSize: 200,
  enableHistory: true,
  historyLimit: 50,
  enablePersistence: true,
  storageKey: 'canvas-navigation-state'
};

export function useEnhancedCanvasNavigation(initialConfig?: Partial<EnhancedNavigationConfig>) {
  // Merge with default config
  const config = { ...DEFAULT_CONFIG, ...initialConfig };
  
  // State for viewport(s)
  const [viewMode, setViewMode] = useState<ViewportMode>('single');
  const [activeViewport, setActiveViewport] = useState<number>(0);
  const [viewports, setViewports] = useState<ViewportState[]>([{
    zoom: 1,
    rotation: 0,
    pan: { x: 0, y: 0 },
    focusArea: null
  }]);
  
  // Animation and history
  const animationRef = useRef<number | null>(null);
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);
  const [historyPosition, setHistoryPosition] = useState<number>(-1);
  
  // Add to history
  const addToHistory = useCallback((label?: string) => {
    if (!config.enableHistory) return;
    
    const newItem: NavigationHistoryItem = {
      timestamp: Date.now(),
      state: { ...viewports[activeViewport] },
      label
    };
    
    setHistory(prev => {
      // If we're not at the end of history, truncate
      const newHistory = historyPosition < prev.length - 1
        ? prev.slice(0, historyPosition + 1)
        : [...prev];
      
      // Add new item and trim if needed
      return [...newHistory, newItem].slice(-config.historyLimit);
    });
    
    setHistoryPosition(prev => Math.min(prev + 1, config.historyLimit - 1));
  }, [viewports, activeViewport, historyPosition, config.enableHistory, config.historyLimit]);
  
  // Update viewport state
  const updateViewport = useCallback((updates: Partial<ViewportState>, saveHistory = true) => {
    setViewports(prev => {
      const updated = [...prev];
      updated[activeViewport] = {
        ...updated[activeViewport],
        ...updates
      };
      return updated;
    });
    
    if (saveHistory) {
      addToHistory();
    }
  }, [activeViewport, addToHistory]);
  
  // Handle viewport animation
  const animateViewportTo = useCallback((targetState: Partial<ViewportState>, duration = config.animationDuration) => {
    if (!config.enableAnimation) {
      updateViewport(targetState);
      return;
    }
    
    const startState = { ...viewports[activeViewport] };
    const startTime = Date.now();
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease in/out function
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const current: Partial<ViewportState> = {};
      
      // Interpolate values
      if (targetState.zoom !== undefined) {
        current.zoom = startState.zoom + (targetState.zoom - startState.zoom) * easeProgress;
      }
      
      if (targetState.rotation !== undefined) {
        current.rotation = startState.rotation + (targetState.rotation - startState.rotation) * easeProgress;
      }
      
      if (targetState.pan) {
        current.pan = {
          x: startState.pan.x + ((targetState.pan?.x || 0) - startState.pan.x) * easeProgress,
          y: startState.pan.y + ((targetState.pan?.y || 0) - startState.pan.y) * easeProgress
        };
      }
      
      // Update without adding to history during animation
      updateViewport(current, false);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateFrame);
      } else {
        // Final update and add to history when complete
        updateViewport(targetState, true);
        animationRef.current = null;
      }
    };
    
    animationRef.current = requestAnimationFrame(animateFrame);
  }, [viewports, activeViewport, config.enableAnimation, config.animationDuration, updateViewport]);

  // Basic navigation operations
  const zoomIn = useCallback(() => {
    const newZoom = Math.min(config.maxZoom, viewports[activeViewport].zoom + config.zoomStep);
    animateViewportTo({ zoom: newZoom });
  }, [viewports, activeViewport, config.maxZoom, config.zoomStep, animateViewportTo]);
  
  const zoomOut = useCallback(() => {
    const newZoom = Math.max(config.minZoom, viewports[activeViewport].zoom - config.zoomStep);
    animateViewportTo({ zoom: newZoom });
  }, [viewports, activeViewport, config.minZoom, config.zoomStep, animateViewportTo]);
  
  const resetZoom = useCallback(() => {
    animateViewportTo({ zoom: 1 });
  }, [animateViewportTo]);
  
  const panTo = useCallback((x: number, y: number) => {
    animateViewportTo({ pan: { x, y } });
  }, [animateViewportTo]);
  
  const resetPan = useCallback(() => {
    animateViewportTo({ pan: { x: 0, y: 0 } });
  }, [animateViewportTo]);
  
  const rotateTo = useCallback((degrees: number) => {
    // Normalize to 0-360
    const normalized = ((degrees % 360) + 360) % 360;
    animateViewportTo({ rotation: normalized });
  }, [animateViewportTo]);
  
  const rotateClockwise = useCallback(() => {
    const newRotation = viewports[activeViewport].rotation + config.rotationStep;
    rotateTo(newRotation);
  }, [viewports, activeViewport, config.rotationStep, rotateTo]);
  
  const rotateCounterClockwise = useCallback(() => {
    const newRotation = viewports[activeViewport].rotation - config.rotationStep;
    rotateTo(newRotation);
  }, [viewports, activeViewport, config.rotationStep, rotateTo]);
  
  const resetRotation = useCallback(() => {
    animateViewportTo({ rotation: 0 });
  }, [animateViewportTo]);
  
  // Reset all transforms
  const resetTransforms = useCallback(() => {
    animateViewportTo({
      zoom: 1,
      rotation: 0,
      pan: { x: 0, y: 0 }
    });
  }, [animateViewportTo]);
  
  // History navigation
  const goBack = useCallback(() => {
    if (!config.enableHistory || historyPosition <= 0) return;
    
    const newPosition = historyPosition - 1;
    const historyItem = history[newPosition];
    
    setHistoryPosition(newPosition);
    
    if (historyItem) {
      // Update without animation and without adding to history
      updateViewport(historyItem.state, false);
    }
  }, [config.enableHistory, historyPosition, history, updateViewport]);
  
  const goForward = useCallback(() => {
    if (!config.enableHistory || historyPosition >= history.length - 1) return;
    
    const newPosition = historyPosition + 1;
    const historyItem = history[newPosition];
    
    setHistoryPosition(newPosition);
    
    if (historyItem) {
      // Update without animation and without adding to history
      updateViewport(historyItem.state, false);
    }
  }, [config.enableHistory, historyPosition, history, history.length, updateViewport]);
  
  // Focus area
  const focusOnArea = useCallback((area: FocusArea) => {
    const newZoom = Math.min(config.maxZoom, 1.5);
    animateViewportTo({
      zoom: newZoom,
      pan: { x: -area.x + (area.width / 2), y: -area.y + (area.height / 2) },
      focusArea: area
    });
  }, [config.maxZoom, animateViewportTo]);
  
  const clearFocus = useCallback(() => {
    updateViewport({ focusArea: null });
  }, [updateViewport]);
  
  // Viewport management
  const setViewportMode = useCallback((mode: ViewportMode) => {
    setViewMode(mode);
    
    // Create appropriate number of viewports
    const viewportCount = mode === 'single' ? 1 : mode === 'split' ? 2 : 4;
    
    setViewports(prev => {
      const current = [...prev];
      
      // Keep existing viewports
      while (current.length < viewportCount) {
        current.push({
          zoom: 1,
          rotation: 0,
          pan: { x: 0, y: 0 },
          focusArea: null
        });
      }
      
      // Trim if needed
      return current.slice(0, viewportCount);
    });
    
    // Set active viewport to first one
    setActiveViewport(0);
  }, []);
  
  const switchToViewport = useCallback((index: number) => {
    if (index >= 0 && index < viewports.length) {
      setActiveViewport(index);
    }
  }, [viewports.length]);

  // Persistence
  useEffect(() => {
    if (!config.enablePersistence) return;
    
    // Load persisted state
    try {
      const saved = localStorage.getItem(config.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setViewports(parsed.viewports || viewports);
        setViewMode(parsed.viewMode || viewMode);
        setActiveViewport(parsed.activeViewport || 0);
      }
    } catch (e) {
      console.error('Failed to load canvas navigation state:', e);
    }
  }, [config.enablePersistence, config.storageKey]);
  
  // Save state when it changes
  useEffect(() => {
    if (!config.enablePersistence) return;
    
    try {
      localStorage.setItem(config.storageKey, JSON.stringify({
        viewports,
        viewMode,
        activeViewport
      }));
    } catch (e) {
      console.error('Failed to save canvas navigation state:', e);
    }
  }, [viewports, viewMode, activeViewport, config.enablePersistence, config.storageKey]);
  
  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return {
    // State
    viewports,
    viewMode,
    activeViewport,
    history,
    historyPosition,
    
    // Basic operations
    zoomIn,
    zoomOut,
    resetZoom,
    panTo,
    resetPan,
    rotateClockwise,
    rotateCounterClockwise,
    resetRotation,
    resetTransforms,
    
    // History operations
    goBack,
    goForward,
    addToHistory,
    
    // Focus operations
    focusOnArea,
    clearFocus,
    
    // Viewport operations
    setViewportMode,
    switchToViewport,
    
    // Advanced operations
    animateViewportTo,
    
    // Current state getters
    currentZoom: viewports[activeViewport]?.zoom || 1,
    currentRotation: viewports[activeViewport]?.rotation || 0,
    currentPan: viewports[activeViewport]?.pan || { x: 0, y: 0 },
    currentFocus: viewports[activeViewport]?.focusArea || null,
    
    // Configuration
    config
  };
}
