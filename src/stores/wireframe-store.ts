
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WireframeData } from '@/types/wireframe';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

export interface WireframeState {
  wireframe: WireframeData;
  activeSection: string | null;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
  editMode: boolean;
  showGrid: boolean;
  highlightSections: boolean;
  darkMode: boolean;
  history: {
    past: WireframeData[];
    future: WireframeData[];
  };
  
  // Actions
  setWireframe: (wireframe: WireframeData) => void;
  updateWireframe: (updates: Partial<WireframeData>) => void;
  setActiveSection: (sectionId: string | null) => void;
  setActiveDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  toggleEditMode: () => void;
  toggleShowGrid: () => void;
  toggleHighlightSections: () => void;
  toggleDarkMode: () => void;
  
  // Section operations
  addSection: (section: Partial<WireframeSection>) => void;
  updateSection: (sectionId: string, updates: Partial<WireframeSection>) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

const DEFAULT_WIREFRAME: WireframeData = {
  title: 'New Wireframe',
  description: 'Create your wireframe by adding sections',
  sections: [],
  layoutType: 'standard',
  colorScheme: {
    primary: '#4F46E5',
    secondary: '#A855F7',
    accent: '#F59E0B',
    background: '#FFFFFF'
  },
  typography: {
    headings: 'Raleway, sans-serif',
    body: 'Inter, sans-serif'
  }
};

export const useWireframeStore = create<WireframeState>()(
  persist(
    (set, get) => ({
      wireframe: DEFAULT_WIREFRAME,
      activeSection: null,
      activeDevice: 'desktop',
      editMode: false,
      showGrid: false,
      highlightSections: true,
      darkMode: false,
      history: {
        past: [],
        future: []
      },

      setWireframe: (wireframe) => {
        set({ wireframe });
        get().saveToHistory();
      },
      
      updateWireframe: (updates) => {
        set((state) => ({
          wireframe: { ...state.wireframe, ...updates }
        }));
        get().saveToHistory();
      },
      
      setActiveSection: (sectionId) => set({ activeSection: sectionId }),
      
      setActiveDevice: (device) => set({ activeDevice: device }),
      
      toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
      
      toggleShowGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      
      toggleHighlightSections: () => set((state) => ({ 
        highlightSections: !state.highlightSections 
      })),
      
      toggleDarkMode: () => set((state) => ({ 
        darkMode: !state.darkMode,
        wireframe: {
          ...state.wireframe,
          colorScheme: {
            ...state.wireframe.colorScheme,
            background: !state.darkMode ? '#111827' : '#FFFFFF'
          }
        }
      })),
      
      addSection: (section) => {
        const newSection: WireframeSection = {
          id: uuidv4(),
          name: section.name || 'New Section',
          sectionType: section.sectionType || 'default',
          ...section
        };
        
        set((state) => ({
          wireframe: {
            ...state.wireframe,
            sections: [...(state.wireframe.sections || []), newSection]
          },
          activeSection: newSection.id
        }));
        
        get().saveToHistory();
      },
      
      updateSection: (sectionId, updates) => {
        set((state) => ({
          wireframe: {
            ...state.wireframe,
            sections: (state.wireframe.sections || []).map((section) =>
              section.id === sectionId ? { ...section, ...updates } : section
            )
          }
        }));
        
        get().saveToHistory();
      },
      
      removeSection: (sectionId) => {
        set((state) => ({
          wireframe: {
            ...state.wireframe,
            sections: (state.wireframe.sections || []).filter(
              (section) => section.id !== sectionId
            )
          },
          activeSection: null
        }));
        
        get().saveToHistory();
      },
      
      reorderSections: (fromIndex, toIndex) => {
        set((state) => {
          const sections = [...(state.wireframe.sections || [])];
          const [removed] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, removed);
          
          return {
            wireframe: {
              ...state.wireframe,
              sections
            }
          };
        });
        
        get().saveToHistory();
      },
      
      saveToHistory: () => {
        set((state) => ({
          history: {
            past: [...state.history.past, JSON.parse(JSON.stringify(state.wireframe))],
            future: []
          }
        }));
      },
      
      undo: () => {
        set((state) => {
          if (state.history.past.length === 0) return state;
          
          const newPast = [...state.history.past];
          const previous = newPast.pop();
          
          return {
            wireframe: previous!,
            history: {
              past: newPast,
              future: [state.wireframe, ...state.history.future]
            }
          };
        });
      },
      
      redo: () => {
        set((state) => {
          if (state.history.future.length === 0) return state;
          
          const newFuture = [...state.history.future];
          const next = newFuture.shift();
          
          return {
            wireframe: next!,
            history: {
              past: [...state.history.past, state.wireframe],
              future: newFuture
            }
          };
        });
      }
    }),
    {
      name: 'wireframe-storage',
      partialize: (state) => ({
        wireframe: state.wireframe,
        darkMode: state.darkMode
      })
    }
  )
);
