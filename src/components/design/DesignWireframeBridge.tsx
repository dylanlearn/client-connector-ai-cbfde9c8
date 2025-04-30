
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeEditor } from '@/components/wireframe';
import { WireframeData as ServiceWireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeData as TypesWireframeData } from '@/types/wireframe';

interface DesignWireframeBridgeProps {
  designData?: any;
  projectId?: string;
}

// Create a bridging function to ensure compatibility between the two WireframeData types
const adaptWireframeData = (wireframe: ServiceWireframeData): TypesWireframeData => {
  // Ensure all required properties in TypesWireframeData are present
  return {
    ...wireframe,
    sections: wireframe.sections.map(section => ({
      ...section,
      // Ensure 'name' is always provided as it's required in TypesWireframeData
      name: section.name || `Section ${section.id.substring(0, 5)}`,
    }))
  } as TypesWireframeData;
};

const DesignWireframeBridge: React.FC<DesignWireframeBridgeProps> = ({ 
  designData = {}, 
  projectId 
}) => {
  const [wireframeData, setWireframeData] = React.useState<TypesWireframeData | null>(null);
  
  // Process design data into wireframe when the component mounts or designData changes
  React.useEffect(() => {
    if (Object.keys(designData).length > 0) {
      // Convert design data to wireframe structure
      // This is a simplified implementation - you'd want to expand this based on your needs
      const wireframe: ServiceWireframeData = {
        id: projectId || 'design-wireframe',
        title: designData.title || 'Design Wireframe',
        sections: designData.sections || [],
        colorScheme: designData.colorScheme || {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#f59e0b',
          background: '#ffffff'
        },
        typography: designData.typography || {
          headings: 'Inter',
          body: 'Inter'
        }
      };
      
      // Adapt the wireframe to ensure compatibility
      setWireframeData(adaptWireframeData(wireframe));
    }
  }, [designData, projectId]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design to Wireframe</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wireframe">
          <TabsList className="mb-4">
            <TabsTrigger value="wireframe">Wireframe</TabsTrigger>
            <TabsTrigger value="design">Design Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wireframe" className="space-y-4">
            {wireframeData ? (
              <WireframeEditor 
                wireframeData={wireframeData}
                projectId={projectId}
                onUpdate={(updated) => setWireframeData(updated)}
              />
            ) : (
              <div className="p-4 text-center bg-muted rounded-md">
                <p>No wireframe data available. Please provide design details.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="design">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2">Design Specifications</h3>
              <pre className="text-xs overflow-auto max-h-96 p-4 bg-background rounded border">
                {JSON.stringify(designData, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DesignWireframeBridge;
