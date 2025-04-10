
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeState {
  id?: string;
  title: string;
  description?: string;
  styleToken: string;
  sections: WireframeSection[];
  activeSection: string | null;
  history: any[];
  historyIndex: number;
  colorScheme?: Record<string, string>;
  typography?: Record<string, string>;
  darkMode: boolean;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
  showGrid: boolean;
  highlightSections: boolean;
  canvasSettings: {
    zoom: number;
    position: { x: number; y: number };
  };
  wireframe?: WireframeData; // Add wireframe property
  addSection: (section: Omit<WireframeSection, "id">) => void;
  updateSection: (id: string, updates: Partial<WireframeSection>) => void;
  removeSection: (id: string) => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  setActiveSection: (id: string | null) => void;
  reorderSection: (id: string, newOrder: number) => void;
  updateColorScheme: (colorScheme: Record<string, string>) => void;
  updateTypography: (typography: Record<string, string>) => void;
  toggleDarkMode: () => void;
  toggleShowGrid: () => void;
  toggleHighlightSections: () => void;
  setActiveDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  updateCanvasSettings: (settings: Partial<{ zoom: number; position: { x: number; y: number } }>) => void;
  updateWireframe: (updates: Partial<WireframeState>) => void;
  setWireframe: (data: Partial<WireframeData>) => void; // Add method to set wireframe
}

export const useWireframeStore = create<WireframeState>((set) => ({
  id: uuidv4(),
  title: 'New Wireframe',
  description: '',
  styleToken: 'modern-professional',
  sections: [],
  activeSection: null,
  history: [],
  historyIndex: -1,
  colorScheme: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#111827'
  },
  typography: {
    headings: 'Inter',
    body: 'Inter'
  },
  darkMode: false,
  activeDevice: 'desktop',
  showGrid: true,
  highlightSections: true,
  canvasSettings: {
    zoom: 1,
    position: { x: 0, y: 0 }
  },
  wireframe: undefined, // Initialize wireframe property
  
  addSection: (section) => set((state) => {
    const newSection = {
      id: uuidv4(),
      order: state.sections.length,
      ...section
    };
    
    const newSections = [...state.sections, newSection];
    
    // Also update the wireframe object if it exists
    const updatedWireframe = state.wireframe 
      ? { ...state.wireframe, sections: newSections } 
      : undefined;
    
    return {
      sections: newSections,
      activeSection: newSection.id,
      wireframe: updatedWireframe,
    };
  }),
  
  updateSection: (id, updates) => set((state) => {
    const updatedSections = state.sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    );
    
    // Also update the wireframe object if it exists
    const updatedWireframe = state.wireframe 
      ? { ...state.wireframe, sections: updatedSections } 
      : undefined;
    
    return {
      sections: updatedSections,
      wireframe: updatedWireframe,
    };
  }),
  
  removeSection: (id) => set((state) => {
    const filteredSections = state.sections.filter(section => section.id !== id);
    
    // Also update the wireframe object if it exists
    const updatedWireframe = state.wireframe 
      ? { ...state.wireframe, sections: filteredSections } 
      : undefined;
    
    return {
      sections: filteredSections,
      activeSection: state.activeSection === id ? null : state.activeSection,
      wireframe: updatedWireframe,
    };
  }),
  
  moveSectionUp: (id) => set((state) => {
    const index = state.sections.findIndex(s => s.id === id);
    if (index <= 0) return state;
    
    const newSections = [...state.sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    
    // Also update the wireframe object if it exists
    const updatedWireframe = state.wireframe 
      ? { ...state.wireframe, sections: newSections } 
      : undefined;
    
    return { 
      sections: newSections,
      wireframe: updatedWireframe,
    };
  }),
  
  moveSectionDown: (id) => set((state) => {
    const index = state.sections.findIndex(s => s.id === id);
    if (index === -1 || index >= state.sections.length - 1) return state;
    
    const newSections = [...state.sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    
    // Also update the wireframe object if it exists
    const updatedWireframe = state.wireframe 
      ? { ...state.wireframe, sections: newSections } 
      : undefined;
    
    return { 
      sections: newSections,
      wireframe: updatedWireframe,
    };
  }),
  
  setActiveSection: (id) => set({ activeSection: id }),
  
  reorderSection: (id, newOrder) => set((state) => {
    const section = state.sections.find(s => s.id === id);
    if (!section) return state;
    
    const oldOrder = state.sections.indexOf(section);
    const newSections = [...state.sections];
    
    newSections.splice(oldOrder, 1);
    newSections.splice(newOrder, 0, section);
    
    // Also update the wireframe object if it exists
    const updatedWireframe = state.wireframe 
      ? { ...state.wireframe, sections: newSections } 
      : undefined;
    
    return { 
      sections: newSections,
      wireframe: updatedWireframe,
    };
  }),
  
  updateColorScheme: (colorScheme) => set((state) => ({
    colorScheme: { ...state.colorScheme, ...colorScheme },
    wireframe: state.wireframe ? {
      ...state.wireframe,
      colorScheme: { ...state.wireframe.colorScheme, ...colorScheme }
    } : undefined
  })),
  
  updateTypography: (typography) => set((state) => ({
    typography: { ...state.typography, ...typography },
    wireframe: state.wireframe ? {
      ...state.wireframe,
      typography: { ...state.wireframe.typography, ...typography }
    } : undefined
  })),
  
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  toggleShowGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  
  toggleHighlightSections: () => set((state) => ({ 
    highlightSections: !state.highlightSections
  })),
  
  setActiveDevice: (device) => set({ activeDevice: device }),
  
  updateCanvasSettings: (settings) => set((state) => ({
    canvasSettings: { ...state.canvasSettings, ...settings }
  })),
  
  updateWireframe: (updates) => set((state) => ({ ...state, ...updates })),
  
  // Add method to set wireframe data
  setWireframe: (data) => set((state) => {
    const wireframeData: WireframeData = {
      id: data.id || state.id || uuidv4(),
      title: data.title || state.title || 'New Wireframe',
      sections: data.sections || state.sections || [],
      description: data.description || state.description,
      colorScheme: data.colorScheme || state.colorScheme,
      typography: data.typography || state.typography,
      style: data.style || state.styleToken,
      styleToken: data.styleToken || state.styleToken,
      designTokens: data.designTokens || {},
    };
    
    return {
      sections: wireframeData.sections,
      wireframe: wireframeData,
      title: wireframeData.title,
      description: wireframeData.description,
      styleToken: wireframeData.styleToken || state.styleToken,
    };
  }),
}));

export default useWireframeStore;
