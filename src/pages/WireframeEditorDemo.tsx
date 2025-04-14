
import React, { useState } from 'react';
import WireframeEditorWithGrid from '@/components/wireframe/WireframeEditorWithGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Undo2, Redo2, Save, HelpCircle } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useWireframe } from '@/hooks/useWireframe';
import { v4 as uuidv4 } from 'uuid';

const WireframeEditorDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [projectId] = useState(() => uuidv4());
  
  const {
    currentWireframe,
    isGenerating,
    generateWireframe,
    saveWireframe,
    reset
  } = useWireframe({
    projectId,
    useSonnerToasts: true
  });
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Wireframe Editor</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Undo2 className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button variant="outline" size="sm">
              <Redo2 className="h-4 w-4 mr-1" />
              Redo
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => currentWireframe && saveWireframe('Updated wireframe')}
              disabled={!currentWireframe}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground flex items-center">
          Create wireframes with a configurable grid system and layer management
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold">Grid System Features:</h4>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  <li>Configurable column counts</li>
                  <li>Snapping to grid points</li>
                  <li>Visual alignment guides</li>
                </ul>
                
                <h4 className="font-semibold">Layer Management Features:</h4>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  <li>Change layer stacking order (z-index)</li>
                  <li>Toggle layer visibility</li>
                  <li>Lock/unlock layers</li>
                  <li>Group multiple layers</li>
                </ul>
              </div>
            </HoverCardContent>
          </HoverCard>
        </p>
      </header>
      
      <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-4">
          <WireframeEditorWithGrid
            width={1200}
            height={800}
            className="min-h-[700px]"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <div className="border rounded-md p-6 flex items-center justify-center min-h-[700px]">
            <div className="text-center text-muted-foreground">
              <p>Preview mode would display the final wireframe without editing controls</p>
              <Button 
                variant="link" 
                onClick={() => setActiveTab('editor')}
              >
                Return to Editor
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="mt-4">
          <div className="border rounded-md p-6 min-h-[700px]">
            <p className="text-muted-foreground mb-4">Generated code would appear here</p>
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {`<div class="wireframe-container">
  <header class="wireframe-header">
    <h1>Page Title</h1>
    <nav>Navigation</nav>
  </header>
  <main class="wireframe-content">
    <section class="hero">
      <!-- Hero content -->
    </section>
    <!-- More sections -->
  </main>
</div>`}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <footer className="text-center text-sm text-muted-foreground">
        <p>Wireframe Editor with Enhanced Grid System and Layer Management</p>
      </footer>
    </div>
  );
};

export default WireframeEditorDemo;
