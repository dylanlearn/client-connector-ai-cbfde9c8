import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '../utils/types';
import { createCanvasGrid } from '../utils/grid-utils';

interface WireframeCanvasEngineProps {
  width?: number;
  height?: number;
}

const WireframeCanvasEngine: React.FC<WireframeCanvasEngineProps> = ({ width = 1200, height = 800 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update the config object to include gridColor
  const [config, setConfig] = useState<WireframeCanvasConfig>({
    width: 1200,
    height: 800,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    gridType: 'lines',
    snapTolerance: 5,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    showRulers: true,
    rulerSize: 20,
    rulerColor: '#bbbbbb',
    rulerMarkings: true,
    gridColor: '#e0e0e0'
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor
    });

    setCanvas(fabricCanvas);
    setIsInitialized(true);

    if (config.showGrid) {
      const gridLines = createCanvasGrid(fabricCanvas, config.gridSize, config.gridType);
      gridLines.forEach(line => fabricCanvas.add(line));
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, [config.width, config.height, config.backgroundColor, config.showGrid, config.gridSize, config.gridType]);

  return (
    <canvas ref={canvasRef} width={width} height={height} />
  );
};

export default WireframeCanvasEngine;
