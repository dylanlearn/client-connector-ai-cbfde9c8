
/**
 * Utilities for creating and managing alignment guides in device preview
 */

/**
 * Guide type definition
 */
export interface Guide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'margin' | 'grid' | 'center' | 'element';
  label?: string;
  color?: string;
}

/**
 * Generate guides for a specific device viewport
 */
export function generateDeviceGuides(width: number, height: number): Guide[] {
  const guides: Guide[] = [];
  
  // Center guides
  guides.push({
    position: width / 2,
    orientation: 'vertical',
    type: 'center',
    label: 'Center',
    color: 'rgba(0, 128, 255, 0.5)'
  });
  
  guides.push({
    position: height / 2,
    orientation: 'horizontal',
    type: 'center',
    label: 'Center',
    color: 'rgba(0, 128, 255, 0.5)'
  });
  
  // Margin guides (common values: 16px, 24px)
  const margins = [16, 24];
  margins.forEach(margin => {
    guides.push({
      position: margin,
      orientation: 'vertical',
      type: 'margin',
      label: `${margin}px`,
      color: 'rgba(255, 0, 0, 0.3)'
    });
    
    guides.push({
      position: width - margin,
      orientation: 'vertical',
      type: 'margin',
      label: `${margin}px`,
      color: 'rgba(255, 0, 0, 0.3)'
    });
    
    guides.push({
      position: margin,
      orientation: 'horizontal',
      type: 'margin',
      label: `${margin}px`,
      color: 'rgba(255, 0, 0, 0.3)'
    });
    
    guides.push({
      position: height - margin,
      orientation: 'horizontal',
      type: 'margin',
      label: `${margin}px`,
      color: 'rgba(255, 0, 0, 0.3)'
    });
  });
  
  return guides;
}

/**
 * Draw guides on a canvas element
 */
export function drawGuidesOnCanvas(
  ctx: CanvasRenderingContext2D,
  guides: Guide[],
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);
  
  guides.forEach(guide => {
    ctx.beginPath();
    ctx.strokeStyle = guide.color || 'rgba(0, 0, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    if (guide.orientation === 'horizontal') {
      ctx.moveTo(0, guide.position);
      ctx.lineTo(width, guide.position);
    } else {
      ctx.moveTo(guide.position, 0);
      ctx.lineTo(guide.position, height);
    }
    
    ctx.stroke();
    
    // Draw label if provided
    if (guide.label) {
      ctx.font = '10px sans-serif';
      ctx.fillStyle = guide.color || 'rgba(0, 0, 255, 0.7)';
      ctx.textAlign = 'center';
      
      if (guide.orientation === 'horizontal') {
        ctx.fillText(guide.label, 30, guide.position - 5);
      } else {
        ctx.fillText(guide.label, guide.position, 15);
      }
    }
  });
}

/**
 * Create HTML elements for guides
 */
export function createGuideElements(
  guides: Guide[],
  container: HTMLElement
) {
  // Remove existing guides
  const existingGuides = container.querySelectorAll('.alignment-guide');
  existingGuides.forEach(el => el.remove());
  
  // Create new guides
  guides.forEach(guide => {
    const guideEl = document.createElement('div');
    guideEl.className = `alignment-guide guide-${guide.orientation} guide-${guide.type}`;
    guideEl.style.position = 'absolute';
    guideEl.style.backgroundColor = guide.color || 'rgba(0, 0, 255, 0.5)';
    
    if (guide.orientation === 'horizontal') {
      guideEl.style.left = '0';
      guideEl.style.right = '0';
      guideEl.style.top = `${guide.position}px`;
      guideEl.style.height = '1px';
    } else {
      guideEl.style.top = '0';
      guideEl.style.bottom = '0';
      guideEl.style.left = `${guide.position}px`;
      guideEl.style.width = '1px';
    }
    
    if (guide.label) {
      const labelEl = document.createElement('span');
      labelEl.className = 'guide-label';
      labelEl.textContent = guide.label;
      labelEl.style.position = 'absolute';
      labelEl.style.fontSize = '10px';
      labelEl.style.backgroundColor = 'white';
      labelEl.style.padding = '0 4px';
      labelEl.style.borderRadius = '2px';
      labelEl.style.color = guide.color || 'rgba(0, 0, 255, 1)';
      
      if (guide.orientation === 'horizontal') {
        labelEl.style.left = '4px';
        labelEl.style.top = `${guide.position - 15}px`;
      } else {
        labelEl.style.left = `${guide.position + 4}px`;
        labelEl.style.top = '4px';
      }
      
      guideEl.appendChild(labelEl);
    }
    
    container.appendChild(guideEl);
  });
}
