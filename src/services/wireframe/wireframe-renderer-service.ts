import { fabric } from 'fabric';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { COMPONENT_TYPE_MAPPING } from './component-type-mapping';

/**
 * Service responsible for rendering AI-generated wireframes to a Fabric.js canvas
 */
export class WireframeRendererService {
  /**
   * Render a complete wireframe to a Fabric.js canvas
   * @param canvas The Fabric.js canvas instance
   * @param wireframe The wireframe data to render
   * @param options Rendering options
   */
  public renderWireframeToCanvas(
    canvas: fabric.Canvas,
    wireframe: WireframeData,
    options: {
      deviceType?: 'desktop' | 'tablet' | 'mobile';
      darkMode?: boolean;
      config?: Partial<WireframeCanvasConfig>;
      interactive?: boolean;
      renderGrid?: boolean;
    } = {}
  ): void {
    if (!canvas || !wireframe) {
      console.error("Cannot render wireframe: Canvas or wireframe data is missing");
      return;
    }
    
    try {
      // Clear existing canvas content
      canvas.clear();
      
      // Apply canvas configuration
      const {
        deviceType = 'desktop',
        darkMode = false,
        config = {},
        interactive = true,
        renderGrid = true
      } = options;
      
      // Set canvas background color
      const backgroundColor = wireframe.colorScheme?.background || 
        (darkMode ? '#1a1a1a' : '#ffffff');
      canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas));
      
      // Apply device-specific sizing
      this.applyDeviceSpecificSizing(canvas, deviceType);
      
      // Render grid if enabled
      if (renderGrid && config.showGrid) {
        this.renderGrid(canvas, config.gridSize || 20, config.gridColor || '#e0e0e0', darkMode);
      }
      
      // Sort sections by their position for proper layering
      const sortedSections = this.getSortedSections(wireframe.sections);
      
      // Track Y position for sections that don't have explicit positioning
      let currentYPosition = 20;
      const canvasWidth = canvas.getWidth();
      
      // Render each section
      sortedSections.forEach((section) => {
        if (!section) return;
        
        // Calculate section position based on available data or use auto-layout
        const sectionPosition = this.calculateSectionPosition(
          section, 
          currentYPosition, 
          canvasWidth, 
          deviceType
        );
        
        // Update tracking position for next section if this uses auto-layout
        currentYPosition = sectionPosition.y + (section.dimensions?.height || 200) + 20;
        
        // Render the section and its components
        this.renderSection(canvas, section, {
          position: sectionPosition,
          deviceType,
          darkMode,
          interactive,
          wireframeStyle: wireframe.style,
          colorScheme: wireframe.colorScheme
        });
      });
      
