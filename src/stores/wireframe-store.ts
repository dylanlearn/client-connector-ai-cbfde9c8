
import { create } from 'zustand';
import { WireframeSection, WireframeData } from '@/services/ai/wireframe/wireframe-types';

export interface WireframeState extends Omit<WireframeData, 'id'> {
  id: string; // Make sure id is required here
  title: string;
  styleToken?: string;
  sections: WireframeSection[];
}

interface WireframeStore {
  wireframe: WireframeState | null;
  activeSection: string | null;
  setWireframe: (wireframe: Partial<WireframeState>) => void;
  setActiveSection: (sectionId: string | null) => void;
  updateSection: (sectionId: string, updates: Partial<WireframeSection>) => void;
  addSection: (section: WireframeSection) => void;
  removeSection: (sectionId: string) => void;
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  reorderSections: (sections: WireframeSection[]) => void;
}

export const useWireframeStore = create<WireframeStore>((set) => ({
  wireframe: null,
  activeSection: null,
  
  setWireframe: (wireframe) => set((state) => {
    // Ensure id is present as required
    const updatedWireframe = {
      ...(state.wireframe || {} as Partial<WireframeState>),
      ...wireframe,
      id: wireframe.id || state.wireframe?.id || `wf_${Date.now()}`,
      title: wireframe.title || state.wireframe?.title || 'Untitled Wireframe',
      sections: wireframe.sections || state.wireframe?.sections || []
    };
    
    return { wireframe: updatedWireframe as WireframeState };
  }),
  
  setActiveSection: (sectionId) => set({ activeSection: sectionId }),
  
  updateSection: (sectionId, updates) => set((state) => {
    if (!state.wireframe) return state;
    
    const sections = state.wireframe.sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    );
    
    return {
      wireframe: {
        ...state.wireframe,
        sections
      }
    };
  }),
  
  addSection: (section) => set((state) => {
    if (!state.wireframe) return state;
    
    return {
      wireframe: {
        ...state.wireframe,
        sections: [...state.wireframe.sections, section]
      }
    };
  }),
  
  removeSection: (sectionId) => set((state) => {
    if (!state.wireframe) return state;
    
    return {
      wireframe: {
        ...state.wireframe,
        sections: state.wireframe.sections.filter(section => section.id !== sectionId)
      },
      activeSection: state.activeSection === sectionId ? null : state.activeSection
    };
  }),
  
  moveSectionUp: (sectionId) => set((state) => {
    if (!state.wireframe) return state;
    
    const sections = [...state.wireframe.sections];
    const index = sections.findIndex(section => section.id === sectionId);
    
    if (index <= 0) return state;
    
    // Swap sections
    [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
    
    return {
      wireframe: {
        ...state.wireframe,
        sections
      }
    };
  }),
  
  moveSectionDown: (sectionId) => set((state) => {
    if (!state.wireframe) return state;
    
    const sections = [...state.wireframe.sections];
    const index = sections.findIndex(section => section.id === sectionId);
    
    if (index < 0 || index >= sections.length - 1) return state;
    
    // Swap sections
    [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    
    return {
      wireframe: {
        ...state.wireframe,
        sections
      }
    };
  }),
  
  reorderSections: (sections) => set((state) => {
    if (!state.wireframe) return state;
    
    return {
      wireframe: {
        ...state.wireframe,
        sections
      }
    };
  })
}));
