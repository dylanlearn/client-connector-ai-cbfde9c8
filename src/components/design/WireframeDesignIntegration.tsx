
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DesignWireframeBridge from './DesignWireframeBridge';

interface WireframeDesignIntegrationProps {
  designData?: any;
  projectId?: string;
}

const WireframeDesignIntegration: React.FC<WireframeDesignIntegrationProps> = ({ 
  designData = {}, 
  projectId 
}) => {
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
            <DesignWireframeBridge 
              designData={designData}
              projectId={projectId}
            />
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

export default WireframeDesignIntegration;
