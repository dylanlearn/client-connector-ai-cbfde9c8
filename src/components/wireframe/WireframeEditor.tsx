
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import EnhancedPerformanceWireframe from './EnhancedPerformanceWireframe';
import { WireframeData } from '@/types/wireframe';

interface WireframeEditorProps {
  wireframeData?: WireframeData;
  viewMode?: 'edit' | 'preview' | 'code';
}

// Sample wireframe data for demo purposes
const sampleWireframe: WireframeData = {
  id: 'demo-wireframe-1',
  title: 'Sample Wireframe',
  sections: [
    {
      id: 'section-1',
      name: 'Header Section',
      sectionType: 'header',
      description: 'Main navigation and header area',
      components: []
    },
    {
      id: 'section-2',
      name: 'Hero Section',
      sectionType: 'hero',
      description: 'Main hero section with call to action',
      components: []
    },
    {
      id: 'section-3',
      name: 'Features Section',
      sectionType: 'features',
      description: 'Product features showcase',
      components: []
    }
  ],
  colorScheme: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff'
  },
  typography: {
    headings: 'Inter',
    body: 'Inter'
  }
};

export const WireframeEditor: React.FC<WireframeEditorProps> = ({
  wireframeData = sampleWireframe,
  viewMode = 'edit'
}) => {
  const [activeTab, setActiveTab] = useState(viewMode);

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab as any}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="p-0">
          <CardContent className="p-0">
            <div className="p-4">
              <p>Edit mode - Wireframe editor interface would go here</p>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="preview" className="p-0">
          <CardContent className="p-0">
            <EnhancedPerformanceWireframe wireframe={wireframeData} />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="code" className="p-0">
          <CardContent>
            <pre className="p-4 bg-slate-100 rounded overflow-auto max-h-[500px]">
              {JSON.stringify(wireframeData, null, 2)}
            </pre>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default WireframeEditor;
