
import { WireframeGenerationParams, WireframeGenerationResult } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock implementation for generating a wireframe using AI
 */
export const generateWireframeWithAI = async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create a simple wireframe structure based on the provided parameters
  const wireframe = {
    id: uuidv4(),
    title: params.description || 'AI Generated Wireframe',
    description: params.designRequirements || '',
    sections: [
      {
        id: uuidv4(),
        name: 'Header Section',
        sectionType: 'hero',
        description: 'Main hero section with headline and CTA',
        components: [],
        layout: {
          type: 'flex',
          direction: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
      {
        id: uuidv4(),
        name: 'Features',
        sectionType: 'features',
        description: 'Features showcase section',
        components: [],
        layout: {
          type: 'grid',
          columns: 3,
          gap: 16
        }
      },
      {
        id: uuidv4(),
        name: 'Footer',
        sectionType: 'footer',
        description: 'Footer with links and contact information',
        components: [],
        layout: {
          type: 'grid',
          columns: 4,
          gap: 16
        }
      }
    ],
    colorScheme: {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: {
      headings: 'sans-serif',
      body: 'sans-serif',
      fontPairings: ['Roboto/Open Sans']
    },
    style: params.style || {}
  };
  
  return {
    wireframe,
    success: true,
    error: undefined,
    generationTime: 1.2,
    model: 'gpt-4-turbo'
  };
};
