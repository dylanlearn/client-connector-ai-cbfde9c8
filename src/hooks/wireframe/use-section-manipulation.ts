
import { useState, useCallback } from 'react';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeSection } from '@/types/wireframe';

interface SectionPosition {
  [id: string]: {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
  };
}

export function useSectionManipulation() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [draggingSection, setDraggingSection] = useState<string | null>(null);
  const [sectionPositions, setSectionPositions] = useState<SectionPosition>({});
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { wireframe, updateSection } = useWireframeStore();

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
          originalY: currentY
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
    
    // Update position with delta
    setSectionPositions(prev => ({
      ...prev,
      [draggingSection as string]: {
        ...originalPosition,
        x: originalPosition.originalX + deltaX,
        y: originalPosition.originalY + deltaY
      }
    }));
  }, [draggingSection, dragStart, sectionPositions]);

  // Stop dragging and commit changes
  const stopDragSection = useCallback(() => {
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
    }
    
    setDraggingSection(null);
  }, [draggingSection, sectionPositions, wireframe, updateSection]);

  // Apply section positions to component styles
  const applySectionPositions = useCallback((section: WireframeSection) => {
    const position = section.id && sectionPositions[section.id];
    
    if (position) {
      return {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: draggingSection === section.id ? 'scale(1.02)' : undefined,
        zIndex: draggingSection === section.id ? 10 : 1
      };
    } else if (section.position) {
      // Use position from section if available
      return {
        position: 'absolute',
        left: `${section.position.x}px`,
        top: `${section.position.y}px`,
      };
    }
    
    // Default to static positioning if no position defined
    return {};
  }, [sectionPositions, draggingSection]);

  return {
    activeSection,
    draggingSection,
    selectSection,
    startDragSection,
    dragSection,
    stopDragSection,
    applySectionPositions
  };
}
