
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
  wireframe: WireframeState;
  activeSection: string | null;
  activeComponentId: string | null;
  hiddenSections: string[];
  undoStack: WireframeState[];
  redoStack: WireframeState[];
  canvasSettings: {
    zoom: number;
    panOffset: { x: number, y: number };
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
  };
  
  // Actions
  setWireframe: (wireframe: Partial<WireframeState>) => void;
  addSection: (section: Omit<WireframeSection, 'id'>) => void;
  updateSection: (sectionId: string, updates: Partial<WireframeSection>) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
  setActiveSection: (sectionId: string | null) => void;
  setActiveComponent: (componentId: string | null) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateCanvasSettings: (updates: Partial<WireframeStoreState['canvasSettings']>) => void;
  
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
  undoStack: [],
  redoStack: [],
  canvasSettings: {
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 8,
  },

  setWireframe: (wireframe) => {
    set((state) => ({
      wireframe: {
        ...state.wireframe,
        ...wireframe,
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
