
import React from 'react';
import { FidelityProvider } from '@/components/wireframe/fidelity/FidelityContext';
import FidelityDemo from '@/components/wireframe/fidelity/FidelityDemo';
import MaterialSystemDemo from '@/components/wireframe/demo/MaterialSystemDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WireframeEditorDemo: React.FC = () => {
  const demoContent = [
    {
      title: "Fidelity Levels",
      description: "Explore how design fidelity impacts visual representation",
      component: <FidelityDemo />
    },
    {
      title: "Material System",
      description: "Discover advanced material rendering techniques",
      component: <MaterialSystemDemo />
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Wireframe Design System Demo</h1>
      
      <Tabs defaultValue="fidelity">
        <TabsList className="mb-4">
          <TabsTrigger value="fidelity">Fidelity Levels</TabsTrigger>
          <TabsTrigger value="materials">Material System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fidelity">
          <Card>
            <CardHeader>
              <CardTitle>Design Fidelity Exploration</CardTitle>
            </CardHeader>
            <CardContent>
              <FidelityDemo />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Material Rendering Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <MaterialSystemDemo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WireframeEditorDemo;
