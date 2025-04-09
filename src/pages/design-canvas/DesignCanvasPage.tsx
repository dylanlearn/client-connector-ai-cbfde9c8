
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FabricDesignCanvas from '@/components/wireframe/fabric/FabricDesignCanvas';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const DesignCanvasPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('Untitled Design');
  const [projectId] = useState(id || uuidv4());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load project data if ID is provided
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      try {
        // This would normally be an API call
        const savedData = localStorage.getItem(`design-canvas-${id}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.name) {
            setProjectName(parsedData.name);
          }
        }
      } catch (err) {
        console.error('Error loading project data:', err);
        toast({
          title: "Error",
          description: "Could not load project data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, toast]);

  const handleSave = (canvasData: any) => {
    setIsSaving(true);
    try {
      const dataToSave = {
        id: projectId,
        name: projectName,
        data: canvasData,
        lastModified: new Date().toISOString()
      };
      
      localStorage.setItem(`design-canvas-${projectId}`, JSON.stringify(dataToSave));
      
      toast({
        title: "Saved",
        description: "Your design has been saved",
      });
    } catch (err) {
      console.error('Error saving project:', err);
      toast({
        title: "Error",
        description: "Could not save your design",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6 flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-muted-foreground">Loading design canvas...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 lg:p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="project-name" className="sr-only">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={handleNameChange}
                  className="text-xl font-bold bg-transparent border-transparent hover:border-input focus:border-input h-auto py-1"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={isSaving}
                onClick={() => handleSave({})}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">ID: {projectId}</p>
          </div>
        </div>

        <Card className="border shadow-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="design" className="h-[calc(100vh-200px)]">
              <TabsList className="m-4">
                <TabsTrigger value="design">Design Canvas</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="design" className="h-full p-0">
                <FabricDesignCanvas
                  projectId={projectId}
                  onSave={handleSave}
                  showToolbar={true}
                  fullWidth={true}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="h-full p-0">
                <div className="bg-gray-100 h-full p-4 overflow-auto">
                  <div className="bg-white shadow rounded-lg max-w-4xl mx-auto">
                    <FabricDesignCanvas
                      projectId={projectId}
                      readOnly={true}
                      showToolbar={false}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DesignCanvasPage;
