
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { WireframeSection, WireframeData } from '@/services/ai/wireframe/wireframe-types';

interface WireframeState {
  id: string;
  title: string;
  styleToken?: string;
  sections: WireframeSection[];
  description: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
  };
  typography: {
    headings: string;
    body: string;
    fontPairings?: string[];
  };
  activeSection: string | null;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
  darkMode: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  wireframe: WireframeData | null;
  canvasSettings: any;
  undo: () => void;
  redo: () => void;
  setActiveSection: (id: string | null) => void;
  addSection: (section: Omit<WireframeSection, 'id'>) => void;
  updateSection: (id: string, updates: Partial<WireframeSection>) => void;
  removeSection: (id: string) => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  updateWireframe: (wireframe: Partial<WireframeData>) => void;
  setWireframeData: (data: WireframeData) => void;
  updateCanvasSettings: (settings: Partial<any>) => void;
  setDarkMode: (darkMode: boolean) => void;
  setActiveDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
}

// Type guard function to check if a typography object is properly formatted
function isProperTypographyFormat(typography: any): typography is { headings: string; body: string; fontPairings?: string[] } {
  return typeof typography === 'object' && 
         typeof typography.headings === 'string' && 
         typeof typography.body === 'string' &&
         (typography.fontPairings === undefined || Array.isArray(typography.fontPairings));
}

export const useWireframeStore = create<WireframeState>()(
  devtools(
    (set, get) => ({
      id: uuidv4(),
      title: 'New Wireframe',
      description: '',
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827'
      },
      typography: {
        headings: 'sans-serif',
        body: 'sans-serif'
      },
      styleToken: '',
      sections: [],
      activeSection: null,
      activeDevice: 'desktop',
      darkMode: false,
      showGrid: true,
      snapToGrid: true,
      gridSize: 10,
      wireframe: null,
      canvasSettings: {
        width: 1200,
        height: 800,
        zoom: 1,
        panOffset: { x: 0, y: 0 },
        showGrid: true,
        snapToGrid: true,
        gridSize: 10,
        backgroundColor: '#ffffff',
        gridType: 'lines',
        snapTolerance: 10,
        showSmartGuides: true,
      },
      
      setActiveSection: (id) => set({ activeSection: id }),
      
      addSection: (section) => {
        const newSection = {
          ...section,
          id: uuidv4(),
        };
        
        set((state) => ({
          sections: [...state.sections, newSection]
        }));
      },
      
      updateSection: (id, updates) => {
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id ? { ...section, ...updates } : section
          )
        }));
      },
      
      removeSection: (id) => {
        set((state) => ({
          sections: state.sections.filter((section) => section.id !== id),
          activeSection: state.activeSection === id ? null : state.activeSection
        }));
      },
      
      moveSectionUp: (id) => {
        set((state) => {
          const index = state.sections.findIndex((section) => section.id === id);
          if (index <= 0) return state;
          
          const newSections = [...state.sections];
          [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
          
          return { sections: newSections };
        });
      },
      
      moveSectionDown: (id) => {
        set((state) => {
          const index = state.sections.findIndex((section) => section.id === id);
          if (index === -1 || index >= state.sections.length - 1) return state;
          
          const newSections = [...state.sections];
          [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
          
          return { sections: newSections };
        });
      },
      
      updateWireframe: (updates) => {
        set((state) => {
          // Handle typography and colorScheme properly
          let updatedTypography = updates.typography || state.typography;
          let updatedColorScheme = updates.colorScheme || state.colorScheme;
          
          // Ensure typography has the correct format
          if (updatedTypography && !isProperTypographyFormat(updatedTypography)) {
            // If it's a Record<string, string>, create a proper format
            if (typeof updatedTypography === 'object') {
              updatedTypography = {
                headings: (updatedTypography as Record<string, string>).headings || 'sans-serif',
                body: (updatedTypography as Record<string, string>).body || 'sans-serif',
              };
            } else {
              // Fallback to default
              updatedTypography = {
                headings: 'sans-serif',
                body: 'sans-serif'
              };
            }
          }
          
          // Return updated state
          return {
            ...state,
            ...updates,
            typography: updatedTypography,
            colorScheme: updatedColorScheme,
          };
        });
      },
      
      setWireframeData: (data) => {
        set({
          id: data.id || uuidv4(),
          title: data.title || 'New Wireframe',
          description: data.description || '',
          sections: data.sections || [],
          colorScheme: data.colorScheme || {
            primary: '#3b82f6',
            secondary: '#10b981',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#111827'
          },
          typography: data.typography || {
            headings: 'sans-serif',
            body: 'sans-serif'
          },
          styleToken: data.styleToken || '',
          wireframe: data
        });
      },
      
      updateCanvasSettings: (settings) => {
        set((state) => ({
          canvasSettings: {
            ...state.canvasSettings,
            ...settings
          }
        }));
      },
      
      setDarkMode: (darkMode) => set({ darkMode }),
      
      setActiveDevice: (device) => set({ activeDevice: device }),
      
      undo: () => {
        // Placeholder for undo functionality
        console.log('Undo operation not implemented');
      },
      
      redo: () => {
        // Placeholder for redo functionality
        console.log('Redo operation not implemented');
      }
    }),
    {
      name: 'wireframe-store'
    }
  )
);
