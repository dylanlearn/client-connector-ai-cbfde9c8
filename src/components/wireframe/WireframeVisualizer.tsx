import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, LayoutGrid, Monitor, Smartphone, Tablet } from 'lucide-react';
import { WireframeData } from '@/types/wireframe';

interface WireframeSection {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface WireframeProps {
  wireframe: {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    sections?: WireframeSection[];
    version: string;
    lastUpdated: string;
  };
  onSelect?: (wireframeId: string) => void;
  onEdit?: (wireframeId: string) => void;
  viewMode?: "preview" | "flowchart";
  deviceType?: "desktop" | "mobile" | "tablet";
  darkMode?: boolean;
  interactive?: boolean;
  highlightSections?: boolean;
  showGrid?: boolean;
}

// Alternative interface for the component when passing wireframe data directly
export interface WireframeDataProps {
  wireframeData: WireframeData;
  viewMode?: "preview" | "flowchart";
  deviceType?: "desktop" | "mobile" | "tablet";
  darkMode?: boolean;
  interactive?: boolean;
  highlightSections?: boolean;
  showGrid?: boolean;
}

export const WireframeVisualizer: React.FC<WireframeProps> = ({ 
  wireframe,
  onSelect,
  onEdit,
  viewMode = "preview",
  deviceType = "desktop",
  darkMode = false,
  interactive = false,
  highlightSections = false,
  showGrid = false
}) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [activeDevice, setActiveDevice] = useState<string>(deviceType);
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-muted/40">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{wireframe.title}</CardTitle>
            <CardDescription className="mt-1">{wireframe.description}</CardDescription>
          </div>
          <div>
            <Badge variant="outline" className="whitespace-nowrap">v{wireframe.version}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <div className="border-b border-muted">
        <div className="flex justify-between px-6 py-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="sections" className="flex items-center gap-1">
                <LayoutGrid className="h-4 w-4" />
                <span>Sections</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>Code</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-1 border rounded-md">
            <Button 
              variant={activeDevice === "desktop" ? "secondary" : "ghost"} 
              size="sm" 
              className="rounded-none rounded-l-md h-8" 
              onClick={() => setActiveDevice("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={activeDevice === "tablet" ? "secondary" : "ghost"} 
              size="sm" 
              className="rounded-none border-x h-8" 
              onClick={() => setActiveDevice("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              variant={activeDevice === "mobile" ? "secondary" : "ghost"} 
              size="sm" 
              className="rounded-none rounded-r-md h-8" 
              onClick={() => setActiveDevice("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <TabsContent value="preview" className="m-0">
          <div className={`flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900/90' : 'bg-muted/30'} ${
            activeDevice === "mobile" ? "min-h-[500px]" : "min-h-[400px]"
          }`}>
            {wireframe.imageUrl ? (
              <div className={`transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-background'} shadow-md overflow-hidden ${
                activeDevice === "desktop" ? "w-full aspect-video" :
                activeDevice === "tablet" ? "w-3/4 aspect-[4/3]" :
                "w-1/3 min-w-[320px] aspect-[9/16]"
              }`}>
                <img 
                  src={wireframe.imageUrl} 
                  alt={wireframe.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="text-muted-foreground">No preview available</div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="sections" className="m-0">
          {wireframe.sections && wireframe.sections.length > 0 ? (
            <div className="p-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {wireframe.sections.map(section => (
                    <CarouselItem key={section.id} className="md:basis-1/2">
                      <Card>
                        <CardContent className="p-4">
                          <div className="aspect-video bg-muted rounded-md overflow-hidden mb-3">
                            {section.imageUrl ? (
                              <img 
                                src={section.imageUrl} 
                                alt={section.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium">{section.name}</h4>
                          {section.description && (
                            <p className="text-sm text-muted-foreground">{section.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No sections defined for this wireframe
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="code" className="m-0">
          <div className="p-4 bg-muted font-mono text-sm overflow-x-auto max-h-[400px]">
            <pre>
              {`// Generated React component for ${wireframe.title}
import React from 'react';

const ${wireframe.title.replace(/\s+/g, '')} = () => {
  return (
    <div className="container mx-auto">
      <header className="py-6">
        <h1 className="text-2xl font-bold">${wireframe.title}</h1>
        <p>${wireframe.description || 'No description'}</p>
      </header>
      
      {/* Main content sections */}
      <main>
        ${wireframe.sections?.map(section => 
          `<section id="${section.id}">
          <h2>${section.name}</h2>
          <div>${section.description || 'Section content'}</div>
        </section>`
        ).join('\n        ') || '// No sections defined'}
      </main>
    </div>
  );
};

export default ${wireframe.title.replace(/\s+/g, '')};
`}
            </pre>
          </div>
        </TabsContent>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 bg-muted/20">
        <div className="text-xs text-muted-foreground">
          Last updated: {wireframe.lastUpdated}
        </div>
        <div className="flex gap-2">
          {onSelect && (
            <Button variant="outline" size="sm" onClick={() => onSelect(wireframe.id)}>
              Use This Design
            </Button>
          )}
          {onEdit && (
            <Button size="sm" onClick={() => onEdit(wireframe.id)}>
              Customize
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Adapter component that accepts wireframeData directly
export const WireframeDataVisualizer: React.FC<WireframeDataProps> = ({ 
  wireframeData, 
  viewMode = "preview",
  deviceType = "desktop",
  darkMode = false,
  interactive = false,
  highlightSections = false,
  showGrid = false
}) => {
  const adaptedWireframe = {
    id: wireframeData.id || "default-id",
    title: wireframeData.title || "Wireframe Preview",
    description: wireframeData.description || "Generated wireframe based on your requirements",
    imageUrl: wireframeData.imageUrl || "/wireframes/default.jpg",
    sections: wireframeData.sections?.map((section, index) => ({
      id: section.id || `section-${index}`,
      name: section.name || `Section ${index + 1}`,
      description: section.description || "",
      imageUrl: section.imageUrl || ""
    })) || [],
    version: "1.0",
    lastUpdated: new Date().toLocaleDateString()
  };

  return (
    <WireframeVisualizer 
      wireframe={adaptedWireframe}
      viewMode={viewMode}
      deviceType={deviceType}
      darkMode={darkMode}
      interactive={interactive}
      highlightSections={highlightSections}
      showGrid={showGrid}
    />
  );
};

export default WireframeVisualizer;
