
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface WireframeSection {
  id: string;
  name: string;
  description?: string;
  sectionType: string;
  layoutType?: string;
  componentVariant?: string; 
  components?: any[];
  styleProperties?: any;
  positionOrder?: number;
  designReasoning?: string;
  copySuggestions?: any[];
  mobileLayout?: any;
  animationSuggestions?: any[];
  dimensions?: { width: number; height: number }; 
  position?: { x: number, y: number }; 
}

export interface WireframeState {
  id?: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  styleToken?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography?: {
    headings: string;
    body: string;
  };
  lastUpdated?: string;
}

interface WireframeStoreState {
  // Core wireframe data
  wireframe: WireframeState;
  
  // UI state
  activeSection: string | null;
  activeComponentId: string | null;
  hiddenSections: string[];
  selectedElements: string[];
  
  // History for undo/redo
  undoStack: WireframeState[];
  redoStack: WireframeState[];
  
  // Canvas display settings
  canvasSettings: {
    zoom: number;
    panOffset: { x: number, y: number };
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
    gridType: 'lines' | 'dots' | 'columns';
    snapTolerance: number;
    showSmartGuides: boolean;
  };
  
  // UI preferences
  activeDevice: 'desktop' | 'tablet' | 'mobile';
  darkMode: boolean;
  showGrid: boolean;
  highlightSections: boolean;
  
  // Actions
  setWireframe: (wireframe: Partial<WireframeState>) => void;
  updateWireframe: (updates: Partial<WireframeState>) => void;
  addSection: (section: Omit<WireframeSection, 'id'>) => void;
  updateSection: (sectionId: string, updates: Partial<WireframeSection>) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
  setActiveSection: (sectionId: string | null) => void;
  setActiveComponent: (componentId: string | null) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateCanvasSettings: (updates: Partial<WireframeStoreState['canvasSettings']>) => void;
  
  // Selection management
  selectElement: (elementId: string) => void;
  deselectElement: (elementId: string) => void;
  clearSelection: () => void;
  
  // Layout management
  applyGridLayout: (columns: number, gapSize: number) => void;
  redistributeSections: () => void;
  
  // Device and display toggles
  setActiveDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  toggleDarkMode: () => void;
  toggleShowGrid: () => void;
  toggleHighlightSections: () => void;
  
  // Undo/Redo
  saveStateForUndo: () => void;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;
}

