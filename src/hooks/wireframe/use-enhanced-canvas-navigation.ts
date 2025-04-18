
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export type ViewMode = 'single' | 'split' | 'grid';

export interface FocusArea {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface Viewport {
  id: string;
  zoom: number;
  pan: { x: number, y: number };
  rotation: number;
  focusArea: FocusArea | null;
}

export interface NavigationHistoryEntry {
  viewports: Viewport[];
  activeViewportId: string;
  timestamp: number;
}

export interface UseCanvasNavigationOptions {
  canvas: fabric.Canvas | null;
  maxHistorySize?: number;
  initialZoom?: number;
  initialRotation?: number;
  initialPan?: { x: number, y: number };
  animationDuration?: number;
  persistState?: boolean;
  stateStorageKey?: string;
}

export function useEnhancedCanvasNavigation({
  canvas,
  maxHistorySize = 30,
  initialZoom = 1,
  initialRotation = 0,
  initialPan = { x: 0, y: 0 },
  animationDuration = 300,
  persistState = true,
  stateStorageKey = 'canvas-navigation-state'
}: UseCanvasNavigationOptions) {
  // Load persisted state if available
  const loadInitialState = () => {
    if (persistState) {
      try {
        const savedState = localStorage.getItem(stateStorageKey);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          return {
            zoom: parsed.zoom ?? initialZoom,
            rotation: parsed.rotation ?? initialRotation,
            pan: parsed.pan ?? initialPan,
            viewMode: parsed.viewMode ?? 'single' as ViewMode,
            viewports: parsed.viewports ?? [createDefaultViewport()],
            activeViewportId: parsed.activeViewportId ?? 'default'
          };
        }
      } catch (error) {
        console.error('Failed to load canvas navigation state:', error);
      }
    }
    
    return {
      zoom: initialZoom,
      rotation: initialRotation,
      pan: initialPan,
      viewMode: 'single' as ViewMode,
      viewports: [createDefaultViewport()],
      activeViewportId: 'default'
    };
  };
  
  // Create default viewport
  const createDefaultViewport = (): Viewport => ({
    id: 'default',
    zoom: initialZoom,
    pan: { ...initialPan },
    rotation: initialRotation,
    focusArea: null
  });

  // State for navigation parameters
  const initialState = loadInitialState();
  const [zoom, setZoom] = useState<number>(initialState.zoom);
  const [rotation, setRotation] = useState<number>(initialState.rotation);
  const [pan, setPan] = useState<{ x: number, y: number }>(initialState.pan);
  const [viewMode, setViewMode] = useState<ViewMode>(initialState.viewMode);
  const [viewports, setViewports] = useState<Viewport[]>(initialState.viewports);
  const [activeViewportId, setActiveViewportId] = useState<string>(initialState.activeViewportId);
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animatingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  // Get the active viewport
  const activeViewport = useMemo(() => {
    return viewports.find(vp => vp.id === activeViewportId) || viewports[0];
  }, [viewports, activeViewportId]);

  // Persist state when it changes
  useEffect(() => {
    if (persistState) {
      try {
        localStorage.setItem(stateStorageKey, JSON.stringify({
          zoom,
          rotation,
          pan,
          viewMode,
          viewports,
          activeViewportId
        }));
      } catch (error) {
        console.error('Failed to save canvas navigation state:', error);
      }
    }
  }, [zoom, rotation, pan, viewMode, viewports, activeViewportId, persistState, stateStorageKey]);

  // Add current state to history
  const addToHistory = useCallback(() => {
    setNavigationHistory(prev => {
      // Truncate history if we're not at the end (user went back in history)
      const updatedHistory = historyIndex >= 0 && historyIndex < prev.length - 1
        ? prev.slice(0, historyIndex + 1)
        : prev;
      
      const newEntry: NavigationHistoryEntry = {
        viewports: JSON.parse(JSON.stringify(viewports)), // Deep clone
        activeViewportId,
        timestamp: Date.now()
      };
      
      const newHistory = [...updatedHistory, newEntry].slice(-maxHistorySize);
      setHistoryIndex(newHistory.length - 1);
      
      return newHistory;
    });
  }, [viewports, activeViewportId, historyIndex, maxHistorySize]);

