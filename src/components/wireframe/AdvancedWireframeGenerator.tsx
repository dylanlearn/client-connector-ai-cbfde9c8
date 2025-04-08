
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WireframeVisualizer } from './index';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Settings, Eye, Save, Code } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  viewMode?: 'edit' | 'preview' | 'code' | 'flowchart';
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  viewMode = 'edit'
}) => {
  const [activeTab, setActiveTab] = useState(viewMode);
  const [wireframeData, setWireframeData] = useState({
    id: uuidv4(),
    title: 'New Wireframe',
    description: 'A wireframe created with the advanced wireframe generator',
    sections: [],
    version: '1.0'
  });
  const { toast } = useToast();

  const handleAddSection = () => {
    toast({
      title: "Feature in development",
      description: "Adding sections will be available soon."
    });
  };

  const handleSave = () => {
    toast({
      title: "Wireframe saved",
      description: "Your wireframe has been saved successfully."
    });
  };

  return (
    <div className="advanced-wireframe-generator">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Advanced Wireframe Generator</h2>
          <p className="text-muted-foreground">
            Create custom wireframes by selecting components
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="edit" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="flowchart" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Flowchart
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" className="justify-start" onClick={handleAddSection}>
                      <Plus className="mr-2 h-4 w-4" />
                      Hero Section
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={handleAddSection}>
                      <Plus className="mr-2 h-4 w-4" />
                      Features
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={handleAddSection}>
                      <Plus className="mr-2 h-4 w-4" />
                      Testimonials
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={handleAddSection}>
                      <Plus className="mr-2 h-4 w-4" />
                      CTA
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={handleAddSection}>
                      <Plus className="mr-2 h-4 w-4" />
                      Footer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <Card className="min-h-[600px]">
                <CardHeader>
                  <CardTitle>Canvas</CardTitle>
                </CardHeader>
                <CardContent>
                  {wireframeData.sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-md">
                      <p className="text-muted-foreground mb-4">No sections added yet</p>
                      <Button variant="outline" onClick={handleAddSection}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Section
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <WireframeVisualizer wireframe={wireframeData} viewMode="flowchart" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Wireframe Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <WireframeVisualizer wireframe={wireframeData} viewMode="preview" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-md overflow-auto max-h-[600px]">
                {JSON.stringify(wireframeData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flowchart">
          <Card>
            <CardHeader>
              <CardTitle>Wireframe Flowchart</CardTitle>
            </CardHeader>
            <CardContent>
              <WireframeVisualizer wireframe={wireframeData} viewMode="flowchart" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedWireframeGenerator;
