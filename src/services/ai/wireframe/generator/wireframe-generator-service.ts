
import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeSection, WireframeComponent } from '../wireframe-types';

interface GenerationParams {
  title?: string;
  description?: string;
  sections?: WireframeSection[];
  style?: any;
  colorScheme?: any;
  typography?: any;
  components?: WireframeComponent[];
}

export const WireframeGeneratorService = {
  generateWireframe(params: GenerationParams): WireframeData {
    const { sections, colorScheme, components } = params;
    
    // Ensure we have default values for required properties
    const defaultColorScheme = {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    };

    // Create and return a valid WireframeData object
    return {
      id: uuidv4(),
      title: params.title || 'New Wireframe',
      description: params.description || '',
      sections: sections || [],
      style: params.style || '',
      colorScheme: {
        primary: colorScheme?.primary || defaultColorScheme.primary,
        secondary: colorScheme?.secondary || defaultColorScheme.secondary,
        accent: colorScheme?.accent || defaultColorScheme.accent,
        background: colorScheme?.background || defaultColorScheme.background,
        text: colorScheme?.text || defaultColorScheme.text
      },
      typography: params.typography || {
        headings: 'sans-serif',
        body: 'sans-serif'
      }
      // We're removing 'components' from here as it's not part of WireframeData
      // Components should be added to sections instead
    };
  }
};

export const wireframeGenerator = WireframeGeneratorService;
