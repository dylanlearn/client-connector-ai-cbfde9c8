
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIEndpointEditor } from './APIEndpointEditor';
import { APIStateModelEditor } from './APIStateModelEditor';

interface APIModelingSystemProps {
  wireframeId: string;
}

export const APIModelingSystem: React.FC<APIModelingSystemProps> = ({ wireframeId }) => {
  return (
    <Tabs defaultValue="endpoints" className="w-full">
      <TabsList>
        <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        <TabsTrigger value="state">State Models</TabsTrigger>
      </TabsList>
      
      <TabsContent value="endpoints">
        <APIEndpointEditor wireframeId={wireframeId} />
      </TabsContent>
      
      <TabsContent value="state">
        <APIStateModelEditor wireframeId={wireframeId} />
      </TabsContent>
    </Tabs>
  );
};
