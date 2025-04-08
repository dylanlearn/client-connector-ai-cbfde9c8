
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WireframeDataVisualizerProps } from './types';

const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  darkMode = false,
  viewMode = 'preview',
  deviceType = 'desktop'
}) => {
  if (!wireframeData) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No wireframe data available</p>
      </div>
    );
  }

  return (
    <div className={`wireframe-data-visualizer ${darkMode ? 'dark' : ''}`}>
      <Card className={darkMode ? 'bg-gray-800 text-gray-100' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Wireframe Data</span>
            {wireframeData.id && (
              <Badge variant="outline" className="text-xs">ID: {wireframeData.id.substring(0, 8)}...</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="json">Raw JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                  <p className="text-lg">{wireframeData.title || 'Untitled Wireframe'}</p>
                </div>
                
                {wireframeData.description && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p>{wireframeData.description}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Sections Count</h3>
                  <p>{wireframeData.sections?.length || 0} sections</p>
                </div>

                {wireframeData.lastUpdated && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                    <p>{wireframeData.lastUpdated}</p>
                  </div>
                )}

                {deviceType && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Device Type</h3>
                    <p className="capitalize">{deviceType}</p>
                  </div>
                )}

                {viewMode && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">View Mode</h3>
                    <p className="capitalize">{viewMode}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sections">
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {wireframeData.sections?.map((section: any, index: number) => (
                  <div key={section.id || `section-${index}`} className="border rounded-md p-3">
                    <h3 className="font-medium">{section.name || `Section ${index + 1}`}</h3>
                    {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
                    {section.sectionType && (
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {section.sectionType}
                          {section.componentVariant && ` / ${section.componentVariant}`}
                        </Badge>
                      </div>
                    )}
                    {index < wireframeData.sections.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="json">
              <div className="max-h-96 overflow-auto">
                <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(wireframeData, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WireframeDataVisualizer;
