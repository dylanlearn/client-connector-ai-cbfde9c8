
import React, { useState, useEffect } from 'react';
import { useWireframeEditor } from '@/hooks/wireframe/use-wireframe-editor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';
import WireframeFeedbackProcessor from './feedback/WireframeFeedbackProcessor'; // Import our new component

interface WireframeEditorProps {
  projectId?: string;
  wireframeData?: WireframeData;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ projectId, wireframeData }) => {
  const [activeTab, setActiveTab] = useState<string>('canvas');
  const { isLoading, projectData, error, saveProject } = useWireframeEditor(projectId);
  
  // Use provided wireframe data if available, otherwise use data from the hook
  const [displayData, setDisplayData] = useState<WireframeData | undefined>(wireframeData || projectData);

  // Update displayData when wireframeData or projectData changes
  useEffect(() => {
    setDisplayData(wireframeData || projectData);
  }, [wireframeData, projectData]);
  
  // Handle wireframe updates from feedback processor
  const handleWireframeUpdate = (updatedWireframe: WireframeData) => {
    setDisplayData(updatedWireframe);
  };

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
      <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50">
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
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
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
        
        {/* New Feedback Tab */}
        <TabsContent value="feedback" className="m-0">
          <Card className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-4">Feedback-Driven Updates</h2>
            
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Describe changes you'd like to make to the wireframe in natural language. 
                The system will interpret your feedback and automatically update the wireframe.
              </p>
              
              <WireframeFeedbackProcessor 
                wireframeId={displayData.id}
                onWireframeUpdate={handleWireframeUpdate}
                createNewVersion={false}
              />
              
              <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                <AlertTitle>How to provide effective feedback</AlertTitle>
                <AlertDescription className="text-sm">
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Be specific about which section you want to modify (e.g., "hero", "pricing", etc.)</li>
                    <li>Clearly state your intent: add, remove, change styling, or modify layout</li>
                    <li>Describe the visual properties you want to change: colors, spacing, alignment</li>
                    <li>Reference specific elements by name: buttons, headings, cards, etc.</li>
                  </ul>
                </AlertDescription>
              </Alert>
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
