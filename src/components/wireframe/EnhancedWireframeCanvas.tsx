
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useWireframeRenderer } from '@/hooks/wireframe/use-wireframe-renderer';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import CanvasControls from './controls/CanvasControls';
import CanvasLoadingIndicator from './canvas/CanvasLoadingIndicator';
import CanvasErrorDisplay from './canvas/CanvasErrorDisplay';
import { fabric } from 'fabric';
import { useKeyboardShortcuts } from '@/hooks/wireframe/use-keyboard-shortcuts';
import KeyboardShortcutHandler from './controls/KeyboardShortcutHandler';
import { useEnhancedCanvasNavigation } from '@/hooks/wireframe/use-enhanced-canvas-navigation';
import { toast } from 'sonner';

export interface EnhancedWireframeCanvasProps {
  wireframe: WireframeData | null;
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  canvasConfig?: Partial<WireframeCanvasConfig>;
  className?: string;
  onSectionClick?: (sectionId: string, section: any) => void;
  onRenderComplete?: (canvas: fabric.Canvas) => void;
  interactive?: boolean;
  showControls?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onToggleGrid?: () => void;
  onToggleSnapToGrid?: () => void;
  enableKeyboardShortcuts?: boolean;
}

const EnhancedWireframeCanvas: React.FC<EnhancedWireframeCanvasProps> = ({
  wireframe,
  darkMode = false,
  deviceType = 'desktop',
  canvasConfig = {},
  className,
  onSectionClick,
  onRenderComplete,
  interactive = true,
  showControls = true,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onToggleSnapToGrid,
  enableKeyboardShortcuts = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Default canvas configuration
  const defaultConfig: Partial<WireframeCanvasConfig> = {
    width: 1200,
    height: 800,
    zoom: 1,
    showGrid: true,
    gridSize: 20,
    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
    gridColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0'
  };
  
  // Merge with provided config
  const mergedConfig = { ...defaultConfig, ...canvasConfig };
  
  // Use the wireframe renderer hook
  const {
    canvasRef,
    initializeCanvas,
    renderWireframe,
    isRendering,
    error,
    canvas
  } = useWireframeRenderer({
    darkMode,
    deviceType,
    interactive,
    canvasConfig: mergedConfig,
    onSectionClick,
    onRenderComplete
  });

  // Enhanced navigation
  const navigation = useEnhancedCanvasNavigation({
    enableAnimation: true,
    showMinimap: true
  });

  // Keyboard shortcuts
  const keyboardShortcuts = useKeyboardShortcuts({
    enabled: enableKeyboardShortcuts,
    showToasts: true
  });

  // Register keyboard shortcuts
  useEffect(() => {
    if (enableKeyboardShortcuts && canvas) {
      // Register common shortcuts
      keyboardShortcuts.registerShortcut({
        name: 'delete-selection',
        keys: ['Delete'],
        description: 'Delete selected objects',
        action: () => {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            canvas.remove(activeObject);
            canvas.renderAll();
            toast.success('Object deleted');
          }
        },
        category: 'Objects'
      });

      keyboardShortcuts.registerShortcut({
        name: 'duplicate-selection',
        keys: ['Ctrl', 'd'],
        description: 'Duplicate selected objects',
        action: () => {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            activeObject.clone((clone: fabric.Object) => {
              clone.set({
                left: activeObject.left! + 20,
                top: activeObject.top! + 20
              });
              canvas.add(clone);
              canvas.setActiveObject(clone);
              canvas.renderAll();
              toast.success('Object duplicated');
            });
          }
        },
        category: 'Objects'
      });

      keyboardShortcuts.registerShortcut({
        name: 'show-shortcuts',
        keys: ['?'],
        description: 'Show keyboard shortcuts',
        action: () => {
          keyboardShortcuts.showShortcutsHelp();
        },
        category: 'Help'
      });
    }

    return () => {
      if (enableKeyboardShortcuts) {
        keyboardShortcuts.unregisterShortcut('delete-selection');
        keyboardShortcuts.unregisterShortcut('duplicate-selection');
        keyboardShortcuts.unregisterShortcut('show-shortcuts');
      }
    };
  }, [enableKeyboardShortcuts, canvas, keyboardShortcuts]);
  
  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = initializeCanvas(canvasRef.current);
      
      if (fabricCanvas && wireframe) {
        renderWireframe(wireframe, fabricCanvas, {
          deviceType,
          darkMode
        });
      }
    }
  }, [initializeCanvas, wireframe, deviceType, darkMode, renderWireframe]);
  
  // Handle canvas control actions
  const handleZoomIn = () => {
    if (canvas) {
      navigation.zoomIn();
      const newZoom = navigation.currentZoom;
      canvas.setZoom(newZoom);
      canvas.renderAll();
      
      if (onZoomIn) {
        onZoomIn();
      }
    }
  };
  
  const handleZoomOut = () => {
    if (canvas) {
      navigation.zoomOut();
      const newZoom = navigation.currentZoom;
      canvas.setZoom(newZoom);
      canvas.renderAll();
      
      if (onZoomOut) {
        onZoomOut();
      }
    }
  };
  
  const handleResetZoom = () => {
    if (canvas) {
      navigation.resetTransforms();
      canvas.setZoom(1);
      canvas.absolutePan(new fabric.Point(0, 0));
      canvas.renderAll();
      
      if (onResetZoom) {
        onResetZoom();
      }
    }
  };
  
  const handleToggleGrid = () => {
    if (canvas) {
      // Remove existing grid lines
      const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
      gridObjects.forEach(obj => canvas.remove(obj));
      
      // Create new grid if needed
      const showGrid = !Boolean(gridObjects.length);
      
      if (showGrid) {
        // Re-render with grid
        if (wireframe) {
          renderWireframe(wireframe, canvas, {
            deviceType,
            darkMode,
            renderGrid: true
          });
        }
      } else {
        canvas.renderAll();
      }
      
      if (onToggleGrid) {
        onToggleGrid();
      }
    }
  };

  const handleToggleSnapToGrid = () => {
    if (onToggleSnapToGrid) {
      onToggleSnapToGrid();
    }
  };

  return (
    <div className="enhanced-wireframe-canvas-container">
      {showControls && (
        <CanvasControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onToggleGrid={handleToggleGrid}
          onToggleSnapToGrid={handleToggleSnapToGrid}
          showGrid={mergedConfig.showGrid}
          snapToGrid={mergedConfig.snapToGrid || false}
          className="mb-2"
        />
      )}
      
      <div 
        ref={containerRef}
        className={cn(
          "enhanced-wireframe-canvas relative border rounded-md overflow-hidden transition-all duration-300",
          darkMode ? "bg-gray-900" : "bg-white",
          {
            "opacity-70": isRendering,
          },
          className
        )}
        style={{
          width: `${mergedConfig.width}px`,
          height: `${mergedConfig.height}px`,
          maxWidth: "100%",
          maxHeight: "80vh"
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        
        <CanvasLoadingIndicator isLoading={isRendering} />
        <CanvasErrorDisplay error={error} />

        {/* Add keyboard shortcuts handler */}
        {enableKeyboardShortcuts && canvas && (
          <KeyboardShortcutHandler 
            canvas={canvas}
            onDelete={() => {
              const activeObject = canvas.getActiveObject();
              if (activeObject) {
                canvas.remove(activeObject);
                canvas.renderAll();
              }
            }}
            onDuplicate={() => {
              const activeObject = canvas.getActiveObject();
              if (activeObject) {
                activeObject.clone((clone: fabric.Object) => {
                  clone.set({
                    left: activeObject.left! + 20,
                    top: activeObject.top! + 20
                  });
                  canvas.add(clone);
                  canvas.setActiveObject(clone);
                  canvas.renderAll();
                });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedWireframeCanvas;
