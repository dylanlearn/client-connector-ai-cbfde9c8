
import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Moon, 
  Sun, 
  Eye, 
  Code, 
  Download,
  RefreshCw,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { DeviceType, DEVICE_DIMENSIONS } from './DeviceInfo';
import PreviewDisplay from './PreviewDisplay';
import WireframeExportDialog from '../export/WireframeExportDialog';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface EnhancedWireframePreviewProps {
  wireframe: WireframeData;
  onSectionClick?: (sectionId: string) => void;
  onExport?: (format: string) => void;
  className?: string;
}

const EnhancedWireframePreview: React.FC<EnhancedWireframePreviewProps> = ({
  wireframe,
  onSectionClick,
  onExport,
  className
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [scale, setScale] = useState<number>(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Get current device dimensions
  const currentDimensions = DEVICE_DIMENSIONS[deviceType];
  
  // Handle device type change
  const handleDeviceChange = (newDevice: DeviceType) => {
    setDeviceType(newDevice);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Handle export button click
  const handleExportClick = () => {
    setExportDialogOpen(true);
    
    // If onExport callback is provided, call it
    if (onExport) {
      onExport('dialog-opened');
    }
  };

  // Handle scale change
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  // Copy HTML to clipboard
  const handleCopyHtml = () => {
    // A simple representation - in a real app this would be more sophisticated
    const htmlRepresentation = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${wireframe.title || 'Wireframe Preview'}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}">
  <!-- Generated from Wireframe: ${wireframe.id} -->
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold my-4">${wireframe.title || 'Wireframe'}</h1>
    <!-- Sections would be rendered here -->
  </div>
</body>
</html>
    `.trim();

    navigator.clipboard.writeText(htmlRepresentation).then(() => {
      toast({
        title: "HTML Copied",
        description: "HTML representation copied to clipboard",
      });
    }).catch(err => {
      toast({
        title: "Copy Failed",
        description: "Could not copy HTML to clipboard",
        variant: "destructive"
      });
    });
  };
  
  // Generate screenshot using html2canvas (mock implementation)
  const takeScreenshot = () => {
    toast({
      title: "Screenshot Captured",
      description: "Screenshot functionality would be implemented here",
    });
  };

  return (
    <Card className={cn("shadow-md overflow-hidden", className)}>
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Wireframe Preview: {wireframe.title || 'Untitled'}
          </CardTitle>

          <Tabs 
            defaultValue="preview" 
            value={viewMode}
            onValueChange={(value) => setViewMode(value as 'preview' | 'code')}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>Code</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <div className="flex justify-between items-center p-2 border-b bg-muted/30">
        <Tabs 
          defaultValue="desktop" 
          value={deviceType}
          onValueChange={(value) => handleDeviceChange(value as DeviceType)}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="desktop" className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Desktop</span>
            </TabsTrigger>
            <TabsTrigger value="tablet" className="flex items-center gap-1">
              <Tablet className="h-4 w-4" />
              <span className="hidden sm:inline">Tablet</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-1">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Mobile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background rounded-md border px-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleZoomOut}
              className="h-6 w-6"
              title="Zoom out"
            >
              -
            </Button>
            <span className="text-xs w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleZoomIn}
              className="h-6 w-6"
              title="Zoom in"
            >
              +
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDarkMode}
            className="flex items-center gap-1"
          >
            {darkMode ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyHtml}>
                Copy HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={takeScreenshot}>
                Take Screenshot
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleResetZoom}>
                Reset Zoom
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportClick}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      <div 
        ref={previewContainerRef}
        className="flex justify-center p-4 bg-muted/30 min-h-[400px] overflow-auto"
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
          <TabsContent value="preview" className="mt-0">
            <PreviewDisplay
              currentDimensions={currentDimensions}
              darkMode={darkMode}
              wireframe={wireframe}
              deviceType={deviceType}
              onSectionClick={onSectionClick}
            />
          </TabsContent>
          
          <TabsContent value="code" className="mt-0 bg-background p-4 rounded-md min-w-[600px]">
            <pre className="text-sm overflow-x-auto">
              <code>
                {`<!-- Generated wireframe HTML -->
<div class="wireframe-container ${darkMode ? 'dark' : ''}">
  ${wireframe.sections.map((section, i) => `
  <!-- Section: ${section.name || section.sectionType} -->
  <section class="wireframe-section" data-section-id="${section.id}">
    <!-- Section content would be rendered here -->
  </section>
  `).join('')}
</div>`}
              </code>
            </pre>
          </TabsContent>
        </div>
      </div>
      
      <CardFooter className="flex justify-between border-t p-2 text-xs text-muted-foreground">
        <div>
          {wireframe.sections?.length || 0} sections
        </div>
        <div>
          Device: {currentDimensions.name} ({currentDimensions.width}×{currentDimensions.height})
        </div>
      </CardFooter>
      
      <WireframeExportDialog
        wireframe={wireframe}
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
    </Card>
  );
};

export default EnhancedWireframePreview;