  // Apply canvas transformations (with animation)
  const applyCanvasTransform = useCallback((targetZoom: number, targetPan: { x: number, y: number }, targetRotation: number, animate: boolean = false) => {
    if (!canvas) return;
    
    const applyImmediately = () => {
      // Apply zoom
      canvas.setZoom(targetZoom);
      
      // Apply pan
      canvas.absolutePan(new fabric.Point(targetPan.x, targetPan.y));
      
      // Apply rotation (not directly supported by Fabric, would need to rotate all objects)
      // This is usually better handled at the container level in CSS
      
      canvas.requestRenderAll();
    };
    
    if (!animate || animationDuration <= 0) {
      applyImmediately();
      return;
    }
    
    // Stop any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Get current state
    const startZoom = canvas.getZoom();
    const viewportTransform = canvas.viewportTransform;
    
    if (!viewportTransform) {
      applyImmediately();
      return;
    }
    
    const startPanX = -viewportTransform[4];
    const startPanY = -viewportTransform[5];
    
    // Animation variables
    const startTime = performance.now();
    animatingRef.current = true;
    setIsAnimating(true);
    
    // Animation frame function
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Ease function (cubic ease out)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate values
      const currentZoom = startZoom + (targetZoom - startZoom) * eased;
      const currentPanX = startPanX + (targetPan.x - startPanX) * eased;
      const currentPanY = startPanY + (targetPan.y - startPanY) * eased;
      
      // Apply interpolated values
      canvas.setZoom(currentZoom);
      canvas.absolutePan(new fabric.Point(currentPanX, currentPanY));
      canvas.requestRenderAll();
      
      // Continue animation if not complete
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        animatingRef.current = false;
        setIsAnimating(false);
        animationFrameRef.current = null;
      }
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [canvas, animationDuration]);

  // Update canvas when zoom, pan, or rotation changes
  useEffect(() => {
    if (!canvas || isAnimating) return;
    
    applyCanvasTransform(zoom, pan, rotation, false);
  }, [canvas, zoom, pan, rotation, isAnimating, applyCanvasTransform]);

  // Zoom controls
  const handleZoomIn = useCallback((animate: boolean = true) => {
    setZoom(prevZoom => {
      const newZoom = Math.min(prevZoom + 0.1, 5);
      // Update active viewport
      setViewports(prev => prev.map(viewport => 
        viewport.id === activeViewportId 
          ? { ...viewport, zoom: newZoom } 
          : viewport
      ));
      
      return newZoom;
    });
    
    // Add to history after timeout to avoid rapid additions
    setTimeout(() => addToHistory(), 300);
  }, [activeViewportId, addToHistory]);

  const handleZoomOut = useCallback((animate: boolean = true) => {
    setZoom(prevZoom => {
      const newZoom = Math.max(prevZoom - 0.1, 0.1);
      // Update active viewport
      setViewports(prev => prev.map(viewport => 
        viewport.id === activeViewportId 
          ? { ...viewport, zoom: newZoom } 
          : viewport
      ));
      
      return newZoom;
    });
    
    // Add to history after timeout to avoid rapid additions
    setTimeout(() => addToHistory(), 300);
  }, [activeViewportId, addToHistory]);

  const handleZoomReset = useCallback((animate: boolean = true) => {
    setZoom(initialZoom);
    setPan(initialPan);
    
    // Update active viewport
    setViewports(prev => prev.map(viewport => 
      viewport.id === activeViewportId 
        ? { ...viewport, zoom: initialZoom, pan: { ...initialPan } } 
        : viewport
    ));
    
    addToHistory();
  }, [initialZoom, initialPan, activeViewportId, addToHistory]);

  // Rotation controls
  const handleRotateClockwise = useCallback(() => {
    setRotation(prevRotation => {
      const newRotation = (prevRotation + 15) % 360;
      // Update active viewport
      setViewports(prev => prev.map(viewport => 
        viewport.id === activeViewportId 
          ? { ...viewport, rotation: newRotation } 
          : viewport
      ));
      
      return newRotation;
    });
    
    addToHistory();
  }, [activeViewportId, addToHistory]);

