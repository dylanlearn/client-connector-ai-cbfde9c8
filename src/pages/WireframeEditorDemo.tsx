
import React, { useState } from 'react';
import { FidelityProvider } from '@/components/wireframe/fidelity/FidelityContext';
import FidelityDemo from '@/components/wireframe/fidelity/FidelityDemo';
import MaterialSystemDemo from '@/components/wireframe/demo/MaterialSystemDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Palette } from 'lucide-react';

const WireframeEditorDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("fidelity");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Wireframe Design System Demo</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="fidelity" className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            Fidelity Levels
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            Material System
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="fidelity">
          <Card>
            <CardHeader>
              <CardTitle>Design Fidelity Exploration</CardTitle>
            </CardHeader>
            <CardContent>
              <FidelityProvider initialLevel="medium" transitionDuration={300}>
                <FidelityDemo />
              </FidelityProvider>
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
