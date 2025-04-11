
import { WireframeData, WireframeGenerationParams } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock implementation of creating a wireframe from a template
 */
export const createWireframeFromTemplate = async (
  templateId: string, 
  params: WireframeGenerationParams
): Promise<WireframeData> => {
  // Create a mock wireframe based on template ID
  const wireframe: WireframeData = {
    id: uuidv4(),
    title: params.description || `Template: ${templateId}`,
    description: 'Created from template',
    sections: [
      {
        id: uuidv4(),
        name: 'Template Header',
        sectionType: 'header',
        copySuggestions: {
          heading: 'Template Title',
          subheading: 'Template Description'
        }
      },
      {
        id: uuidv4(),
        name: 'Template Content',
        sectionType: 'content',
        copySuggestions: {
          heading: 'Main Content',
          subheading: 'Information about our services'
        }
      },
      {
        id: uuidv4(),
        name: 'Template Footer',
        sectionType: 'footer',
        copySuggestions: {
          heading: 'Contact Us',
          supportText: '© 2025 Example Company'
        }
      }
    ],
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
    }
  };

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 300));

  return wireframe;
};
