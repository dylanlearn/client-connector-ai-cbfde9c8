
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeData, 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeTypography,
  WireframeColorScheme,
  WireframeSection
} from '@/services/ai/wireframe/wireframe-types';
import { CoreWireframeService } from '@/services/ai/wireframe/core-wireframe-service';
import { colorSchemeToRecord, typographyToRecord } from '@/utils/type-compatibility-helpers';

interface WireframeState {
  // Original properties
  wireframe: WireframeData | null;
  isGenerating: boolean;
  error: Error | null;
  generationParams: WireframeGenerationParams | null;
  generationResult: WireframeGenerationResult | null;
  
  // Added properties for UI components
  darkMode: boolean;
  showGrid: boolean;
  highlightSections: boolean;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
  activeSection: string | null;
  sections: WireframeSection[];
  
  // Original methods
  setWireframe: (wireframe: WireframeData | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: Error | null) => void;
  setGenerationParams: (params: WireframeGenerationParams | null) => void;
  setGenerationResult: (result: WireframeGenerationResult | null) => void;
  generateWireframe: (params: WireframeGenerationParams) => Promise<void>;
  reset: () => void;
  
  // Added methods for UI components
  toggleDarkMode: () => void;
  toggleShowGrid: () => void;
  toggleHighlightSections: () => void;
  setActiveDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setActiveSection: (sectionId: string | null) => void;
  
  // Added methods for section management
  addSection: (section: Omit<WireframeSection, "id">) => void;
  updateSection: (id: string, updates: Partial<WireframeSection>) => void;
  removeSection: (id: string) => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
}

export const useWireframeStore = create<WireframeState>()(
  persist(
    (set, get) => ({
      // Original state
      wireframe: null,
      isGenerating: false,
      error: null,
      generationParams: null,
      generationResult: null,
      
      // Added state
      darkMode: false,
      showGrid: true,
      highlightSections: false,
      activeDevice: 'desktop',
      activeSection: null,
      sections: [],
      
      // Original methods
      setWireframe: (wireframe) => set({ 
        wireframe,
        // Update sections whenever wireframe is updated
        sections: wireframe?.sections || []
      }),
      setGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      setGenerationParams: (params) => set({ generationParams: params }),
      setGenerationResult: (result) => set({ generationResult: result }),
      
      generateWireframe: async (params: WireframeGenerationParams) => {
        set({ isGenerating: true, error: null, generationParams: params });
        try {
          const result = await CoreWireframeService.generateWireframe(params);
          set({ 
            wireframe: result.wireframe, 
            generationResult: result,
            sections: result.wireframe?.sections || [],
            error: null 
          });
        } catch (error: any) {
          set({ 
            error: error instanceof Error ? error : new Error(error.message || 'Failed to generate wireframe'),
            generationResult: {
              wireframe: null,
              success: false,
              message: error.message || 'Failed to generate wireframe'
            }
          });
        } finally {
          set({ isGenerating: false });
        }
      },
      
      reset: () => {
        set({
          wireframe: null,
          isGenerating: false,
          error: null,
          generationParams: null,
          generationResult: null,
          sections: [],
          activeSection: null
        });
      },
      
      // Added methods
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      toggleShowGrid: () => set(state => ({ showGrid: !state.showGrid })),
      toggleHighlightSections: () => set(state => ({ highlightSections: !state.highlightSections })),
      setActiveDevice: (device) => set({ activeDevice: device }),
      setActiveSection: (sectionId) => set({ activeSection: sectionId }),
      
      // Section management methods
      addSection: (sectionData) => set(state => {
        const newSection = {
          ...sectionData,
          id: uuidv4()
        };
        
        const newSections = [...(state.sections || []), newSection];
        
        // Update both sections array and wireframe.sections
        if (state.wireframe) {
          return { 
            sections: newSections,
            wireframe: {
              ...state.wireframe,
              sections: newSections
            }
          };
        }
        
        return { sections: newSections };
      }),
      
      updateSection: (id, updates) => set(state => {
        const updatedSections = (state.sections || []).map(section => 
          section.id === id ? { ...section, ...updates } : section
        );
        
        // Update both sections array and wireframe.sections
        if (state.wireframe) {
          return { 
            sections: updatedSections,
            wireframe: {
              ...state.wireframe,
              sections: updatedSections
            }
          };
        }
        
        return { sections: updatedSections };
      }),
      
      removeSection: (id) => set(state => {
        const filteredSections = (state.sections || []).filter(section => section.id !== id);
        
        // Update both sections array and wireframe.sections
        if (state.wireframe) {
          return { 
            sections: filteredSections,
            wireframe: {
              ...state.wireframe,
              sections: filteredSections
            },
            // Clear active section if it was the one removed
            activeSection: state.activeSection === id ? null : state.activeSection
          };
        }
        
        return { 
          sections: filteredSections,
          activeSection: state.activeSection === id ? null : state.activeSection
        };
      }),
      
      moveSectionUp: (id) => set(state => {
        const sections = [...(state.sections || [])];
        const index = sections.findIndex(s => s.id === id);
        if (index <= 0) return state; // Already at the top or not found
        
        // Swap with previous section
        [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
        
        // Update both sections array and wireframe.sections
        if (state.wireframe) {
          return { 
            sections,
            wireframe: {
              ...state.wireframe,
              sections
            }
          };
        }
        
        return { sections };
      }),
      
      moveSectionDown: (id) => set(state => {
        const sections = [...(state.sections || [])];
        const index = sections.findIndex(s => s.id === id);
        if (index === -1 || index >= sections.length - 1) return state; // Not found or already at the bottom
        
        // Swap with next section
        [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
        
        // Update both sections array and wireframe.sections
        if (state.wireframe) {
          return { 
            sections,
            wireframe: {
              ...state.wireframe,
              sections
            }
          };
        }
        
        return { sections };
      }),
    }),
    {
      name: 'wireframe-storage',
      serialize: (state) => {
        const { wireframe, ...rest } = state;
        
        // Convert complex types to simpler representations
        const serializedWireframe = wireframe ? {
          ...wireframe,
          colorScheme: colorSchemeToRecord(wireframe.colorScheme),
          typography: typographyToRecord(wireframe.typography)
        } : null;
        
        return JSON.stringify({ wireframe: serializedWireframe, ...rest });
      },
      deserialize: (storedState) => {
        try {
          const parsedState = JSON.parse(storedState);
          if (!parsedState) {
            return parsedState;
          }
          
          const { wireframe, ...rest } = parsedState;
          
          // Convert back to original types
          const deserializedWireframe = wireframe ? {
            ...wireframe,
            colorScheme: wireframe.colorScheme,
            typography: wireframe.typography
          } : null;
          
          return { 
            wireframe: deserializedWireframe, 
            sections: deserializedWireframe?.sections || [],
            ...rest 
          };
        } catch (e) {
          console.error("Failed to deserialize wireframe state", e);
          return {
            wireframe: null,
            isGenerating: false,
            error: null,
            generationParams: null,
            generationResult: null,
            darkMode: false,
            showGrid: true,
            highlightSections: false,
            activeDevice: 'desktop',
            activeSection: null,
            sections: [],
          };
        }
      },
    }
  )
);
