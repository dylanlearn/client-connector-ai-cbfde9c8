
import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '../utils/types';
import { useCanvasInitialization } from './useCanvasInitialization';
import { useSectionRenderer } from './useSectionRenderer';
import { useCanvasPerformance } from '../hooks/useCanvasPerformance';
import DragEnhancementHandler from './DragEnhancementHandler';
import CanvasLoadingIndicator from './CanvasLoadingIndicator';
import CanvasErrorDisplay from './CanvasErrorDisplay';
import { EnhancedCanvasEngineProps } from '../types/canvas-types';
import SmartGuideSystem from '../guides/SmartGuideSystem';

/**
 * Enhanced Canvas Engine Component with TypeScript-safe implementation
 * and performance optimizations
 */
const EnhancedCanvasEngine: React.FC<EnhancedCanvasEngineProps> = ({
  width = 1200,
  height = 800,
  canvasConfig = {},
  sections = [],
  className,
  onSectionClick,
  onObjectsSelected,
  onObjectModified,
  onCanvasReady,
  onRenderComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderStartTimeRef = useRef<number>(0);
  
  // Default configuration
  const defaultConfig: WireframeCanvasConfig = {
    width,
    height,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    gridType: 'lines',
    snapTolerance: 5,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    gridColor: '#e0e0e0'
  };
  
  // Merged configuration
  const config = { ...defaultConfig, ...canvasConfig };
  
  // Performance options
  const performanceOptions = {
    enableCaching: true,
    objectCaching: true,
    skipOffscreen: true,
    enableRetina: window.devicePixelRatio < 2, // Disable for high-DPI devices
    renderBatchSize: 50
  };
  
  // Initialize canvas using our custom hook
  const { fabricCanvas, isLoading, error } = useCanvasInitialization(
    canvasRef,
    config,
    onObjectsSelected,
    onObjectModified,
    onCanvasReady,
    performanceOptions
  );
  
  // Performance monitoring
  const { renderStats, optimizeCanvas } = useCanvasPerformance(fabricCanvas, performanceOptions);
  
  // Render sections using our custom hook
  useSectionRenderer(
    fabricCanvas, 
    sections,
    {
      showGrid: config.showGrid,
      gridSize: config.gridSize
    },
    onSectionClick
  );

  // Track rendering performance
  useEffect(() => {
    if (renderStartTimeRef.current === 0 && !isLoading && fabricCanvas) {
      renderStartTimeRef.current = performance.now();
      
      // Optimize after initial render is complete
      const timeoutId = setTimeout(() => {
        optimizeCanvas();
        
        const renderTime = performance.now() - renderStartTimeRef.current;
        console.debug(`Canvas render complete in ${renderTime.toFixed(2)}ms`);
        
        if (onRenderComplete) {
          onRenderComplete();
        }
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, fabricCanvas, optimizeCanvas, onRenderComplete]);

  // Adjust canvas for device pixel ratio (for retina displays)
  useEffect(() => {
    if (fabricCanvas && window.devicePixelRatio > 1) {
      const canvasElement = fabricCanvas.getElement();
      const context = canvasElement.getContext('2d');
      
      if (context && performanceOptions.enableRetina) {
        // Scale the canvas for high-DPI displays
        const ratio = window.devicePixelRatio;
        canvasElement.width = config.width * ratio;
        canvasElement.height = config.height * ratio;
        canvasElement.style.width = `${config.width}px`;
        canvasElement.style.height = `${config.height}px`;
        
        context.scale(ratio, ratio);
        fabricCanvas.renderAll();
      }
    }
  }, [fabricCanvas, config.width, config.height, performanceOptions.enableRetina]);
  
  return (
    <div className={className ? className : "enhanced-canvas-container relative"}>
      <canvas ref={canvasRef} />
      
      <CanvasLoadingIndicator isLoading={isLoading} />
      <CanvasErrorDisplay error={error || null} />
      
      {/* Render stats (development only) */}
      {process.env.NODE_ENV === 'development' && fabricCanvas && (
        <div className="absolute bottom-2 right-2 bg-muted/60 text-xs p-1 rounded">
          {renderStats.frameRate > 0 ? (
            <>
              {renderStats.frameRate} FPS | {renderStats.objectCount} objects
              {renderStats.memoryUsage && ` | ${renderStats.memoryUsage} MB`}
            </>
          ) : null}
        </div>
      )}
      
      {/* Smart Guide System */}
      {fabricCanvas && config.showSmartGuides && (
        <SmartGuideSystem
          canvas={fabricCanvas}
          enabled={config.showSmartGuides}
          guideColor={config.guideColor || 'rgba(0, 120, 255, 0.8)'}
          snapThreshold={config.snapTolerance}
          showEdgeGuides={config.showEdgeGuides}
          showCenterGuides={config.showCenterGuides}
          showDistanceIndicators={config.showDistanceIndicators}
          magneticStrength={config.magneticStrength || 5}
        />
      )}
      
      {/* Drag Enhancement Handler */}
      {fabricCanvas && (
        <DragEnhancementHandler
          canvas={fabricCanvas}
          enabled={config.snapToGrid}
          gridConfig={{
            visible: config.showGrid,
            size: config.gridSize,
            snapToGrid: config.snapToGrid,
            type: config.gridType,
            columns: 12,
            gutterWidth: 20,
            marginWidth: 40,
            snapThreshold: config.snapTolerance,
            showGuides: false, // Disable legacy guides, use our new system
            guideColor: 'rgba(0, 120, 255, 0.75)',
            showRulers: true,
            rulerSize: 20
          }}
          width={config.width}
          height={config.height}
          showDropIndicators={true}
        />
      )}
    </div>
  );
};

export default EnhancedCanvasEngine;
