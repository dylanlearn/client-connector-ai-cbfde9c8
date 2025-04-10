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
    const { sections, colorScheme } = params;

    return {
      id: uuidv4(),
      title: params.title || 'New Wireframe',
      description: params.description || '',
      sections: sections || [],
      style: params.style || {},
      colorScheme: {
        primary: colorScheme.primary || '#3b82f6',
        secondary: colorScheme.secondary || '#10b981',
        accent: colorScheme.accent || '#f59e0b',
        background: colorScheme.background || '#ffffff',
        text: colorScheme.text || '#111827'
      },
      typography: params.typography || {
        headings: 'sans-serif',
        body: 'sans-serif'
      },
      components: params.components || []
    };
  }
};
