import { fabric } from 'fabric';

export interface AlignmentGuide {
  orientation: 'horizontal' | 'vertical';
  position: number;
  type: 'edge' | 'center' | 'distribution' | 'grid' | 'left-edge' | 'right-edge' | 'top-edge' | 'bottom-edge' | 'equal-spacing';
  strength?: number;
  label?: string;
}

export interface GridConfiguration {
  visible: boolean;
  size: number;
  snapToGrid: boolean;
  type: 'lines' | 'dots' | 'columns';
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  snapThreshold: number;
  showGuides: boolean;
  guideColor: string;
  showRulers: boolean;
  rulerSize: number;
}

export interface GridVisualSettings {
  lineColor: string;
  lineThickness: number;
  dotSize: number;
  opacity: number;
  showLabels: boolean;
  labelColor: string;
}

export const DEFAULT_GRID_CONFIG: GridConfiguration = {
  visible: true,
  size: 10,
  snapToGrid: true,
  type: 'lines',
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  snapThreshold: 5,
  showGuides: true,
  guideColor: 'rgba(0, 120, 255, 0.75)',
  showRulers: true,
  rulerSize: 20
};

export const DEFAULT_VISUAL_SETTINGS: GridVisualSettings = {
  lineColor: '#e0e0e0',
  lineThickness: 1,
  dotSize: 2,
  opacity: 0.5,
  showLabels: false,
  labelColor: '#888888'
};

// Implement the primary grid functions
export function updateGridOnCanvas(canvas: fabric.Canvas, config: GridConfiguration, width: number, height: number): void {
  const gridGroup = canvas.getObjectByName('grid') as fabric.Group;
  
  // Remove existing grid
  if (gridGroup) {
    canvas.remove(gridGroup);
  }
  
  if (!config.visible) return;
  
  let gridLines: fabric.Object[] = [];
  
  if (config.type === 'lines') {
    // Vertical lines
    for (let i = 0; i <= (width / config.size); i++) {
      gridLines.push(new fabric.Line([i * config.size, 0, i * config.size, height], {
        stroke: config.guideColor,
        strokeWidth: 1,
        selectable: false,
        evented: false
      }));
    }
    
    // Horizontal lines
    for (let j = 0; j <= (height / config.size); j++) {
      gridLines.push(new fabric.Line([0, j * config.size, width, j * config.size], {
        stroke: config.guideColor,
        strokeWidth: 1,
        selectable: false,
        evented: false
      }));
    }
  } else if (config.type === 'dots') {
    const dotSize = 2;
    for (let x = 0; x < width; x += config.size) {
      for (let y = 0; y < height; y += config.size) {
        gridLines.push(new fabric.Circle({
          left: x,
          top: y,
          radius: dotSize,
          fill: config.guideColor,
          selectable: false,
          evented: false
        }));
      }
    }
  } else if (config.type === 'columns') {
    const columnWidth = (width - config.marginWidth * 2 - (config.columns - 1) * config.gutterWidth) / config.columns;
    let currentX = config.marginWidth;
    
    for (let i = 0; i < config.columns; i++) {
      gridLines.push(new fabric.Rect({
        left: currentX,
        top: 0,
        width: columnWidth,
        height: height,
        fill: 'rgba(0, 120, 255, 0.1)', // Semi-transparent fill
        selectable: false,
        evented: false
      }));
      
      currentX += columnWidth + config.gutterWidth;
    }
  }
  
  const grid = new fabric.Group(gridLines, {
    name: 'grid',
    selectable: false,
    evented: false
  });
  
  canvas.add(grid);
  grid.sendToBack();
  canvas.renderAll();
}

export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  const grid = canvas.getObjectByName('grid');
  if (grid) {
    canvas.remove(grid);
    canvas.renderAll();
  }
}

export function sendGridToBack(canvas: fabric.Canvas): void {
  const grid = canvas.getObjectByName('grid');
  if (grid) {
    grid.sendToBack();
    canvas.renderAll();
  }
}

export function calculateColumnPositions(config: GridConfiguration, canvasWidth: number): number[] {
  const columnWidth = (canvasWidth - config.marginWidth * 2 - (config.columns - 1) * config.gutterWidth) / config.columns;
  let positions: number[] = [];
  let currentX = config.marginWidth;
  
  for (let i = 0; i < config.columns; i++) {
    positions.push(currentX);
    currentX += columnWidth + config.gutterWidth;
  }
  
  return positions;
}

export function findClosestSnapPosition(position: number, snapPositions: number[], threshold: number): number | null {
  let closestPosition: number | null = null;
  let minDistance = threshold;
  
  for (const snapPosition of snapPositions) {
    const distance = Math.abs(position - snapPosition);
    if (distance < minDistance) {
      minDistance = distance;
      closestPosition = snapPosition;
    }
  }
  
  return closestPosition;
}

export function showAlignmentGuides(canvas: fabric.Canvas, guides: AlignmentGuide[], guideColor: string): void {
  guides.forEach(guide => {
    let line;
    if (guide.orientation === 'horizontal') {
      line = new fabric.Line([0, guide.position, canvas.width!, guide.position], {
        stroke: guideColor,
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
    } else {
      line = new fabric.Line([guide.position, 0, guide.position, canvas.height!], {
        stroke: guideColor,
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
    }
    canvas.add(line);
    line.sendToBack();
  });
  canvas.renderAll();
}

export function removeAlignmentGuides(canvas: fabric.Canvas): void {
  canvas.getObjects().forEach(obj => {
    if (obj.type === 'line' && !obj.selectable && !obj.evented) {
      canvas.remove(obj);
    }
  });
  canvas.renderAll();
}
