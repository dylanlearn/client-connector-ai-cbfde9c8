import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useProject } from '@/hooks/useProject';
import { useAdvancedWireframe } from '@/hooks/use-advanced-wireframe';
import { AdvancedWireframeGenerator } from '@/components/wireframe';
import { WireframeVisualizer } from '@/components/wireframe';
import { WireframeDataVisualizer } from '@/components/wireframe';
import WireframeEditor from '@/components/wireframe/WireframeEditor';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Laptop, Smartphone, Download, Share2, Code } from 'lucide-react';

interface EnhancedWireframeStudioProps {
  projectId: string;
  standalone?: boolean;
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({ 
  projectId,
  standalone = false
}) => {
  const [activeTab, setActiveTab] = useState('generator');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const navigate = useNavigate();
  
  const { project } = useProject();
  const { currentWireframe, generateWireframe, saveWireframe } = useAdvancedWireframe();

  const handleWireframeGenerated = (wireframe: any) => {
    console.log("Wireframe generated in studio:", wireframe);
    setActiveTab('visualizer');
  };

  const handleWireframeSaved = (wireframe: any) => {
    console.log("Wireframe saved:", wireframe);
  };

  const handleExport = () => {
    if (!currentWireframe) return;
    
    const wireframeJson = JSON.stringify(currentWireframe, null, 2);
    const blob = new Blob([wireframeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `wireframe-${currentWireframe.title || 'untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="enhanced-wireframe-studio">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Wireframe Studio</h2>
        
        {standalone && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              disabled={!currentWireframe}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!currentWireframe}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="visualizer">Preview</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="data">Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <Card className="p-4">
            <AdvancedWireframeGenerator 
              projectId={projectId} 
              viewMode="editor"
              onWireframeGenerated={handleWireframeGenerated}
              onWireframeSaved={handleWireframeSaved}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="visualizer">
          <Card className="p-4">
            {currentWireframe ? (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {currentWireframe.title || "Untitled Wireframe"}
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant={devicePreview === 'desktop' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDevicePreview('desktop')}
                    >
                      <Laptop className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={devicePreview === 'tablet' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDevicePreview('tablet')}
                    >
                      <Smartphone className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button 
                      variant={devicePreview === 'mobile' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setDevicePreview('mobile')}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden" style={{
                  width: devicePreview === 'desktop' ? '100%' : devicePreview === 'tablet' ? '768px' : '375px',
                  margin: devicePreview !== 'desktop' ? '0 auto' : undefined
                }}>
                  <WireframeVisualizer 
                    wireframeData={currentWireframe} 
                    preview={true}
                    deviceType={devicePreview}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                <p className="text-muted-foreground">No wireframe to preview. Generate one first.</p>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="editor">
          <Card className="p-4">
            {currentWireframe ? (
              <div className="wireframe-editor-container">
                <WireframeEditor 
                  projectId={projectId} 
                  wireframeData={currentWireframe}
                  onUpdate={(updated) => saveWireframe(projectId, "Updated wireframe")}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                <p className="text-muted-foreground">No wireframe to edit. Generate one first.</p>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card className="p-4">
            {currentWireframe ? (
              <div className="wireframe-data-container">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Wireframe Code</h3>
                  <Button variant="outline" size="sm">
                    <Code className="h-4 w-4 mr-2" />
                    Copy JSON
                  </Button>
                </div>
                <WireframeDataVisualizer wireframeData={currentWireframe} title="Wireframe JSON Data" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                <p className="text-muted-foreground">No wireframe data to display. Generate one first.</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedWireframeStudio;