  const handleRotateCounterClockwise = useCallback(() => {
    setRotation(prevRotation => {
      const newRotation = (prevRotation - 15 + 360) % 360;
      // Update active viewport
      setViewports(prev => prev.map(viewport => 
        viewport.id === activeViewportId 
          ? { ...viewport, rotation: newRotation } 
          : viewport
      ));
      
      return newRotation;
    });
    
    addToHistory();
  }, [activeViewportId, addToHistory]);

  const handleRotateReset = useCallback(() => {
    setRotation(initialRotation);
    
    // Update active viewport
    setViewports(prev => prev.map(viewport => 
      viewport.id === activeViewportId 
        ? { ...viewport, rotation: initialRotation } 
        : viewport
    ));
    
    addToHistory();
  }, [initialRotation, activeViewportId, addToHistory]);

  // Pan controls
  const handlePan = useCallback((x: number, y: number) => {
    setPan(prevPan => {
      const newPan = { 
        x: prevPan.x + x, 
        y: prevPan.y + y 
      };
      
      // Update active viewport
      setViewports(prev => prev.map(viewport => 
        viewport.id === activeViewportId 
          ? { ...viewport, pan: newPan } 
          : viewport
      ));
      
      return newPan;
    });
    
    // We don't add to history for small pan movements to avoid history cluttering
  }, [activeViewportId]);

  const handlePanReset = useCallback(() => {
    setPan(initialPan);
    
    // Update active viewport
    setViewports(prev => prev.map(viewport => 
      viewport.id === activeViewportId 
        ? { ...viewport, pan: { ...initialPan } } 
        : viewport
    ));
    
    addToHistory();
  }, [initialPan, activeViewportId, addToHistory]);

  // View mode toggle
  const handleViewModeToggle = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    
    // If we're switching to split or grid mode, make sure we have enough viewports
    if (mode === 'split' && viewports.length < 2) {
      setViewports(prev => [...prev, {
        id: `viewport-${Date.now()}`,
        zoom: initialZoom,
        pan: { ...initialPan },
        rotation: initialRotation,
        focusArea: null
      }]);
    } else if (mode === 'grid' && viewports.length < 4) {
      const newViewports = [...viewports];
      while (newViewports.length < 4) {
        newViewports.push({
          id: `viewport-${Date.now()}-${newViewports.length}`,
          zoom: initialZoom,
          pan: { ...initialPan },
          rotation: initialRotation,
          focusArea: null
        });
      }
      setViewports(newViewports);
    }
    
