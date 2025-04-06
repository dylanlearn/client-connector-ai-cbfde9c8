
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WireframeData } from '@/types/wireframe';
import { WireframeDataVisualizer } from '@/components/wireframe';
import { Monitor, Smartphone } from 'lucide-react';

interface MultiPageWireframePreviewProps {
  wireframe: WireframeData;
}

const MultiPageWireframePreview: React.FC<MultiPageWireframePreviewProps> = ({ wireframe }) => {
  const isMultiPage = wireframe?.pages && wireframe.pages.length > 1;
  
  const convertToVisualizer = (data: WireframeData) => ({
    id: data.id || "wireframe-preview",
    title: data.title || "Wireframe Preview",
    description: data.description || "",
    imageUrl: data.imageUrl || "",
    sections: data.sections?.map((section: any, index: number) => ({
      id: section.id || `section-${index}`,
      name: section.name || section.type || `Section ${index + 1}`,
      description: section.description || section.content || "",
      imageUrl: section.imageUrl || ""
    })) || [],
    version: "1.0",
    lastUpdated: new Date().toLocaleDateString()
  });
  
  return (
    <div className="border rounded-md overflow-hidden">
      {isMultiPage ? (
        <Tabs defaultValue="page-0">
          <div className="border-b bg-muted/50 px-4 pt-2">
            <TabsList>
              {wireframe.pages?.map((page, index) => (
                <TabsTrigger key={index} value={`page-${index}`}>
                  {page.name || `Page ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {wireframe.pages?.map((page, index) => (
            <TabsContent key={index} value={`page-${index}`} className="p-4 bg-white">
              <Tabs defaultValue="desktop">
                <TabsList className="mb-4">
                  <TabsTrigger value="desktop" className="flex items-center gap-1">
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex items-center gap-1">
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="desktop">
                  <div className="border rounded-lg p-4 bg-white overflow-hidden">
                    <WireframeDataVisualizer 
                      wireframeData={convertToVisualizer({
                        ...wireframe,
                        sections: page.sections || []
                      })}
                      viewMode="preview"
                      deviceType="desktop"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="mobile">
                  <div className="max-w-[320px] mx-auto border rounded-lg p-4 bg-white overflow-hidden">
                    <WireframeDataVisualizer 
                      wireframeData={convertToVisualizer({
                        ...wireframe,
                        sections: page.sections || []
                      })}
                      viewMode="preview"
                      deviceType="mobile"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="p-4 bg-white">
          <Tabs defaultValue="desktop">
            <TabsList className="mb-4">
              <TabsTrigger value="desktop" className="flex items-center gap-1">
                <Monitor className="h-4 w-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                Mobile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="desktop">
              <div className="border rounded-lg p-4 bg-white overflow-hidden">
                <WireframeDataVisualizer 
                  wireframeData={convertToVisualizer(wireframe)}
                  viewMode="preview"
                  deviceType="desktop"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="mobile">
              <div className="max-w-[320px] mx-auto border rounded-lg p-4 bg-white overflow-hidden">
                <WireframeDataVisualizer 
                  wireframeData={convertToVisualizer(wireframe)}
                  viewMode="preview"
                  deviceType="mobile"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default MultiPageWireframePreview;
