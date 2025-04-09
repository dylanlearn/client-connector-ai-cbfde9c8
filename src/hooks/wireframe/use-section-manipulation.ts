
// This file likely has more complex logic for section manipulation
// Let's focus on fixing the type issues that were in the error message

import { useState, useCallback } from 'react';
import { WireframeSection } from '@/types/wireframe';

// Define a proper type for SectionPosition
interface SectionPositionData {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  width?: number;
  height?: number;
  rotation?: number;
}

// Define SectionPosition interface with proper typing
interface SectionPosition {
  [key: string]: SectionPositionData;
}

export function useSectionManipulation() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [draggingSection, setDraggingSection] = useState<string | null>(null);
  const [resizingSection, setResizingSection] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [sectionPositions, setSectionPositions] = useState<SectionPosition>({});

  // Select a section
  const selectSection = useCallback((sectionId: string | null) => {
    setActiveSection(sectionId);
  }, []);

  // Start dragging a section
  const startDragSection = useCallback((sectionId: string, clientX: number, clientY: number) => {
    setDraggingSection(sectionId);
    setDragStart({ x: clientX, y: clientY });

    // Initialize position if not already set
    if (!sectionPositions[sectionId]) {
      setSectionPositions(prev => ({
        ...prev,
        [sectionId]: {
          x: 0,
          y: 0,
          originalX: 0,
          originalY: 0
        }
      }));
    }
  }, [sectionPositions]);

  // Drag section
  const dragSection = useCallback((clientX: number, clientY: number) => {
    if (!draggingSection || !dragStart) return;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    // Update section position
    setSectionPositions((prev: SectionPosition): SectionPosition => {
      const current = prev[draggingSection];
      if (!current) return prev;

      return {
        ...prev,
        [draggingSection]: {
          ...current,
          x: current.originalX + deltaX,
          y: current.originalY + deltaY
        }
      };
    });
  }, [draggingSection, dragStart]);

  // Start resizing a section
  const startResizeSection = useCallback((sectionId: string, direction: string, clientX: number, clientY: number) => {
    setResizingSection(sectionId);
    setResizeDirection(direction);
    setDragStart({ x: clientX, y: clientY });

    // Initialize position and dimensions if not already set
    if (!sectionPositions[sectionId]) {
      setSectionPositions(prev => ({
        ...prev,
        [sectionId]: {
          x: 0,
          y: 0,
          originalX: 0,
          originalY: 0,
          width: 200,
          height: 100
        }
      }));
    }
  }, [sectionPositions]);

  // Resize section
  const resizeSection = useCallback((clientX: number, clientY: number) => {
    if (!resizingSection || !dragStart || !resizeDirection) return;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    // Update section dimensions based on resize direction
    setSectionPositions((prev: SectionPosition): SectionPosition => {
      const current = prev[resizingSection];
      if (!current) return prev;

      const updatedPosition: SectionPositionData = { ...current };

      if (resizeDirection.includes('e') && current.width) {
        updatedPosition.width = Math.max(50, current.width + deltaX);
      }
      if (resizeDirection.includes('w') && current.width) {
        const newWidth = Math.max(50, current.width - deltaX);
        updatedPosition.x = current.originalX + (current.width - newWidth);
        updatedPosition.width = newWidth;
      }
      if (resizeDirection.includes('s') && current.height) {
        updatedPosition.height = Math.max(50, current.height + deltaY);
      }
      if (resizeDirection.includes('n') && current.height) {
        const newHeight = Math.max(50, current.height - deltaY);
        updatedPosition.y = current.originalY + (current.height - newHeight);
        updatedPosition.height = newHeight;
      }

      return {
        ...prev,
        [resizingSection]: updatedPosition
      };
    });
  }, [resizingSection, dragStart, resizeDirection]);

  // Start rotating a section
  const startRotateSection = useCallback((sectionId: string, clientX: number, clientY: number) => {
    setActiveSection(sectionId);
    setIsRotating(true);
    setDragStart({ x: clientX, y: clientY });
  }, []);

  // Rotate section
  const rotateSection = useCallback((sectionId: string, clientX: number, clientY: number) => {
    if (!sectionId || !isRotating || !dragStart) return;

    // Calculate rotation based on mouse position
    const section = document.getElementById(`section-${sectionId}`);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const startAngle = Math.atan2(dragStart.y - centerY, dragStart.x - centerX);
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);
    const rotation = (currentAngle - startAngle) * (180 / Math.PI);

    // Update section rotation
    setSectionPositions((prev: SectionPosition): SectionPosition => {
      const current = prev[sectionId];
      const newRotation = current?.rotation ?? 0;

      return {
        ...prev,
        [sectionId]: {
          ...(current || { 
            x: 0, 
            y: 0, 
            originalX: 0, 
            originalY: 0 
          }),
          rotation: newRotation + rotation
        }
      };
    });

    // Update drag start to current position for continuous rotation
    setDragStart({ x: clientX, y: clientY });
  }, [isRotating, dragStart]);

  // Stop any manipulation
  const stopManipulation = useCallback(() => {
    if (draggingSection || resizingSection) {
      // Save the current position as the new original position
      setSectionPositions((prev: SectionPosition): SectionPosition => {
        const updated: SectionPosition = { ...prev };
        
        if (draggingSection && prev[draggingSection]) {
          updated[draggingSection] = {
            ...prev[draggingSection],
            originalX: prev[draggingSection].x,
            originalY: prev[draggingSection].y
          };
        }
        
        if (resizingSection && prev[resizingSection]) {
          updated[resizingSection] = {
            ...prev[resizingSection],
            originalX: prev[resizingSection].x,
            originalY: prev[resizingSection].y
          };
        }
        
        return updated;
      });
    }
    
    setDraggingSection(null);
    setResizingSection(null);
    setResizeDirection(null);
    setIsRotating(false);
    setDragStart(null);
  }, [draggingSection, resizingSection]);

  // Apply section positions (used for rendering)
  const applySectionPositions = useCallback((section: WireframeSection): React.CSSProperties => {
    if (!section.id) return {};
    
    const position = sectionPositions[section.id];
    
    if (position) {
      return {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: position.width ? `${position.width}px` : undefined,
        height: position.height ? `${position.height}px` : undefined,
        transform: position.rotation ? `rotate(${position.rotation}deg)` : 
          draggingSection === section.id ? 'scale(1.02)' : undefined,
        zIndex: (draggingSection === section.id || 
                resizingSection === section.id || 
                activeSection === section.id) ? 10 : 1
      };
    } else if (section.position) {
      // Use position from section if available
      return {
        position: 'absolute',
        left: `${section.position.x}px`,
        top: `${section.position.y}px`,
        width: section.dimensions?.width ? `${section.dimensions.width}px` : undefined,
        height: section.dimensions?.height ? `${section.dimensions.height}px` : undefined,
        transform: section.styleProperties?.rotation ? 
          `rotate(${section.styleProperties.rotation}deg)` : undefined
      };
    }
    
    // Default to empty object for static positioning
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
