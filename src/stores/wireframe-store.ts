
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  layoutType?: string;
  components?: any[];
  dimensions?: {
    width: number | string;
    height: number | string;
  };
  copySuggestions?: any;
  animationSuggestions?: any[];
  order?: number;
  designReasoning?: string;
}

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
  
  addSection: (section) => set((state) => {
    const newSection = {
      id: uuidv4(),
      order: state.sections.length,
      ...section
    };
    
    return {
      sections: [...state.sections, newSection],
      activeSection: newSection.id
    };
  }),
  
  updateSection: (id, updates) => set((state) => ({
    sections: state.sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    )
  })),
  
  removeSection: (id) => set((state) => ({
    sections: state.sections.filter(section => section.id !== id),
    activeSection: state.activeSection === id ? null : state.activeSection
  })),
  
  moveSectionUp: (id) => set((state) => {
    const index = state.sections.findIndex(s => s.id === id);
    if (index <= 0) return state;
    
    const newSections = [...state.sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    
    return { sections: newSections };
  }),
  
  moveSectionDown: (id) => set((state) => {
    const index = state.sections.findIndex(s => s.id === id);
    if (index === -1 || index >= state.sections.length - 1) return state;
    
    const newSections = [...state.sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    
    return { sections: newSections };
  }),
  
  setActiveSection: (id) => set({ activeSection: id }),
  
  reorderSection: (id, newOrder) => set((state) => {
    const section = state.sections.find(s => s.id === id);
    if (!section) return state;
    
    const oldOrder = state.sections.indexOf(section);
    const newSections = [...state.sections];
    
    newSections.splice(oldOrder, 1);
    newSections.splice(newOrder, 0, section);
    
    return { sections: newSections };
  }),
  
  updateColorScheme: (colorScheme) => set((state) => ({
    colorScheme: { ...state.colorScheme, ...colorScheme }
  })),
  
  updateTypography: (typography) => set((state) => ({
    typography: { ...state.typography, ...typography }
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
  
  updateWireframe: (updates) => set((state) => ({ ...state, ...updates }))
}));

export default useWireframeStore;
