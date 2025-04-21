import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { typographyToRecord, colorSchemeToRecord } from '@/utils/type-compatibility-helpers';

// Define the Wireframe state interface
export interface WireframeState {
  // Wireframe data
  wireframeData: WireframeData | null;
  sections: WireframeSection[];
  
  // UI state properties
  darkMode: boolean;
  showGrid: boolean;
  highlightSections: boolean;
  activeSection: string | null;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
  
  // Actions
  setWireframeData: (data: WireframeData | null) => void;
  updateWireframeData: (updates: Partial<WireframeData>) => void;
  
  // Section management methods
  addSection: (section: Omit<WireframeSection, "id">) => void;
  updateSection: (id: string, updates: Partial<WireframeSection>) => void;
  removeSection: (id: string) => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  setActiveSection: (sectionId: string | null) => void;
  
  // UI state methods
  toggleDarkMode: () => void;
  toggleShowGrid: () => void;
  toggleHighlightSections: () => void;
  setActiveDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
}

// Create the store with persistence
export const useWireframeStore = create<WireframeState>()(
  persist(
    (set, get) => ({
      // Initial state
      wireframeData: null,
      sections: [],
      darkMode: false,
      showGrid: true,
      highlightSections: false,
      activeSection: null,
      activeDevice: 'desktop',

      // Wireframe data actions
      setWireframeData: (data) => set({ 
        wireframeData: data,
        sections: data?.sections || []
      }),
      
      updateWireframeData: (updates) => set((state) => {
        if (!state.wireframeData) return state;
        
        return {
          wireframeData: {
            ...state.wireframeData,
            ...updates,
            // Special handling for fields that need type conversion
            colorScheme: updates.colorScheme 
              ? { ...state.wireframeData.colorScheme, ...updates.colorScheme }
              : state.wireframeData.colorScheme,
            typography: updates.typography
              ? { ...state.wireframeData.typography, ...updates.typography }
              : state.wireframeData.typography
          }
        };
      }),

      // Section management
      addSection: (sectionData) => set((state) => {
        const newSection: WireframeSection = {
          id: uuidv4(),
          sectionType: 'default', // Adding the required sectionType property
          ...sectionData
        };
        
        const updatedSections = [...state.sections, newSection];
        
        return {
          sections: updatedSections,
          wireframeData: state.wireframeData 
            ? { ...state.wireframeData, sections: updatedSections } 
            : null
        };
      }),
      
      updateSection: (id, updates) => set((state) => {
        const updatedSections = state.sections.map(section => 
          section.id === id ? { ...section, ...updates } : section
        );
        
        return {
          sections: updatedSections,
          wireframeData: state.wireframeData 
            ? { ...state.wireframeData, sections: updatedSections } 
            : null
        };
      }),
      
      removeSection: (id) => set((state) => {
        const updatedSections = state.sections.filter(section => section.id !== id);
        
        return {
          sections: updatedSections,
          wireframeData: state.wireframeData 
            ? { ...state.wireframeData, sections: updatedSections } 
            : null
        };
      }),
      
      moveSectionUp: (id) => set((state) => {
        const sectionIndex = state.sections.findIndex(s => s.id === id);
        if (sectionIndex <= 0) return state; // Already at the top
        
        const updatedSections = [...state.sections];
        const temp = updatedSections[sectionIndex];
        updatedSections[sectionIndex] = updatedSections[sectionIndex - 1];
        updatedSections[sectionIndex - 1] = temp;
        
        return {
          sections: updatedSections,
          wireframeData: state.wireframeData 
            ? { ...state.wireframeData, sections: updatedSections } 
            : null
        };
      }),
      
      moveSectionDown: (id) => set((state) => {
        const sectionIndex = state.sections.findIndex(s => s.id === id);
        if (sectionIndex === -1 || sectionIndex >= state.sections.length - 1) return state;
        
        const updatedSections = [...state.sections];
        const temp = updatedSections[sectionIndex];
        updatedSections[sectionIndex] = updatedSections[sectionIndex + 1];
        updatedSections[sectionIndex + 1] = temp;
        
        return {
          sections: updatedSections,
          wireframeData: state.wireframeData 
            ? { ...state.wireframeData, sections: updatedSections } 
            : null
        };
      }),
      
      setActiveSection: (sectionId) => set({ activeSection: sectionId }),
      
      // UI state methods
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleShowGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleHighlightSections: () => set((state) => ({ highlightSections: !state.highlightSections })),
      setActiveDevice: (device) => set({ activeDevice: device }),
    }),
    {
      name: 'wireframe-storage',
      // Handle type conversions during rehydration from storage
      partialize: (state) => {
        if (!state.wireframeData) {
          return {
            darkMode: state.darkMode,
            showGrid: state.showGrid,
            highlightSections: state.highlightSections,
            activeDevice: state.activeDevice
          };
        }

        // For stored wireframe data with complex types, ensure we convert them properly
        return {
          ...state,
          wireframeData: {
            ...state.wireframeData,
            // Convert complex types to compatible storage formats
            colorScheme: colorSchemeToRecord(state.wireframeData.colorScheme),
            typography: typographyToRecord(state.wireframeData.typography)
          }
        };
      },
      // Fix any type compatibility issues on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Wireframe store rehydrated from storage');
          
          // Additional processing for rehydration if needed
          if (state.wireframeData && state.wireframeData.styleToken) {
            console.log('Found style token in rehydrated data');
          }
        }
      }
    }
  )
);
