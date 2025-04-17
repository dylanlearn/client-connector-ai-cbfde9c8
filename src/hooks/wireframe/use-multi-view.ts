
import { useState, useCallback } from 'react';
import { ViewMode } from '@/components/wireframe/controls/CanvasViewportControls';

export interface ViewportConfig {
  zoom: number;
  rotation: number;
  pan: { x: number; y: number };
  focusSection?: string | null;
}

export function useMultiView() {
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  
  // For split and grid view modes, we need to track viewport configs separately
  const [viewports, setViewports] = useState<ViewportConfig[]>([
    // Primary viewport
    { zoom: 1, rotation: 0, pan: { x: 0, y: 0 }, focusSection: null },
    // Secondary viewport (for split view)
    { zoom: 1, rotation: 0, pan: { x: 0, y: 0 }, focusSection: null },
    // Additional viewports for grid view (2x2 grid)
    { zoom: 1, rotation: 0, pan: { x: 0, y: 0 }, focusSection: null },
    { zoom: 1, rotation: 0, pan: { x: 0, y: 0 }, focusSection: null }
  ]);

  // Update a specific viewport's config
  const updateViewport = useCallback((index: number, config: Partial<ViewportConfig>) => {
    setViewports(prev => 
      prev.map((viewport, i) => 
        i === index ? { ...viewport, ...config } : viewport
      )
    );
  }, []);

  // Get the appropriate configuration for the current layout
  const getViewportLayout = useCallback(() => {
    switch(viewMode) {
      case 'single':
        return [{ ...viewports[0], width: '100%', height: '100%' }];
      case 'split':
        return [
          { ...viewports[0], width: '50%', height: '100%' },
          { ...viewports[1], width: '50%', height: '100%' }
        ];
      case 'grid':
        return [
          { ...viewports[0], width: '50%', height: '50%' },
          { ...viewports[1], width: '50%', height: '50%' },
          { ...viewports[2], width: '50%', height: '50%' },
          { ...viewports[3], width: '50%', height: '50%' }
        ];
      default:
        return [{ ...viewports[0], width: '100%', height: '100%' }];
    }
  }, [viewMode, viewports]);

  // Synchronize all viewports with the same configuration
  const syncViewports = useCallback((config: Partial<ViewportConfig>) => {
    setViewports(prev => prev.map(viewport => ({ ...viewport, ...config })));
  }, []);

  return {
    viewMode,
    setViewMode,
    viewports,
    updateViewport,
    getViewportLayout,
    syncViewports
  };
}
