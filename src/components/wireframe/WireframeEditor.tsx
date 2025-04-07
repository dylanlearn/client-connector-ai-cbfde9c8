
import React, { useEffect } from 'react';
import { useWireframeStore } from '@/stores/wireframe-store';
import WireframeCanvas from './WireframeCanvas';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Grid, 
  LayoutGrid, 
  Moon, 
  Sun, 
  Edit, 
  Eye,
  Undo2, 
  Redo2, 
  Copy, 
  Download, 
  Plus,
  PanelLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface WireframeEditorProps {
  projectId?: string;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ projectId }) => {
  const { toast } = useToast();
  const wireframe = useWireframeStore((state) => state.wireframe);
  const activeDevice = useWireframeStore((state) => state.activeDevice);
  const setActiveDevice = useWireframeStore((state) => state.setActiveDevice);
  const showGrid = useWireframeStore((state) => state.showGrid);
  const toggleShowGrid = useWireframeStore((state) => state.toggleShowGrid);
  const highlightSections = useWireframeStore((state) => state.highlightSections);
  const toggleHighlightSections = useWireframeStore((state) => state.toggleHighlightSections);
  const darkMode = useWireframeStore((state) => state.darkMode);
  const toggleDarkMode = useWireframeStore((state) => state.toggleDarkMode);
  const editMode = useWireframeStore((state) => state.editMode);
  const toggleEditMode = useWireframeStore((state) => state.toggleEditMode);
  const undo = useWireframeStore((state) => state.undo);
  const redo = useWireframeStore((state) => state.redo);
  const history = useWireframeStore((state) => state.history);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(wireframe, null, 2));
    toast({
      title: "Copied to clipboard",
      description: "Wireframe JSON has been copied to your clipboard."
    });
  };
  
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify(wireframe, null, 2)
    );
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `wireframe-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Download started",
      description: "Your wireframe JSON file is being downloaded."
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Wireframe Editor</CardTitle>
          <CardDescription>Create and customize your wireframe</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="sections">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sections">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Page Sections</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Section
                  </Button>
                </div>
                
                <div className="border rounded-md p-4 text-center text-muted-foreground text-sm">
                  Component library will be populated here.
                  <Button variant="secondary" size="sm" className="mt-2">
                    <PanelLeft className="mr-1 h-4 w-4" /> Open Library
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="style">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Design Style</h3>
                <div className="border rounded-md p-4 text-center text-muted-foreground text-sm">
                  Style controls will be populated here.
                </div>
                
                <div className="pt-4 flex items-center space-x-2">
                  <Switch 
                    id="darkMode" 
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                  <Label htmlFor="darkMode" className="text-sm">
                    Dark Mode
                  </Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Editor Settings</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showGrid" className="text-sm">Show Grid</Label>
                    <Switch 
                      id="showGrid" 
                      checked={showGrid}
                      onCheckedChange={toggleShowGrid}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlightSections" className="text-sm">Highlight Sections</Label>
                    <Switch 
                      id="highlightSections" 
                      checked={highlightSections}
                      onCheckedChange={toggleHighlightSections}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="lg:col-span-8">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-3">
          <div>
            <CardTitle>
              {wireframe?.title || "Wireframe Preview"}
            </CardTitle>
            <CardDescription>
              {wireframe?.description || "Preview of your wireframe design"}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleEditMode}
              className="flex gap-1 items-center"
            >
              {editMode ? (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
            
            <div className="flex border rounded-md">
              <Button 
                variant={activeDevice === "desktop" ? "secondary" : "ghost"}
                size="sm" 
                onClick={() => setActiveDevice("desktop")}
                className="rounded-r-none px-2"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeDevice === "tablet" ? "secondary" : "ghost"}
                size="sm" 
                onClick={() => setActiveDevice("tablet")}
                className="rounded-none px-2 border-x"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeDevice === "mobile" ? "secondary" : "ghost"}
                size="sm" 
                onClick={() => setActiveDevice("mobile")}
                className="rounded-l-none px-2"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={showGrid ? "secondary" : "ghost"}
                size="sm" 
                onClick={toggleShowGrid}
                className="rounded-r-none px-2"
                title="Show Grid"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={highlightSections ? "secondary" : "ghost"}
                size="sm" 
                onClick={toggleHighlightSections}
                className="rounded-l-none px-2 border-l"
                title="Highlight Sections"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <WireframeCanvas 
            projectId={projectId} 
            className="min-h-[500px]"
          />
        </CardContent>
        
        <div className="flex justify-between px-6 pb-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={undo}
              disabled={history.past.length === 0}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={redo}
              disabled={history.future.length === 0}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyJSON}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WireframeEditor;
