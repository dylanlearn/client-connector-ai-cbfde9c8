
import React, { useState, useEffect } from 'react';
import { useWireframeEditor } from '@/hooks/wireframe/use-wireframe-editor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';

interface WireframeEditorProps {
  projectId?: string;
  wireframeData?: WireframeData;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ projectId, wireframeData }) => {
  const [activeTab, setActiveTab] = useState<string>('canvas');
  const { isLoading, projectData, error, saveProject } = useWireframeEditor(projectId);
  
  // Use provided wireframe data if available, otherwise use data from the hook
  const displayData = wireframeData || projectData;

  if (isLoading && !wireframeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !wireframeData) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error loading wireframe editor</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!displayData || !displayData.sections || displayData.sections.length === 0) {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertTitle>No wireframe data</AlertTitle>
        <AlertDescription>There are no sections to display in this wireframe.</AlertDescription>
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
              onClick={() => saveProject(displayData)}
            >
              Save
            </Button>
          </div>
        </div>
        
        <TabsContent value="canvas" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">
              {displayData?.title || 'New Wireframe'}
            </h2>
            
            <div className="w-full h-[600px] overflow-auto border rounded">
              <WireframeCanvasEnhanced 
                sections={displayData.sections}
                width={1200}
                height={displayData.sections.length * 400 + 200}
                editable={true}
                showGrid={true}
                snapToGrid={true}
              />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">Component Library</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {displayData.sections.map(section => (
                <div key={section.id} className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium">{section.name}</h3>
                  <p className="text-sm text-muted-foreground">{section.sectionType}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">Preview</h2>
            
            <div className="w-full overflow-hidden rounded-md border">
              <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
                <WireframeCanvasEnhanced 
                  sections={displayData.sections}
                  width={1200}
                  height={displayData.sections.length * 400 + 200}
                  editable={false}
                  showGrid={false}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">Export Options</h2>
            
            <div className="space-y-4">
              <Button variant="outline" onClick={() => {
                const json = JSON.stringify(displayData, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `wireframe-${displayData.title || 'export'}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                Export as JSON
              </Button>
              
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">JSON Preview</h3>
                <pre className="bg-muted/50 p-4 rounded-md overflow-auto max-h-[300px] text-xs">
                  {JSON.stringify(displayData, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WireframeEditor;
