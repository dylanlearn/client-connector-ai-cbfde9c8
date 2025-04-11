import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

// Mock wireframe template service
const defaultTemplate: WireframeData = {
  id: 'template-default',
  title: 'Default Template',
  sections: [],
  colorScheme: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#000000'
  },
  typography: {
    headings: 'Inter',
    body: 'Inter'
  }
};

export const getTemplate = async (templateId: string): Promise<WireframeData> => {
  // In a real implementation, this would fetch from a database or other source
  return Promise.resolve(defaultTemplate);
};

export const listTemplates = async (): Promise<WireframeData[]> => {
  // In a real implementation, this would fetch a list of templates
  return Promise.resolve([defaultTemplate]);
};
