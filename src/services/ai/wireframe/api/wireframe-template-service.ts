// Define a basic template for wireframes
const emptyWireframe = {
  id: 'empty-template',
  title: 'Empty Template',
  description: 'An empty wireframe template', // Added required description field
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
export const createWireframeFromTemplate = async (templateId: string): Promise<any> => {
  // In a real application, this would fetch the template from a database or other source
  // For this example, we'll just return the empty template
  return Promise.resolve(emptyWireframe);
};

export default {
  createWireframeFromTemplate
};
