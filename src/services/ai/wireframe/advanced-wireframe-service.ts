
export interface AdvancedWireframeParams {
  userInput: string;
  projectId: string;
  styleToken: string;
  includeDesignMemory: boolean;
  customParams?: {
    darkMode?: boolean;
    [key: string]: any;
  };
}

export interface DesignMemory {
  id: string;
  projectId: string;
  layoutPatterns: any[];
  stylePreferences: any;
  componentPreferences: any;
  createdAt: string;
}

// Mock style modifiers and component variants for demo purposes
const mockStyleModifiers = [
  { id: '1', name: 'Modern', description: 'Clean lines and minimalist approach' },
  { id: '2', name: 'Bold', description: 'High contrast and strong visual elements' },
  { id: '3', name: 'Elegant', description: 'Refined aesthetics with subtle details' }
];

const mockComponentVariants = [
  { id: '1', component_type: 'Button', variant_name: 'Primary', description: 'Main call-to-action button' },
  { id: '2', component_type: 'Button', variant_name: 'Secondary', description: 'Alternative action button' },
  { id: '3', component_type: 'Card', variant_name: 'Default', description: 'Standard content card' },
  { id: '4', component_type: 'Card', variant_name: 'Elevated', description: 'Card with drop shadow for emphasis' },
  { id: '5', component_type: 'Navigation', variant_name: 'Sidebar', description: 'Vertical navigation panel' }
];

export const AdvancedWireframeService = {
  generateWireframe: async (params: AdvancedWireframeParams) => {
    // Implementation would go here
    // For now we just return a mock that accepts customParams
    return {
      wireframe: {
        title: "Generated Wireframe",
        description: "A wireframe with the specified parameters",
        sections: [],
        // Pass through the darkMode setting if provided
        darkMode: params.customParams?.darkMode
      },
      intentData: {
        visualTone: "Professional, Modern",
        pageType: "Landing",
        complexity: "Standard"
      },
      blueprint: {}
    };
  },
  
  saveWireframe: async (projectId: string, prompt: string) => {
    // Implementation would go here
    return true;
  },
  
  retrieveDesignMemory: async (projectId?: string) => {
    // Implementation would go here
    return null;
  },
  
  storeDesignMemory: async (
    projectId: string,
    blueprintId: string,
    layoutPatterns: any,
    stylePreferences: any,
    componentPreferences: any
  ) => {
    // Implementation would go here
    return true;
  },

  // Add the missing methods that are being called in AdvancedWireframeGeneratorPage.tsx
  getStyleModifiers: async () => {
    // In a real implementation, this would fetch from an API or database
    return mockStyleModifiers;
  },
  
  getComponentVariants: async () => {
    // In a real implementation, this would fetch from an API or database
    return mockComponentVariants;
  }
};
