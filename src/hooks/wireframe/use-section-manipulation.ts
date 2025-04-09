
import { useState, useCallback, useEffect } from 'react';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeSection } from '@/types/wireframe';

interface SectionPosition {
  [id: string]: {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
    width?: number;
    height?: number;
    rotation?: number;
  };
}

interface ElementBounds {
  id: string;
  bounds: DOMRect;
}

export function useSectionManipulation() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [draggingSection, setDraggingSection] = useState<string | null>(null);
  const [resizingSection, setResizingSection] = useState<string | null>(null);
  const [sectionPositions, setSectionPositions] = useState<SectionPosition>({});
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0 });
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [elementBounds, setElementBounds] = useState<ElementBounds[]>([]);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStart, setRotationStart] = useState(0);

  const { wireframe, updateSection } = useWireframeStore();
  const { snapToGrid, showSmartGuides } = useWireframeStore(state => state.canvasSettings);

  // Update element bounds whenever sections change
  useEffect(() => {
    if (!wireframe.sections) return;
    
    const bounds: ElementBounds[] = [];
    wireframe.sections.forEach(section => {
      const element = document.getElementById(`section-${section.id}`);
      if (element) {
        bounds.push({
          id: section.id,
          bounds: element.getBoundingClientRect()
        });
      }
    });
    
    setElementBounds(bounds);
  }, [wireframe.sections, sectionPositions]);

  // Select a section by ID
  const selectSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    useWireframeStore.getState().setActiveSection(sectionId);
  }, []);

  // Start dragging a section
  const startDragSection = useCallback((sectionId: string, clientX: number, clientY: number) => {
    setDraggingSection(sectionId);
    setDragStart({ x: clientX, y: clientY });

    // Find current section
    const section = wireframe.sections.find(s => s.id === sectionId);
    
    if (section) {
      // Initialize position if it doesn't exist yet
      const currentX = section.position?.x || 0;
      const currentY = section.position?.y || 0;
      
      setSectionPositions(prev => ({
        ...prev,
        [sectionId]: {
          x: currentX,
          y: currentY,
          originalX: currentX,
          originalY: currentY,
          width: section.dimensions?.width,
          height: section.dimensions?.height,
          rotation: section.styleProperties?.rotation || 0
        }
      }));
    }
  }, [wireframe.sections]);

  // Drag a section
  const dragSection = useCallback((clientX: number, clientY: number) => {
    if (!draggingSection) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    // Get original positions
    const originalPosition = sectionPositions[draggingSection] || { 
      x: 0, y: 0, originalX: 0, originalY: 0 
    };
    
    // Calculate new position
    let newX = originalPosition.originalX + deltaX;
    let newY = originalPosition.originalY + deltaY;
    
    // Apply grid snapping if enabled
    if (snapToGrid) {
      const gridSize = useWireframeStore.getState().canvasSettings.gridSize || 8;
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }
    
    // Apply smart guides snapping if enabled
    if (showSmartGuides && draggingSection) {
      const currentElement = document.getElementById(`section-${draggingSection}`);
      if (currentElement) {
        const currentRect = currentElement.getBoundingClientRect();
        const otherBounds = elementBounds.filter(item => item.id !== draggingSection);
        
        // Check for horizontal alignment
        otherBounds.forEach(({ bounds }) => {
          const tolerance = 5;
          
          // Left edge alignment
          if (Math.abs(newX - bounds.left) < tolerance) {
            newX = bounds.left;
          }
          
          // Right edge alignment
          const currentRight = newX + currentRect.width;
          if (Math.abs(currentRight - (bounds.left + bounds.width)) < tolerance) {
            newX = bounds.left + bounds.width - currentRect.width;
          }
          
          // Top edge alignment
          if (Math.abs(newY - bounds.top) < tolerance) {
            newY = bounds.top;
          }
          
          // Bottom edge alignment
          const currentBottom = newY + currentRect.height;
          if (Math.abs(currentBottom - (bounds.top + bounds.height)) < tolerance) {
            newY = bounds.top + bounds.height - currentRect.height;
          }
        });
      }
    }
    
    // Update position with delta
    setSectionPositions(prev => ({
      ...prev,
      [draggingSection as string]: {
        ...originalPosition,
        x: newX,
        y: newY
      }
    }));
  }, [draggingSection, dragStart, sectionPositions, elementBounds, snapToGrid, showSmartGuides]);

  // Start resizing a section
  const startResizeSection = useCallback((sectionId: string, direction: string, clientX: number, clientY: number) => {
    setResizingSection(sectionId);
    setResizeDirection(direction);
    setDragStart({ x: clientX, y: clientY });
    
    // Find current section
    const section = wireframe.sections.find(s => s.id === sectionId);
    if (section) {
      const width = section.dimensions?.width || 200;
      const height = section.dimensions?.height || 100;
      
      setResizeStart({
        width,
        height
      });
      
      setSectionPositions(prev => ({
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] || {}),
          x: section.position?.x || 0,
          y: section.position?.y || 0,
          originalX: section.position?.x || 0,
          originalY: section.position?.y || 0,
          width,
          height
        }
      }));
    }
  }, [wireframe.sections]);

  // Resize a section
  const resizeSection = useCallback((clientX: number, clientY: number) => {
    if (!resizingSection || !resizeDirection) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    const position = sectionPositions[resizingSection];
    if (!position) return;
    
    let newWidth = position.width || 200;
    let newHeight = position.height || 100;
    let newX = position.x;
    let newY = position.y;
    
    // Apply resize based on direction
    switch (resizeDirection) {
      case 'e': // right
        newWidth = Math.max(50, resizeStart.width + deltaX);
        break;
      case 'w': // left
        newWidth = Math.max(50, resizeStart.width - deltaX);
        newX = position.originalX + deltaX;
        break;
      case 's': // bottom
        newHeight = Math.max(50, resizeStart.height + deltaY);
        break;
      case 'n': // top
        newHeight = Math.max(50, resizeStart.height - deltaY);
        newY = position.originalY + deltaY;
        break;
      case 'ne': // top-right
        newWidth = Math.max(50, resizeStart.width + deltaX);
        newHeight = Math.max(50, resizeStart.height - deltaY);
        newY = position.originalY + deltaY;
        break;
      case 'nw': // top-left
        newWidth = Math.max(50, resizeStart.width - deltaX);
        newHeight = Math.max(50, resizeStart.height - deltaY);
        newX = position.originalX + deltaX;
        newY = position.originalY + deltaY;
        break;
      case 'se': // bottom-right
        newWidth = Math.max(50, resizeStart.width + deltaX);
        newHeight = Math.max(50, resizeStart.height + deltaY);
        break;
      case 'sw': // bottom-left
        newWidth = Math.max(50, resizeStart.width - deltaX);
        newHeight = Math.max(50, resizeStart.height + deltaY);
        newX = position.originalX + deltaX;
        break;
    }
    
    // Apply grid snapping if enabled
    if (snapToGrid) {
      const gridSize = useWireframeStore.getState().canvasSettings.gridSize || 8;
      newWidth = Math.round(newWidth / gridSize) * gridSize;
      newHeight = Math.round(newHeight / gridSize) * gridSize;
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }
    
    setSectionPositions(prev => ({
      ...prev,
      [resizingSection]: {
        ...prev[resizingSection],
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      }
    }));
  }, [resizingSection, resizeDirection, dragStart, sectionPositions, resizeStart, snapToGrid]);

  // Start rotating a section
  const startRotateSection = useCallback((sectionId: string, clientX: number, clientY: number) => {
    setIsRotating(true);
    setActiveSection(sectionId);
    
    const sectionEl = document.getElementById(`section-${sectionId}`);
    if (sectionEl) {
      const rect = sectionEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate initial angle
      const initialAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
      setRotationStart(initialAngle);
      
      // Store current rotation
      const currentRotation = sectionPositions[sectionId]?.rotation || 0;
      
      setSectionPositions(prev => ({
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] || {}),
          rotation: currentRotation
        }
      }));
    }
  }, [sectionPositions]);

  // Rotate a section
  const rotateSection = useCallback((sectionId: string, clientX: number, clientY: number) => {
    if (!isRotating) return;
    
    const sectionEl = document.getElementById(`section-${sectionId}`);
    if (!sectionEl) return;
    
    const rect = sectionEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate current angle
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    
    // Calculate rotation delta
    let rotation = (currentAngle - rotationStart) + (sectionPositions[sectionId]?.rotation || 0);
    
    // Apply angle snapping in 15-degree increments if Shift is held
    if (snapToGrid) {
      rotation = Math.round(rotation / 15) * 15;
    }
    
    setSectionPositions(prev => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        rotation
      }
    }));
  }, [isRotating, rotationStart, sectionPositions, snapToGrid]);

  // Stop dragging, resizing or rotating and commit changes
  const stopManipulation = useCallback(() => {
    if (draggingSection && wireframe) {
      const position = sectionPositions[draggingSection];
      if (position) {
        // Update section in store with new position
        const section = wireframe.sections.find(s => s.id === draggingSection);
        if (section) {
          updateSection(draggingSection, {
            ...section,
            position: {
              x: position.x,
              y: position.y
            }
          });
        }
      }
      setDraggingSection(null);
    }
    
    if (resizingSection && wireframe) {
      const position = sectionPositions[resizingSection];
      if (position) {
        const section = wireframe.sections.find(s => s.id === resizingSection);
        if (section) {
          updateSection(resizingSection, {
            ...section,
            position: {
              x: position.x,
              y: position.y
            },
            dimensions: {
              width: position.width || section.dimensions?.width || 200,
              height: position.height || section.dimensions?.height || 100
            }
          });
        }
      }
      setResizingSection(null);
      setResizeDirection(null);
    }
    
    if (isRotating && activeSection) {
      const position = sectionPositions[activeSection];
      if (position && position.rotation !== undefined) {
        const section = wireframe.sections.find(s => s.id === activeSection);
        if (section) {
          updateSection(activeSection, {
            ...section,
            styleProperties: {
              ...(section.styleProperties || {}),
              rotation: position.rotation
            }
          });
        }
      }
      setIsRotating(false);
    }
  }, [draggingSection, resizingSection, isRotating, activeSection, sectionPositions, wireframe, updateSection]);

  // Apply section positions to component styles
  const applySectionPositions = useCallback((section: WireframeSection) => {
    const position = section.id && sectionPositions[section.id];
    
    if (position) {
      return {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: position.width ? `${position.width}px` : undefined,
        height: position.height ? `${position.height}px` : undefined,
        transform: position.rotation ? `rotate(${position.rotation}deg)` : 
          draggingSection === section.id ? 'scale(1.02)' : undefined,
        zIndex: draggingSection === section.id || resizingSection === section.id || activeSection === section.id ? 10 : 1
      };
    } else if (section.position) {
      // Use position from section if available
      return {
        position: 'absolute',
        left: `${section.position.x}px`,
        top: `${section.position.y}px`,
        width: section.dimensions?.width ? `${section.dimensions.width}px` : undefined,
        height: section.dimensions?.height ? `${section.dimensions.height}px` : undefined,
        transform: section.styleProperties?.rotation ? `rotate(${section.styleProperties.rotation}deg)` : undefined
      };
    }
    
    // Default to static positioning if no position defined
    return {};
  }, [sectionPositions, draggingSection, resizingSection, activeSection]);

  return {
    activeSection,
    draggingSection,
    resizingSection,
    isRotating,
    selectSection,
    startDragSection,
    dragSection,
    startResizeSection,
    resizeSection,
    startRotateSection,
    rotateSection,
    stopManipulation,
    applySectionPositions
  };
}
