
import { useState, useCallback } from 'react';
import { useWireframeStore, WireframeSection } from '@/stores/wireframe-store';

interface SectionPosition {
  top: number;
  left: number;
}

export function useSectionManipulation() {
  const wireframe = useWireframeStore(state => state.wireframe);
  const activeSection = useWireframeStore(state => state.activeSection);
  const updateSection = useWireframeStore(state => state.updateSection);
  const setActiveSection = useWireframeStore(state => state.setActiveSection);
  const canvasSettings = useWireframeStore(state => state.canvasSettings);
  const saveStateForUndo = useWireframeStore(state => state.saveStateForUndo);
  
  const [draggingSection, setDraggingSection] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<SectionPosition>({ top: 0, left: 0 });
  const [sectionPositions, setSectionPositions] = useState<Record<string, SectionPosition>>({});
  
  // Select a section
  const selectSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, [setActiveSection]);
  
  // Start dragging a section
  const startDragSection = useCallback((sectionId: string, clientX: number, clientY: number) => {
    setDraggingSection(sectionId);
    
    // Get the section element
    const sectionElement = document.getElementById(`section-${sectionId}`);
    if (!sectionElement) return;
    
    // Calculate the offset from the mouse to the top-left of the section
    const rect = sectionElement.getBoundingClientRect();
    setDragOffset({
      left: clientX - rect.left,
      top: clientY - rect.top
    });
    
    // Store the initial position
    const currentPosition = sectionPositions[sectionId] || { top: rect.top, left: rect.left };
    setSectionPositions({
      ...sectionPositions,
      [sectionId]: currentPosition
    });
    
    // Select the section
    selectSection(sectionId);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  }, [sectionPositions, selectSection]);
  
  // Update section position during drag
  const dragSection = useCallback((clientX: number, clientY: number) => {
    if (!draggingSection) return;
    
    const sectionElement = document.getElementById(`section-${draggingSection}`);
    if (!sectionElement || !sectionElement.parentElement) return;
    
    // Calculate new position
    const parentRect = sectionElement.parentElement.getBoundingClientRect();
    let newLeft = clientX - parentRect.left - dragOffset.left;
    let newTop = clientY - parentRect.top - dragOffset.top;
    
    // Apply snap to grid if enabled
    if (canvasSettings.snapToGrid) {
      const gridSize = canvasSettings.gridSize;
      newLeft = Math.round(newLeft / gridSize) * gridSize;
      newTop = Math.round(newTop / gridSize) * gridSize;
    }
    
    // Update the section position
    setSectionPositions({
      ...sectionPositions,
      [draggingSection]: {
        left: newLeft,
        top: newTop
      }
    });
    
    // Apply the position to the element for immediate feedback
    sectionElement.style.position = 'absolute';
    sectionElement.style.left = `${newLeft}px`;
    sectionElement.style.top = `${newTop}px`;
  }, [draggingSection, dragOffset, sectionPositions, canvasSettings.snapToGrid, canvasSettings.gridSize]);
  
  // Stop dragging and save position
  const stopDragSection = useCallback(() => {
    if (!draggingSection) return;
    
    // Find the section in the wireframe
    const section = wireframe.sections.find(section => section.id === draggingSection);
    if (section) {
      // Update the section position in the store
      const position = sectionPositions[draggingSection];
      if (position) {
        updateSection(draggingSection, {
          styleProperties: {
            ...section.styleProperties,
            position: 'absolute',
            left: position.left,
            top: position.top
          }
        });
        
        // Save state for undo
        saveStateForUndo();
      }
    }
    
    // Reset dragging state
    setDraggingSection(null);
    document.body.style.userSelect = '';
  }, [draggingSection, wireframe.sections, sectionPositions, updateSection, saveStateForUndo]);
  
  // Apply stored positions to sections (for rendering)
  const applySectionPositions = useCallback((section: WireframeSection) => {
    const position = sectionPositions[section.id];
    if (!position) return {};
    
    return {
      position: 'absolute',
      left: position.left,
      top: position.top
    };
  }, [sectionPositions]);
  
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