      // Final canvas update
      canvas.renderAll();
    } catch (error) {
      console.error("Error rendering wireframe to canvas:", error);
      throw new Error(`Wireframe rendering failed: ${error.message}`);
    }
  }
  
  /**
   * Render a specific section to the canvas
   */
  private renderSection(
    canvas: fabric.Canvas,
    section: WireframeSection,
    options: {
      position: { x: number; y: number };
      deviceType: 'desktop' | 'tablet' | 'mobile';
      darkMode: boolean;
      interactive: boolean;
      wireframeStyle?: string | object;
      colorScheme?: any;
    }
  ): fabric.Group {
    const {
      position,
      deviceType,
      darkMode,
      interactive,
      wireframeStyle,
      colorScheme
    } = options;
    
    // Calculate dimensions based on device type and section settings
    const width = this.calculateSectionWidth(section, deviceType, canvas.getWidth());
    const height = section.dimensions?.height || 200;
    
    // Get section style based on type and theme settings
    const sectionStyle = this.getSectionStyle(section, {
      darkMode,
      wireframeStyle,
      colorScheme
    });
    
    // Create section background
    const background = new fabric.Rect({
      left: 0,
      top: 0,
      width,
      height,
      fill: sectionStyle.backgroundColor,
      stroke: sectionStyle.borderColor,
      strokeWidth: 1,
      rx: 3,
      ry: 3,
      opacity: sectionStyle.opacity || 1
    });
    
    // Create section title
    const title = new fabric.Text(section.name || `${section.sectionType || 'Section'}`, {
      left: 10,
      top: 10,
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      fill: sectionStyle.textColor
    });
    
    // Create section type label
    const typeLabel = new fabric.Text(section.sectionType || 'generic', {
      left: 10,
      top: 30,
      fontSize: 12,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'italic',
      fill: sectionStyle.textColor,
      opacity: 0.7
    });
    
    // Create section objects array, starting with background and labels
    const sectionObjects: fabric.Object[] = [background, title, typeLabel];
    
    // Render section components if they exist
    if (section.components && Array.isArray(section.components) && section.components.length > 0) {
      // Calculate component layout based on section layout type
      const componentLayout = this.calculateComponentLayout(section, width, height);
      
      // Add each component to the section
      section.components.forEach((component, index) => {
        if (!component) return;
        
        // Get position for this component based on layout
        const componentPosition = componentLayout[index] || { x: 10, y: 50 + (index * 40) };
        
        // Create Fabric.js object for this component type
        const fabricComponent = this.createComponentObject(component, {
          left: componentPosition.x,
          top: componentPosition.y,
          darkMode,
          sectionStyle,
          colorScheme,
          deviceType
        });
        
        if (fabricComponent) {
          sectionObjects.push(fabricComponent);
        }
      });
    }
    
    // Create a group for the entire section
    const sectionGroup = new fabric.Group(sectionObjects, {
      left: position.x,
      top: position.y,
      selectable: interactive,
      hasControls: interactive,
      hasBorders: interactive,
      lockRotation: true,
      subTargetCheck: true,
      data: {
        id: section.id || uuidv4(),
        type: 'section',
        sectionType: section.sectionType,
        name: section.name,
        originalSection: section
      }
    });
    
    // Add the section group to the canvas
    canvas.add(sectionGroup);
    
    return sectionGroup;
  }
  
  /**
   * Create a Fabric.js object representing a component based on its type
   */
  private createComponentObject(
    component: any,
    options: {
      left: number;
      top: number;
      darkMode: boolean;
      sectionStyle: any;
      colorScheme?: any;
      deviceType: 'desktop' | 'tablet' | 'mobile';
    }
  ): fabric.Object | null {
    if (!component || !component.type) return null;
    
    const {
      left,
      top,
      darkMode,
      sectionStyle,
      colorScheme,
      deviceType
    } = options;
    
    // Get width and height for the component
    const width = component.dimensions?.width || 160;
    const height = component.dimensions?.height || 40;
    
    // Map component type to a rendering function
    const componentType = component.type.toLowerCase();
    
    // Use the component type mapping to create the object
    if (COMPONENT_TYPE_MAPPING[componentType]) {
      return COMPONENT_TYPE_MAPPING[componentType](component, {
        left,
        top,
        width,
        height,
        darkMode,
        sectionStyle,
        colorScheme,
        deviceType
      });
    }
    
    // Default fallback for unknown component types
    const textColor = darkMode ? '#e2e8f0' : '#333333';
    const backgroundColor = darkMode ? '#2d3748' : '#f9f9f9';
    
    // Create generic component representation
    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      width,
      height,
      fill: backgroundColor,
      stroke: darkMode ? '#4a5568' : '#ddd',
      strokeWidth: 1,
      rx: 3,
      ry: 3
    });
    
    const label = new fabric.Text(component.content || component.type || 'Component', {
      left: 5,
      top: height / 2 - 7,
      fontSize: 12,
      fontFamily: 'Arial, sans-serif',
      fill: textColor
    });
    
    return new fabric.Group([rect, label], {
      left,
      top,
      data: {
        componentType: component.type,
        id: component.id || uuidv4(),
        originalComponent: component
      }
    });
  }
  
  /**
   * Calculate the width of a section based on device type
   */
  private calculateSectionWidth(
    section: WireframeSection, 
    deviceType: 'desktop' | 'tablet' | 'mobile', 
    canvasWidth: number
  ): number {
    // Use section's explicit width if available
    if (section.dimensions?.width) {
      return section.dimensions.width;
    }
    
    // Calculate width based on device type
    switch (deviceType) {
      case 'mobile':
        return Math.min(canvasWidth - 40, 350);
      case 'tablet':
        return Math.min(canvasWidth - 40, 700);
      case 'desktop':
      default:
        return canvasWidth - 40;
    }
  }
  
  /**
   * Calculate the position of a section
   */
  private calculateSectionPosition(
    section: WireframeSection,
    defaultY: number,
    canvasWidth: number,
    deviceType: 'desktop' | 'tablet' | 'mobile'
  ): { x: number; y: number } {
    // Use explicit positioning if available
    if (section.position?.x !== undefined && section.position?.y !== undefined) {
      return { x: section.position.x, y: section.position.y };
    }
    
    // Default to centered horizontally
    const x = 20;
    const y = section.position?.y || defaultY;
    
    return { x, y };
  }
  
  /**
   * Get the style for a section based on its type and theme settings
   */
  private getSectionStyle(
    section: WireframeSection,
    options: { 
      darkMode: boolean; 
      wireframeStyle?: string | object;
      colorScheme?: any;
    }
  ): {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    opacity: number;
  } {
    const { darkMode, wireframeStyle, colorScheme } = options;
    
    // Default styles based on dark mode
    const defaultBackgroundColor = darkMode ? '#2d3748' : '#f9f9f9';
    const defaultBorderColor = darkMode ? '#4a5568' : '#e5e7eb';
    const defaultTextColor = darkMode ? '#e2e8f0' : '#333333';
    
    // Use section-specific background color if available
    let backgroundColor = section.backgroundColor || 
      section.style?.backgroundColor || 
      defaultBackgroundColor;
    
    // Apply custom color scheme if available
    if (colorScheme) {
      // Map section type to color scheme
      switch (section.sectionType?.toLowerCase()) {
        case 'hero':
          backgroundColor = colorScheme.primary || backgroundColor;
          break;
        case 'features':
          backgroundColor = colorScheme.secondary || backgroundColor;
          break;
        case 'footer':
          backgroundColor = darkMode ? '#1f2937' : '#f3f4f6';
          break;
        // Add more mappings as needed
      }
    }
    
    // Calculate opacity based on section type
    let opacity = 1;
    if (['hero', 'features', 'cta'].includes(section.sectionType?.toLowerCase() || '')) {
      opacity = darkMode ? 0.15 : 0.1;
    }
    
    // Return consistent style object
    return {
      backgroundColor,
      borderColor: section.style?.borderColor || defaultBorderColor,
      textColor: section.style?.color || defaultTextColor,
      opacity: section.style?.opacity || opacity
    };
  }
  
  /**
   * Calculate component layout within a section
   */
  private calculateComponentLayout(
    section: WireframeSection,
    width: number,
    height: number
  ): Array<{ x: number; y: number }> {
    const positions: Array<{ x: number; y: number }> = [];
    
    if (!section.components || !Array.isArray(section.components)) {
      return positions;
    }
    
    // Extract layout type from section
    const layoutType = section.layoutType || 
      (typeof section.layout === 'string' ? section.layout : section.layout?.type) || 
      'vertical';
    
    switch (layoutType.toLowerCase()) {
      case 'grid':
        // Calculate grid layout
        const columns = section.layout?.columns || 3;
        const gap = section.layout?.gap || 10;
        const itemWidth = (width - ((columns + 1) * gap)) / columns;
        
        section.components.forEach((component, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          
          positions.push({
            x: gap + (col * (itemWidth + gap)),
            y: 50 + gap + (row * (40 + gap))
          });
        });
        break;
        
      case 'horizontal':
        // Calculate horizontal layout
        const hGap = section.layout?.gap || 10;
        let currentX = 10;
        
        section.components.forEach((component) => {
          positions.push({ x: currentX, y: 50 });
          currentX += (component.dimensions?.width || 100) + hGap;
        });
        break;
        
      case 'vertical':
      default:
        // Calculate vertical layout
        const vGap = section.layout?.gap || 10;
        let currentY = 50;
        
        section.components.forEach((component) => {
          positions.push({ x: 10, y: currentY });
          currentY += (component.dimensions?.height || 30) + vGap;
        });
        break;
    }
    
    return positions;
  }
  
  /**
   * Sort sections by their position for proper rendering order
   */
  private getSortedSections(sections: any[]): any[] {
    if (!sections || !Array.isArray(sections)) {
      return [];
    }
    
    return [...sections].sort((a, b) => {
      // Sort by explicit y position if available
      if (a.position?.y !== undefined && b.position?.y !== undefined) {
        return a.position.y - b.position.y;
      }
      
      // Sort by position order if available
      if (a.positionOrder !== undefined && b.positionOrder !== undefined) {
        return a.positionOrder - b.positionOrder;
      }
      
      // Default sort by index in the original array
      return 0;
    });
  }
  
  /**
   * Apply device-specific sizing to the canvas
   */
  private applyDeviceSpecificSizing(
    canvas: fabric.Canvas, 
    deviceType: 'desktop' | 'tablet' | 'mobile'
  ): void {
    // Keep existing width
    const currentWidth = canvas.getWidth();
    
    switch (deviceType) {
      case 'mobile':
        // Limit width for mobile preview
        if (currentWidth > 400) {
          canvas.setWidth(375);
        }
        break;
      case 'tablet':
        // Limit width for tablet preview
        if (currentWidth > 800) {
          canvas.setWidth(768);
        }
        break;
      // Desktop uses the full width
    }
  }
  
  /**
   * Render a grid on the canvas
   */
  private renderGrid(
    canvas: fabric.Canvas, 
    gridSize: number = 20,
    gridColor: string = '#e0e0e0',
    darkMode: boolean = false
  ): void {
    // Use a lighter grid color for dark mode
    const effectiveGridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : gridColor;
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    // Create vertical lines
    for (let i = 0; i < width / gridSize; i++) {
      const line = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
        stroke: effectiveGridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        data: { type: 'grid' }
      });
      canvas.add(line);
      line.sendToBack();
    }
    
    // Create horizontal lines
    for (let i = 0; i < height / gridSize; i++) {
      const line = new fabric.Line([0, i * gridSize, width, i * gridSize], {
        stroke: effectiveGridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        data: { type: 'grid' }
      });
      canvas.add(line);
      line.sendToBack();
    }
  }
}

// Create singleton instance
export const wireframeRendererService = new WireframeRendererService();
