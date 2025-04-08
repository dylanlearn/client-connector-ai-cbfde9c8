
import React, { useState, useEffect } from 'react';
import { useWireframeEditor } from '@/hooks/wireframe/use-wireframe-editor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface WireframeEditorProps {
  projectId?: string;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<string>('canvas');
  const { isLoading, projectData, error, saveProject } = useWireframeEditor(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error loading wireframe editor</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="wireframe-editor">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveProject(projectData)}
            >
              Save
            </Button>
          </div>
        </div>
        
        <TabsContent value="canvas" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">
              {projectData?.title || 'New Wireframe'}
            </h2>
            <p className="text-muted-foreground">
              Canvas editor will be displayed here.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">Component Library</h2>
            <p className="text-muted-foreground">
              Component library will be displayed here.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">Preview</h2>
            <p className="text-muted-foreground">
              Wireframe preview will be displayed here.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">Export Options</h2>
            <p className="text-muted-foreground">
              Export options will be displayed here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WireframeEditor;
