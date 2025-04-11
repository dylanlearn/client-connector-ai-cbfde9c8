
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import EnhancedWireframePreview from './preview/EnhancedWireframePreview';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

interface MainWireframeViewProps {
  wireframe: WireframeData;
  className?: string;
}

/**
 * The main wireframe view component providing preview and editing capabilities
 */
const MainWireframeView: React.FC<MainWireframeViewProps> = ({ wireframe, className }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  
  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    console.log('Section clicked:', sectionId);
  };

  // Export handler
  const handleExport = (format: string) => {
    console.log('Exporting wireframe as:', format);
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>{wireframe.title || 'Untitled Wireframe'}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="preview" className="h-full">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-4">
            <TabsContent value="preview" className="mt-0">
              <EnhancedWireframePreview 
                wireframe={wireframe}
                onSectionClick={handleSectionClick}
                onExport={handleExport}
              />
            </TabsContent>
            
            <TabsContent value="sections" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {wireframe.sections?.map(section => (
                  <div 
                    key={section.id} 
                    className={`border rounded-md p-4 cursor-pointer ${selectedSectionId === section.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleSectionClick(section.id)}
                  >
                    <h3 className="font-medium">{section.name || section.sectionType || 'Unnamed Section'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Type: {section.sectionType || 'generic'}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="mt-0">
              <pre className="p-4 bg-muted rounded-md overflow-auto">
                <code>{JSON.stringify(wireframe, null, 2)}</code>
              </pre>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MainWireframeView;
