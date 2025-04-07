
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Code, Copy } from 'lucide-react';

interface WireframeDataVisualizerProps {
  wireframeData: any;
  title?: string;
  description?: string;
}

const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  title = 'Wireframe Data',
  description = 'JSON representation of the wireframe structure'
}) => {
  const [activeTab, setActiveTab] = useState('preview');

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(wireframeData, null, 2));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="json">
              <Code className="h-4 w-4 mr-2" />
              JSON Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            <div className="space-y-4">
              {wireframeData.title && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Title</h3>
                  <p>{wireframeData.title}</p>
                </div>
              )}
              
              {wireframeData.description && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Description</h3>
                  <p className="text-muted-foreground">{wireframeData.description}</p>
                </div>
              )}
              
              {wireframeData.sections && wireframeData.sections.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Sections</h3>
                  <div className="space-y-2">
                    {wireframeData.sections.map((section: any, index: number) => (
                      <div key={section.id || index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium">{section.name || `Section ${index + 1}`}</h4>
                          {section.type && (
                            <Badge variant="outline">{section.type}</Badge>
                          )}
                        </div>
                        {section.description && (
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {wireframeData.components && wireframeData.components.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-2">Components</h3>
                  <div className="space-y-2">
                    {wireframeData.components.map((component: any, index: number) => (
                      <div key={component.id || index} className="border rounded-md p-3">
                        <h4 className="font-medium">{component.name || `Component ${index + 1}`}</h4>
                        {component.type && (
                          <Badge variant="secondary" className="mt-1">{component.type}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="json">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-xs">
                {JSON.stringify(wireframeData, null, 2)}
              </pre>
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-2 right-2" 
                onClick={handleCopyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WireframeDataVisualizer;
