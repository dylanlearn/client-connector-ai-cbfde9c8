
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

// Define a basic template for wireframes
const emptyWireframe: WireframeData = {
  id: 'empty-template',
  title: 'Empty Template',
  description: 'An empty wireframe template',
  sections: [],
  colorScheme: {
    primary: '#3182CE',
    secondary: '#805AD5',
    accent: '#ED8936',
    background: '#FFFFFF',
    text: '#1A202C'
  },
  typography: {
    headings: 'Inter',
    body: 'Inter'
  }
};

// Function to create a new wireframe from a template
export const createWireframeFromTemplate = async (templateId: string): Promise<WireframeData> => {
  // In a real application, this would fetch the template from a database or other source
  // For this example, we'll just return the empty template
  return Promise.resolve({
    ...emptyWireframe,
    id: uuidv4() // Generate a new ID for the wireframe
  });
};

export default {
  createWireframeFromTemplate
};
