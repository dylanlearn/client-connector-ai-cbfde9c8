
import React, { useState, useEffect } from 'react';
import EnhancedWireframeCanvas from './canvas/EnhancedWireframeCanvas';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedWireframeStudioProps {
  projectId: string;
  standalone?: boolean;
  initialData?: any;
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({ 
  projectId,
  standalone = false,
  initialData = null
}) => {
  const { toast } = useToast();
  const [canvasData, setCanvasData] = useState<any>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Update canvas data when initialData changes
  useEffect(() => {
    if (initialData) {
      setCanvasData(initialData);
    }
  }, [initialData]);
  
  // Load saved canvas data if available and no initialData provided
  useEffect(() => {
    const loadSavedData = async () => {
      if (!projectId || initialData) return;
      
      setIsLoading(true);
      
      try {
        // Here we would typically load data from an API or localStorage
        const savedData = localStorage.getItem(`wireframe-canvas-${projectId}`);
        
        if (savedData) {
          setCanvasData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading canvas data:', error);
        toast({
          title: "Error",
          description: "Failed to load saved canvas data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedData();
  }, [projectId, toast, initialData]);
  
  // Save canvas data
  const handleSaveCanvas = (data: any) => {
    if (!projectId) return;
    
    try {
      localStorage.setItem(`wireframe-canvas-${projectId}`, JSON.stringify(data));
      setCanvasData(data);
      
      toast({
        title: "Success",
        description: "Canvas saved successfully",
      });
    } catch (error) {
      console.error('Error saving canvas data:', error);
      toast({
        title: "Error",
        description: "Failed to save canvas data",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading wireframe editor...</p>
      </div>
    );
  }
  
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <Tabs defaultValue="editor" className="h-[calc(100vh-200px)] min-h-[600px]">
          <TabsList className="m-4">
            <TabsTrigger value="editor">Design Canvas</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="h-full">
            <div className="h-full">
              <EnhancedWireframeCanvas
                projectId={projectId}
                onSave={handleSaveCanvas}
                initialData={canvasData}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="h-full">
            <div className="h-full border-t p-4">
              <div className="bg-gray-100 h-full rounded-md overflow-auto">
                <div className="p-6">
                  <EnhancedWireframeCanvas
                    projectId={projectId}
                    readOnly={true}
                    initialData={canvasData}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedWireframeStudio;
