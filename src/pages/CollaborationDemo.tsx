
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { nanoid } from 'nanoid';
import CollaborativeEditorWithAnnotations from '@/components/collaboration/CollaborativeEditorWithAnnotations';
import HighPerformanceCanvas from '@/components/canvas/HighPerformanceCanvas';
import WireframeOptimizedDemo from '@/components/canvas/WireframeOptimizedDemo';

const CollaborationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('collaboration');
  const documentId = nanoid();
  const projectId = nanoid();
  
  return (
    <div className="container max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Cross-Team Collaboration Framework</h1>
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">Advanced Canvas Rendering</Badge>
        <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">Memory Management</Badge>
        <Badge variant="outline" className="text-purple-500 border-purple-200 bg-purple-50">Collaborative Editing</Badge>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="collaboration">Collaborative Editing</TabsTrigger>
          <TabsTrigger value="optimization">Canvas Optimization</TabsTrigger>
          <TabsTrigger value="memory">Memory Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="collaboration">
          <Card>
            <CardHeader>
              <CardTitle>Collaborative Document Editor</CardTitle>
              <CardDescription>
                Real-time collaborative editing with annotations and user presence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CollaborativeEditorWithAnnotations documentId={documentId} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Document ID: {documentId}
              </div>
              <Button variant="outline">Share Document</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Canvas Rendering</CardTitle>
              <CardDescription>
                Optimized canvas rendering with layer caching, incremental rendering, and hardware acceleration
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <WireframeOptimizedDemo />
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Canvas optimization features improve performance with complex wireframes
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Memory Management System</CardTitle>
              <CardDescription>
                Advanced memory management with object pooling and automatic garbage collection
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <HighPerformanceCanvas 
                width={1200}
                height={600}
                optimizationLevel="high"
                enableLayerCaching={true}
                enableMemoryManagement={true}
              />
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Memory management optimizes resource usage for complex projects
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">System Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Real-time document editing</li>
                <li>User presence indicators</li>
                <li>Multi-type annotations (text, voice, video, sketch)</li>
                <li>Threaded comments and feedback</li>
                <li>Team project management</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Canvas Rendering</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Layer caching for static elements</li>
                <li>Incremental rendering for large canvases</li>
                <li>Hardware acceleration</li>
                <li>Object visibility optimization</li>
                <li>Performance metrics tracking</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Memory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Object pooling for reusable elements</li>
                <li>Automatic garbage collection</li>
                <li>Resource monitoring</li>
                <li>Memory usage optimization</li>
                <li>Performance analytics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollaborationDemo;