export const useWireframeStore = create<WireframeStoreState>((set, get) => ({
  wireframe: {
    title: 'New Wireframe',
    description: '',
    sections: [],
  },
  activeSection: null,
  activeComponentId: null,
  hiddenSections: [],
  selectedElements: [],
  undoStack: [],
  redoStack: [],
  canvasSettings: {
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 8,
    gridType: 'lines',
    snapTolerance: 5,
    showSmartGuides: true,
  },
  
  // UI preferences with defaults
  activeDevice: 'desktop',
  darkMode: false,
  showGrid: true,
  highlightSections: false,

  setWireframe: (wireframe) => {
    set((state) => ({
      wireframe: {
        ...state.wireframe,
        ...wireframe,
      },
    }));
  },
  
  updateWireframe: (updates) => {
    set((state) => ({
      wireframe: {
        ...state.wireframe,
        ...updates,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  addSection: (sectionData) => {
    const section: WireframeSection = {
      ...sectionData,
      id: uuidv4(),
    };
    
    set((state) => {
      // Save current state for undo
      const undoStack = [...state.undoStack, { ...state.wireframe }];
      
      // Add section to the end of the sections array
      const sections = [...state.wireframe.sections, section];
      
      return {
        wireframe: {
          ...state.wireframe,
          sections,
          lastUpdated: new Date().toISOString(),
        },
        undoStack,
        redoStack: [],
        activeSection: section.id, // Auto-select the new section
      };
    });
  },

  updateSection: (sectionId, updates) => {
    set((state) => {
      const sections = state.wireframe.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      );
      
      // Save current state for undo
      const undoStack = [...state.undoStack, { ...state.wireframe }];
      
      return {
        wireframe: {
          ...state.wireframe,
          sections,
          lastUpdated: new Date().toISOString(),
        },
        undoStack,
        redoStack: [],
      };
    });
  },

  removeSection: (sectionId) => {
    set((state) => {
      // Save current state for undo
      const undoStack = [...state.undoStack, { ...state.wireframe }];
      
      const sections = state.wireframe.sections.filter(
        (section) => section.id !== sectionId
      );
      
      // If we're removing the currently active section, clear activeSection
      const activeSection = state.activeSection === sectionId ? null : state.activeSection;
      
      // Also remove from hiddenSections if it's there
      const hiddenSections = state.hiddenSections.filter(id => id !== sectionId);
      
      // Remove from selectedElements if it's there
      const selectedElements = state.selectedElements.filter(id => id !== sectionId);
      
      return {
        wireframe: {
          ...state.wireframe,
          sections,
          lastUpdated: new Date().toISOString(),
        },
        undoStack,
        redoStack: [],
        activeSection,
        hiddenSections,
        selectedElements,
      };
    });
  },

  reorderSections: (sourceIndex, destinationIndex) => {
    set((state) => {
      if (
        sourceIndex < 0 ||
        sourceIndex >= state.wireframe.sections.length ||
        destinationIndex < 0 ||
        destinationIndex >= state.wireframe.sections.length
      ) {
        return state; // Invalid indices
      }
      
      // Save current state for undo
      const undoStack = [...state.undoStack, { ...state.wireframe }];
      
      // Create a new array with the sections reordered
      const sections = [...state.wireframe.sections];
      const [movedSection] = sections.splice(sourceIndex, 1);
      sections.splice(destinationIndex, 0, movedSection);
      
      // Update positionOrder if it exists
      const updatedSections = sections.map((section, index) => ({
        ...section,
        positionOrder: index,
      }));
      
      return {
        wireframe: {
          ...state.wireframe,
          sections: updatedSections,
          lastUpdated: new Date().toISOString(),
        },
        undoStack,
        redoStack: [],
      };
    });
  },

  setActiveSection: (sectionId) => {
    set({
      activeSection: sectionId,
      activeComponentId: null, // Clear active component when setting active section
    });
  },

  setActiveComponent: (componentId) => {
    set({
      activeComponentId: componentId,
    });
  },

  toggleSectionVisibility: (sectionId) => {
    set((state) => {
      const isHidden = state.hiddenSections.includes(sectionId);
      
      return {
        hiddenSections: isHidden
          ? state.hiddenSections.filter(id => id !== sectionId)
          : [...state.hiddenSections, sectionId],
      };
    });
  },

  updateCanvasSettings: (updates) => {
    set((state) => ({
      canvasSettings: {
        ...state.canvasSettings,
        ...updates,
      },
    }));
  },
  
  // Element selection management
  selectElement: (elementId) => {
    set(state => {
      if (state.selectedElements.includes(elementId)) return state;
      
      return {
        selectedElements: [...state.selectedElements, elementId]
      };
    });
  },
  
  deselectElement: (elementId) => {
    set(state => ({
      selectedElements: state.selectedElements.filter(id => id !== elementId)
    }));
  },
  
  clearSelection: () => {
    set({ selectedElements: [] });
  },
  
  // Layout management
  applyGridLayout: (columns = 3, gapSize = 16) => {
    set(state => {
      // Save current state for undo
      const undoStack = [...state.undoStack, { ...state.wireframe }];
      
      const { sections } = state.wireframe;
      const { gridSize } = state.canvasSettings;
      
      let rowHeight = 0;
      let currentRow = 0;
      let currentColumn = 0;
      
      const updatedSections = sections.map((section, index) => {
        // If we've reached the max columns, move to next row
        if (currentColumn >= columns) {
          currentColumn = 0;
          currentRow++;
        }
        
        // Calculate position based on grid coordinates
        const padding = gridSize * 2;
        const availableWidth = (1200 - (padding * 2)); // Assuming canvas width
        const columnWidth = (availableWidth - (gapSize * (columns - 1))) / columns;
        
        const x = padding + (currentColumn * (columnWidth + gapSize));
        const y = padding + (currentRow * (rowHeight + gapSize));
        
        // Update for next iteration
        currentColumn++;
        
        // Adjust height for the current section
        const height = section.dimensions?.height || 200;
        rowHeight = Math.max(rowHeight, height);
        
        // Return updated section
        return {
          ...section,
          position: { x, y },
          dimensions: {
            width: columnWidth,
            height
          }
        };
      });
      
      return {
        wireframe: {
          ...state.wireframe,
          sections: updatedSections,
          lastUpdated: new Date().toISOString(),
        },
        undoStack,
        redoStack: [],
      };
    });
  },
  
  redistributeSections: () => {
    set(state => {
      // Save current state for undo
      const undoStack = [...state.undoStack, { ...state.wireframe }];
      
      const { sections } = state.wireframe;
      
      if (sections.length === 0) {
        return { undoStack };
      }
      
      const padding = 20;
      const canvasWidth = 1200; // Assuming fixed canvas width
      const canvasHeight = 800; // Assuming fixed canvas height
      
      // Calculate total height of all sections
      const totalHeight = sections.reduce((sum, section) => 
        sum + (section.dimensions?.height || 200), 0);
      
      // Add spacing between sections
      const totalSpacing = (sections.length - 1) * padding;
      
      // Available height
      const availableHeight = canvasHeight - (padding * 2);
      
      // Scale factor if total height exceeds available height
      const scale = Math.min(1, availableHeight / (totalHeight + totalSpacing));
      
      // Position sections one after another vertically
      let currentY = padding;
      
      const updatedSections = sections.map(section => {
        const height = (section.dimensions?.height || 200) * scale;
        const width = Math.min(canvasWidth - (padding * 2), section.dimensions?.width || canvasWidth - (padding * 2));
        
        // Center horizontally
        const x = (canvasWidth - width) / 2;
        const y = currentY;
        
        // Update Y for next section
        currentY += height + padding;
        
        return {
          ...section,
          position: { x, y },
          dimensions: { width, height }
        };
      });
      
      return {
        wireframe: {
          ...state.wireframe,
          sections: updatedSections,
          lastUpdated: new Date().toISOString(),
        },
        undoStack,
        redoStack: [],
      };
    });
  },
  
  // UI state management functions
  setActiveDevice: (device) => {
    set({ activeDevice: device });
  },
  
  toggleDarkMode: () => {
    set((state) => ({ darkMode: !state.darkMode }));
  },
  
  toggleShowGrid: () => {
    set((state) => ({ 
      showGrid: !state.showGrid,
      canvasSettings: {
        ...state.canvasSettings,
        showGrid: !state.showGrid
      }
    }));
  },
  
  toggleHighlightSections: () => {
    set((state) => ({ highlightSections: !state.highlightSections }));
  },

  saveStateForUndo: () => {
    set((state) => ({
      undoStack: [...state.undoStack, { ...state.wireframe }],
      redoStack: [], // Clear redo stack whenever we save a new state
    }));
  },

  undo: () => {
    set((state) => {
      if (state.undoStack.length === 0) return state;
      
      // Get the last state from the undo stack
      const undoStack = [...state.undoStack];
      const previousState = undoStack.pop();
      
      if (!previousState) return state;
      
      // Add current state to redo stack
      const redoStack = [...state.redoStack, { ...state.wireframe }];
      
      return {
        wireframe: previousState,
        undoStack,
        redoStack,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.redoStack.length === 0) return state;
      
      // Get the last state from the redo stack
      const redoStack = [...state.redoStack];
      const nextState = redoStack.pop();
      
      if (!nextState) return state;
      
      // Add current state to undo stack
      const undoStack = [...state.undoStack, { ...state.wireframe }];
      
      return {
        wireframe: nextState,
        undoStack,
        redoStack,
      };
    });
  },

  resetHistory: () => {
    set({
      undoStack: [],
      redoStack: [],
    });
  },
}));
