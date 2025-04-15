import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  WireframeData, 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeTypography,
  WireframeColorScheme
} from '@/services/ai/wireframe/wireframe-types';
import { CoreWireframeService } from '@/services/ai/wireframe/core-wireframe-service';
import { colorSchemeToRecord, typographyToRecord } from '@/utils/type-compatibility-helpers';

interface WireframeState {
  wireframe: WireframeData | null;
  isGenerating: boolean;
  error: Error | null;
  generationParams: WireframeGenerationParams | null;
  generationResult: WireframeGenerationResult | null;
  setWireframe: (wireframe: WireframeData | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: Error | null) => void;
  setGenerationParams: (params: WireframeGenerationParams | null) => void;
  setGenerationResult: (result: WireframeGenerationResult | null) => void;
  generateWireframe: (params: WireframeGenerationParams) => Promise<void>;
  reset: () => void;
}

export const useWireframeStore = create<WireframeState>()(
  persist(
    (set, get) => ({
      wireframe: null,
      isGenerating: false,
      error: null,
      generationParams: null,
      generationResult: null,
      setWireframe: (wireframe) => set({ wireframe }),
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
        });
      },
    }),
    {
      name: 'wireframe-storage',
      serialize: (state) => {
        const { wireframe, ...rest } = state;
        
        // Convert complex types to simpler representations
        const serializedWireframe = wireframe ? {
          ...wireframe,
          colorScheme: colorSchemeToRecord(wireframe.colorScheme),
          typography: { ...wireframe.typography }
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
          
          return { wireframe: deserializedWireframe, ...rest };
        } catch (e) {
          console.error("Failed to deserialize wireframe state", e);
          return {
            wireframe: null,
            isGenerating: false,
            error: null,
            generationParams: null,
            generationResult: null,
          };
        }
      },
    }
  )
);
