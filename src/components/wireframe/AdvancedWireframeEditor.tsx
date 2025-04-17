
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { ViewMode } from './controls/CanvasViewportControls';
import { FocusArea } from '@/hooks/wireframe/use-canvas-navigation';
import CanvasControls from './controls/CanvasControls';
import AlignmentDistributionControls from './controls/AlignmentDistributionControls';
import SmartGuideSystem from './canvas/SmartGuideSystem';
import { useAlignmentDistribution } from '@/hooks/wireframe/use-alignment-distribution';
import { TooltipProvider } from '@/components/ui/tooltip';

export interface AdvancedWireframeEditorProps {
  width: number;
  height: number;
  zoom: number;
  rotation: number;
  pan?: { x: number; y: number };
  viewMode?: ViewMode;
  viewportIndex?: number;
  onAreaFocus?: (sectionId: string) => void;
  focusSection?: string | null;
  focusArea?: FocusArea | null;
  onCanvasInitialized?: (canvas: fabric.Canvas) => void;
}

const AdvancedWireframeEditor: React.FC<AdvancedWireframeEditorProps> = ({
  width,
  height,
  zoom,
  rotation,
  pan = { x: 0, y: 0 },
  viewMode = 'single',
  viewportIndex = 0,
  onAreaFocus,
  focusSection,
  focusArea,
  onCanvasInitialized
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  
  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create fabric canvas instance
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff'
    });
    
    // Store reference to canvas
    fabricCanvasRef.current = canvas;
    
    // Add some demo content
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      fill: '#6b7280',
      stroke: '#374151',
      strokeWidth: 2
    });
    
    const circle = new fabric.Circle({
      left: 200,
      top: 100,
      radius: 50,
      fill: '#3b82f6',
      stroke: '#2563eb',
      strokeWidth: 2
    });
    
    const text = new fabric.Text('Wireframe Editor', {
      left: 150,
      top: 200,
      fontFamily: 'Arial',
      fontSize: 24
    });
    
    canvas.add(rect, circle, text);
    
    // Setup selection event listeners
    canvas.on('selection:created', (e: fabric.IEvent) => {
      setSelectedObjects(canvas.getActiveObjects());
    });
    
    canvas.on('selection:updated', (e: fabric.IEvent) => {
      setSelectedObjects(canvas.getActiveObjects());
    });
    
    canvas.on('selection:cleared', () => {
      setSelectedObjects([]);
    });
    
    // Notify parent component that canvas is initialized
    if (onCanvasInitialized) {
      onCanvasInitialized(canvas);
    }
    
    // Cleanup on unmount
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [width, height, onCanvasInitialized]);
  
  // Use the alignment and distribution hook
  const { 
    alignLeft,
    alignCenterH,
    alignRight,
    alignTop,
    alignMiddle,
    alignBottom,
    distributeHorizontally,
    distributeVertically,
    spaceEvenlyHorizontal,
    spaceEvenlyVertical
  } = useAlignmentDistribution(fabricCanvasRef.current);

  // Handle zoom and canvas controls
  const handleZoomIn = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.setZoom(fabricCanvasRef.current.getZoom() * 1.1);
  };
  
  const handleZoomOut = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.setZoom(fabricCanvasRef.current.getZoom() / 1.1);
  };
  
  const handleResetZoom = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.setZoom(1);
  };
  
  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
    // Grid implementation would go here
  };
  
  const handleToggleSnapToGrid = () => {
    setSnapToGrid(prev => !prev);
    // Snap to grid implementation would go here
  };
  
  return (
    <div 
      className="advanced-wireframe-editor"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <TooltipProvider>
        <div className="absolute top-4 left-4 z-10 flex gap-4 items-center">
          <CanvasControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            onToggleGrid={handleToggleGrid}
            onToggleSnapToGrid={handleToggleSnapToGrid}
            showGrid={showGrid}
            snapToGrid={snapToGrid}
          />
          
          {selectedObjects.length > 0 && (
            <AlignmentDistributionControls
              onAlignLeft={alignLeft}
              onAlignCenterH={alignCenterH}
              onAlignRight={alignRight}
              onAlignTop={alignTop}
              onAlignMiddle={alignMiddle}
              onAlignBottom={alignBottom}
              onDistributeHorizontally={distributeHorizontally}
              onDistributeVertically={distributeVertically}
              onSpaceEvenlyHorizontal={spaceEvenlyHorizontal}
              onSpaceEvenlyVertical={spaceEvenlyVertical}
              multipleSelected={selectedObjects.length > 1}
            />
          )}
        </div>
      </TooltipProvider>
      
      {/* Smart Guides System */}
      <SmartGuideSystem 
        canvas={fabricCanvasRef.current}
        enabled={true}
        threshold={10}
        snapThreshold={5}
        showLabels={true}
      />
      
      <canvas ref={canvasRef} />
      
      <div className="wireframe-display border border-dashed border-gray-300 bg-white"
        style={{
          width: width * zoom,
          height: height * zoom,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginLeft: -width * zoom / 2 + pan.x,
          marginTop: -height * zoom / 2 + pan.y,
        }}
      >
        <div className="wireframe-content p-4">
          <h3 className="text-lg font-bold mb-2">Wireframe Editor</h3>
          <div className="parameters text-sm">
            <p>Width: {width}px</p>
            <p>Height: {height}px</p>
            <p>Zoom: {zoom.toFixed(2)}x</p>
            <p>Rotation: {rotation}°</p>
            <p>Pan: X={pan.x}px, Y={pan.y}px</p>
            <p>View Mode: {viewMode}</p>
            {viewportIndex !== undefined && <p>Viewport: {viewportIndex + 1}</p>}
            {focusSection && <p>Focus Section: {focusSection}</p>}
          </div>
          
          <div className="sections mt-4">
            <div 
              className="wireframe-section bg-blue-100 border border-blue-300 p-2 mb-2 cursor-pointer"
              onClick={() => onAreaFocus && onAreaFocus('header')}
              data-section-id="header"
            >
              Header Section
            </div>
            <div 
              className="wireframe-section bg-green-100 border border-green-300 p-2 mb-2 cursor-pointer"
              onClick={() => onAreaFocus && onAreaFocus('content')}
              data-section-id="content"
            >
              Content Section
            </div>
            <div 
              className="wireframe-section bg-yellow-100 border border-yellow-300 p-2 mb-2 cursor-pointer"
              onClick={() => onAreaFocus && onAreaFocus('footer')}
              data-section-id="footer"
            >
              Footer Section
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedWireframeEditor;
