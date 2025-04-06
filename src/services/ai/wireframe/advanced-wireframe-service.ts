
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
  { id: '5', component_type: 'Navigation', variant_name: 'Sidebar', description: 'Vertical navigation panel' },
  { id: '6', component_type: 'Dashboard', variant_name: 'Finance', description: 'Financial metrics and charts' },
  { id: '7', component_type: 'Dashboard', variant_name: 'Analytics', description: 'Data analysis and visualization' },
  { id: '8', component_type: 'Dashboard', variant_name: 'Admin', description: 'Administrative control panel' },
  { id: '9', component_type: 'Chart', variant_name: 'Bar', description: 'Bar chart visualization' },
  { id: '10', component_type: 'Chart', variant_name: 'Line', description: 'Line chart visualization' },
];

export const AdvancedWireframeService = {
  generateWireframe: async (params: AdvancedWireframeParams) => {
    // Check if we're generating a dashboard wireframe based on user input
    const isDashboard = params.userInput.toLowerCase().includes('dashboard') || 
                       params.userInput.toLowerCase().includes('analytics') ||
                       params.userInput.toLowerCase().includes('admin panel');
    
    // For demo purposes, generate a dashboard if the input includes dashboard-related terms
    if (isDashboard) {
      return {
        wireframe: {
          title: "Finance Dashboard Wireframe",
          description: "Interactive financial data visualization dashboard",
          pages: [
            {
              id: "page-1",
              name: "Dashboard Overview",
              slug: "dashboard",
              pageType: "dashboard",
              sections: [
                {
                  sectionType: "dashboard",
                  name: "Financial Dashboard",
                  componentVariant: "sidebar",
                  layout: "grid",
                  styleProperties: {
                    accentColor: "blue"
                  },
                  components: [
                    { type: "NavSidebar", properties: { collapsed: false } },
                    { type: "MetricsRow", properties: { count: 4 } },
                    { type: "Chart", properties: { type: "line", title: "Revenue Trends" } },
                    { type: "Chart", properties: { type: "pie", title: "Expenses Breakdown" } },
                    { type: "Table", properties: { title: "Recent Transactions" } }
                  ]
                }
              ]
            },
            {
              id: "page-2",
              name: "Analytics",
              slug: "analytics",
              pageType: "analytics",
              sections: [
                {
                  sectionType: "dashboard",
                  name: "Data Analytics",
                  componentVariant: "default",
                  components: [
                    { type: "Chart", properties: { type: "bar", title: "Performance Metrics" } },
                    { type: "Chart", properties: { type: "line", title: "Growth Trends" } }
                  ]
                }
              ]
            }
          ],
          // Pass through the darkMode setting if provided
          darkMode: params.customParams?.darkMode
        },
        intentData: {
          visualTone: "Professional, Data-centric",
          pageType: "Dashboard",
          complexity: "Advanced"
        },
        blueprint: {
          layout: "sidebar-layout",
          components: [
            "metrics-cards",
            "data-charts",
            "transactions-table"
          ]
        }
      };
    }
    
    // Standard wireframe response for non-dashboard requests
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
