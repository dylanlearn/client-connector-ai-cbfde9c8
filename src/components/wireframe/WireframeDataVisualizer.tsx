
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code } from 'lucide-react';

export interface WireframeDataVisualizerProps {
  wireframeData: any;
  title?: string;
}

const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  title = 'Wireframe Data'
}) => {
  if (!wireframeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No wireframe data available to display</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json">
          <TabsList className="mb-4">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="json">
            <pre className="p-4 bg-muted/50 rounded-md overflow-auto max-h-[500px]">
              <code className="text-xs font-mono">
                {JSON.stringify(wireframeData, null, 2)}
              </code>
            </pre>
          </TabsContent>
          
          <TabsContent value="sections">
            <div className="space-y-4">
              {wireframeData.sections && wireframeData.sections.length > 0 ? (
                wireframeData.sections.map((section: any) => (
                  <div key={section.id} className="p-4 border rounded-md">
                    <h3 className="font-medium">{section.name}</h3>
                    <p className="text-sm text-muted-foreground">{section.sectionType}</p>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>Position: ({section.position?.x || 0}, {section.position?.y || 0})</div>
                      <div>Size: {section.dimensions?.width || 0}x{section.dimensions?.height || 0}</div>
                    </div>
                    
                    {section.components && (
                      <div className="mt-2">
                        <p className="text-xs font-medium">Components: {section.components.length}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No sections found in wireframe data</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="metadata">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-md">
                  <p className="text-sm font-medium">Title</p>
                  <p className="text-sm text-muted-foreground">{wireframeData.title || 'Untitled'}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm font-medium">ID</p>
                  <p className="text-sm text-muted-foreground truncate">{wireframeData.id || 'No ID'}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm font-medium">Style</p>
                  <p className="text-sm text-muted-foreground">{wireframeData.style || 'Default'}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm font-medium">Section Count</p>
                  <p className="text-sm text-muted-foreground">
                    {wireframeData.sections ? wireframeData.sections.length : 0}
                  </p>
                </div>
              </div>
              
              {wireframeData.colorScheme && (
                <div className="p-3 border rounded-md">
                  <p className="text-sm font-medium mb-2">Color Scheme</p>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(wireframeData.colorScheme).map(([key, value]) => (
                      <div key={key} className="flex flex-col items-center">
                        <div 
                          className="w-8 h-8 rounded-full border"
                          style={{ backgroundColor: value as string }}
                        />
                        <p className="text-xs mt-1">{key}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WireframeDataVisualizer;
