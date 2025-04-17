
import { useEffect } from 'react';
import { fabric } from 'fabric';
import { SectionRenderingOptions } from '../utils/types';
import { renderSectionToFabric } from '../utils/fabric-converters';

export function useSectionRenderer(
  fabricCanvas: fabric.Canvas | null,
  sections: any[],
  config: {
    showGrid: boolean;
    gridSize: number;
  },
  onSectionClick?: (id: string, section: any) => void
) {
  // Render sections when available
  useEffect(() => {
    if (!fabricCanvas || !sections || sections.length === 0) return;
    
    // Clear existing sections
    const existingSections = fabricCanvas.getObjects().filter(
      obj => obj.data?.type === 'section'
    );
    existingSections.forEach(section => fabricCanvas.remove(section));
    
    // Render new sections
    sections.forEach(section => {
      const renderingOptions: SectionRenderingOptions = {
        width: section.dimensions?.width || 400,
        height: section.dimensions?.height || 300,
        darkMode: false,
        showGrid: config.showGrid,
        gridSize: config.gridSize,
        responsive: true,
        deviceType: 'desktop',
        interactive: true,
        showBorders: true
      };
      
      const sectionObject = renderSectionToFabric(fabricCanvas, section, renderingOptions);
      
      // Set up section click handler if provided
      if (onSectionClick && sectionObject) {
        sectionObject.on('mousedown', () => {
          onSectionClick(section.id, section);
        });
      }
    });
    
    fabricCanvas.renderAll();
  }, [fabricCanvas, sections, config.showGrid, config.gridSize, onSectionClick]);
}
