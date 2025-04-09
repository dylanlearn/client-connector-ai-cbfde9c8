
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from './types';

/**
 * Serializes a Fabric.js canvas state to JSON
 */
export function serializeCanvas(
  canvas: fabric.Canvas, 
  includeConfig: boolean = true,
  config?: WireframeCanvasConfig
): string {
  if (!canvas) return '';
  
  try {
    const canvasJSON = canvas.toJSON(['id', 'name', 'data']);
    
    if (includeConfig && config) {
      return JSON.stringify({
        canvas: canvasJSON,
        config
      });
    }
    
    return JSON.stringify(canvasJSON);
  } catch (error) {
    console.error('Error serializing canvas:', error);
    return '';
  }
}

/**
 * Deserializes a JSON string to restore a Fabric.js canvas state
 */
export function deserializeCanvas(
  canvas: fabric.Canvas,
  serializedData: string,
  onComplete?: () => void
): WireframeCanvasConfig | null {
  if (!canvas || !serializedData) return null;
  
  try {
    const data = JSON.parse(serializedData);
    
    // Check if the data includes both canvas and config
    if (data.canvas && data.config) {
      // Load the canvas objects
      canvas.loadFromJSON(data.canvas, () => {
        if (onComplete) onComplete();
      });
      
      // Return the config
      return data.config;
    } else {
      // Assume it's just canvas data
      canvas.loadFromJSON(data, () => {
        if (onComplete) onComplete();
      });
      
      return null;
    }
  } catch (error) {
    console.error('Error deserializing canvas:', error);
    return null;
  }
}

/**
 * Export canvas as an image data URL
 */
export function exportCanvasAsImage(
  canvas: fabric.Canvas,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 1,
  multiplier: number = 1
): string {
  if (!canvas) return '';
  
  return canvas.toDataURL({
    format,
    quality,
    multiplier
  });
}

/**
 * Save canvas state to localStorage
 */
export function saveCanvasToLocalStorage(
  canvas: fabric.Canvas,
  key: string,
  config?: WireframeCanvasConfig
): boolean {
  if (!canvas || !key) return false;
  
  try {
    const serializedData = serializeCanvas(canvas, true, config);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving canvas to localStorage:', error);
    return false;
  }
}

/**
 * Load canvas state from localStorage
 */
export function loadCanvasFromLocalStorage(
  canvas: fabric.Canvas,
  key: string,
  onComplete?: () => void
): WireframeCanvasConfig | null {
  if (!canvas || !key) return null;
  
  try {
    const serializedData = localStorage.getItem(key);
    if (!serializedData) return null;
    
    return deserializeCanvas(canvas, serializedData, onComplete);
  } catch (error) {
    console.error('Error loading canvas from localStorage:', error);
    return null;
  }
}

/**
 * Create a downloadable file from canvas data
 */
export function downloadCanvasData(
  canvas: fabric.Canvas, 
  filename: string = 'canvas-data.json',
  includeConfig: boolean = true,
  config?: WireframeCanvasConfig
): void {
  if (!canvas) return;
  
  try {
    const serializedData = serializeCanvas(canvas, includeConfig, config);
    const blob = new Blob([serializedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading canvas data:', error);
  }
}

/**
 * Create a downloadable image from canvas
 */
export function downloadCanvasImage(
  canvas: fabric.Canvas, 
  filename: string = 'canvas-image.png',
  format: 'png' | 'jpeg' | 'webp' = 'png'
): void {
  if (!canvas) return;
  
  try {
    const dataUrl = exportCanvasAsImage(canvas, format);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Error downloading canvas image:', error);
  }
}