    addToHistory();
  }, [viewports, initialZoom, initialPan, initialRotation, addToHistory]);

  // Focus area controls
  const handleApplyFocusArea = useCallback((area: FocusArea, animate: boolean = true) => {
    // Calculate zoom and pan to focus on the area
    if (!canvas) return;
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    // Calculate the zoom needed to fit the area with some padding
    const paddingFactor = 0.9; // 10% padding
    const zoomX = (canvasWidth / area.width) * paddingFactor;
    const zoomY = (canvasHeight / area.height) * paddingFactor;
    const newZoom = Math.min(zoomX, zoomY, 5); // Cap zoom at 5x
    
    // Calculate pan to center the area
    const areaCenterX = area.x + area.width / 2;
    const areaCenterY = area.y + area.height / 2;
    
    const newPanX = -(areaCenterX * newZoom - canvasWidth / 2);
    const newPanY = -(areaCenterY * newZoom - canvasHeight / 2);
    
    // Update state
    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
    
    // Update active viewport
    setViewports(prev => prev.map(viewport => 
      viewport.id === activeViewportId 
        ? { 
            ...viewport, 
            zoom: newZoom, 
            pan: { x: newPanX, y: newPanY },
            focusArea: { ...area }
          } 
        : viewport
    ));
    
    // Apply transform with animation
    applyCanvasTransform(newZoom, { x: newPanX, y: newPanY }, rotation, animate);
    
    addToHistory();
  }, [canvas, rotation, activeViewportId, applyCanvasTransform, addToHistory]);

  const handleResetFocusArea = useCallback(() => {
    // Update active viewport
    setViewports(prev => prev.map(viewport => 
      viewport.id === activeViewportId 
        ? { ...viewport, focusArea: null } 
        : viewport
    ));
    
    handleZoomReset();
  }, [activeViewportId, handleZoomReset]);

  // Navigation history controls
  const navigateHistory = useCallback((delta: number) => {
    if (navigationHistory.length === 0) return;
    
    setHistoryIndex(prevIndex => {
      const newIndex = Math.max(0, Math.min(prevIndex + delta, navigationHistory.length - 1));
      
      // Apply the historical state if it changed
      if (newIndex !== prevIndex) {
        const historyEntry = navigationHistory[newIndex];
        
        // Restore viewports
        setViewports(historyEntry.viewports);
        
        // Restore active viewport
        setActiveViewportId(historyEntry.activeViewportId);
        
        // Get the active viewport from history
        const activeVP = historyEntry.viewports.find(vp => vp.id === historyEntry.activeViewportId);
        
        if (activeVP) {
          // Apply the viewport state
          setZoom(activeVP.zoom);
          setPan(activeVP.pan);
          setRotation(activeVP.rotation);
          
          // Apply to canvas with animation
          applyCanvasTransform(activeVP.zoom, activeVP.pan, activeVP.rotation, true);
        }
      }
      
      return newIndex;
    });
  }, [navigationHistory, applyCanvasTransform]);

  // Viewport management
  const addViewport = useCallback(() => {
    const newViewport: Viewport = {
      id: `viewport-${Date.now()}`,
      zoom: initialZoom,
      pan: { ...initialPan },
      rotation: initialRotation,
      focusArea: null
    };
    
    setViewports(prev => [...prev, newViewport]);
    setActiveViewportId(newViewport.id);
    
    // If we're in single view mode, switch to split or grid
    if (viewMode === 'single') {
      setViewMode('split');
    }
    
    addToHistory();
  }, [initialZoom, initialPan, initialRotation, viewMode, addToHistory]);

  const removeViewport = useCallback((id: string) => {
    // Prevent removing the last viewport
    if (viewports.length <= 1) return;
    
    setViewports(prev => {
      const filtered = prev.filter(vp => vp.id !== id);
      
      // If we removed the active viewport, select a different one
      if (id === activeViewportId) {
        setActiveViewportId(filtered[0].id);
        
        // Apply the new active viewport's state
        setZoom(filtered[0].zoom);
        setPan(filtered[0].pan);
        setRotation(filtered[0].rotation);
        
        // Apply to canvas
        if (canvas) {
          applyCanvasTransform(filtered[0].zoom, filtered[0].pan, filtered[0].rotation, true);
        }
      }
      
      // If we're down to one viewport, switch to single mode
      if (filtered.length === 1) {
        setViewMode('single');
      }
      
      return filtered;
    });
    
    addToHistory();
  }, [viewports.length, activeViewportId, canvas, applyCanvasTransform, addToHistory]);

  const switchToViewport = useCallback((id: string) => {
    const viewport = viewports.find(vp => vp.id === id);
    if (!viewport) return;
    
    setActiveViewportId(id);
    
    // Apply the viewport's state
    setZoom(viewport.zoom);
    setPan(viewport.pan);
    setRotation(viewport.rotation);
    
    // Apply to canvas with animation
    applyCanvasTransform(viewport.zoom, viewport.pan, viewport.rotation, true);
    
    addToHistory();
  }, [viewports, applyCanvasTransform, addToHistory]);

  // Combine all transformations for CSS transform
  const canvasTransform = useMemo(() => {
    return `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`;
  }, [zoom, rotation, pan]);

  // Return all controls and state
  return {
    // State
    zoom,
    rotation,
    pan,
    viewMode,
    viewports,
    activeViewportId,
    activeViewport,
    isAnimating,
    navigationHistory,
    historyIndex,
    canvasTransform,
    
    // Methods
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleRotateClockwise,
    handleRotateCounterClockwise,
    handleRotateReset,
    handlePan,
    handlePanReset,
    handleViewModeToggle,
    handleApplyFocusArea,
    handleResetFocusArea,
    navigateHistory,
    addViewport,
    removeViewport,
    switchToViewport,
    addToHistory,
    applyCanvasTransform
  };
}
