
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { useFabric } from '@/hooks/fabric/use-fabric';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Download, Undo, Redo, ZoomIn, ZoomOut, Grid3X3, PinOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderWireframeToCanvas } from '../utils/wireframe-renderer';
import { TooltipProvider } from '@/components/ui/tooltip';

interface EnhancedWireframeCanvasProps {
  projectId: string;
  readOnly?: boolean;
  onSave?: (data: any) => void;
  initialData?: WireframeData | null;
  className?: string;
}

const EnhancedWireframeCanvas: React.FC<EnhancedWireframeCanvasProps> = ({
  projectId,
  readOnly = false,
  onSave,
  initialData,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  
  const {
    fabricCanvas,
    canvasConfig,
    initializeCanvas,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    toggleSnapToGrid,
    updateConfig
  } = useFabric({
    persistConfig: false,
    initialConfig: {
      width: 1200,
      height: 2000,
      showGrid: true,
      snapToGrid: true,
      backgroundColor: '#ffffff'
    }
  });
  
  // Initialize canvas on component mount
  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      initializeCanvas(canvasRef.current);
      setIsLoading(false);
    }
  }, [canvasRef, fabricCanvas, initializeCanvas]);
  
  // Render wireframe data to canvas when available
  useEffect(() => {
    if (!fabricCanvas || !initialData) return;
    
    try {
      setIsLoading(true);
      renderWireframeToCanvas(fabricCanvas, initialData, {
        readOnly,
        showGrid: canvasConfig.showGrid,
        gridSize: canvasConfig.gridSize
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error rendering wireframe:", error);
      toast({
        title: "Error",
        description: "Failed to render wireframe",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [fabricCanvas, initialData, readOnly, canvasConfig.showGrid, canvasConfig.gridSize, toast]);
  
  // Handle canvas data saving
  const handleSave = async () => {
    if (!fabricCanvas) return;
    
    try {
      setIsSaving(true);
      
      // Convert canvas to JSON data
      const canvasData = fabricCanvas.toJSON(['data', 'id', 'name', 'sectionType']);
      
      // Extract wireframe structure from canvas objects
      const wireframeData = {
        id: projectId,
        title: initialData?.title || 'Wireframe',
        description: initialData?.description || '',
        sections: fabricCanvas.getObjects()
          .filter(obj => obj.data?.type === 'section')
          .map(obj => ({
            id: obj.data?.id || obj.id,
            name: obj.data?.name || 'Section',
            sectionType: obj.data?.sectionType || 'generic',
            position: { x: obj.left || 0, y: obj.top || 0 },
            dimensions: { width: obj.width || 400, height: obj.height || 300 },
            components: []
          }))
      };
      
      if (onSave) {
        onSave(wireframeData);
      }
      
      toast({
        title: "Success",
        description: "Wireframe saved successfully"
      });
    } catch (error) {
      console.error("Error saving canvas:", error);
      toast({
        title: "Error",
        description: "Failed to save wireframe",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Export canvas as image
  const exportAsImage = () => {
    if (!fabricCanvas) return;
    
    try {
      // Get data URL of canvas content
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 0.8
      });
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `wireframe-${projectId}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Wireframe exported as image"
      });
    } catch (error) {
      console.error("Error exporting wireframe:", error);
      toast({
        title: "Error",
        description: "Failed to export wireframe",
        variant: "destructive"
      });
    }
  };
  
  return (
    <TooltipProvider>
      <div className={cn("enhanced-wireframe-canvas", className)}>
        {!readOnly && (
          <div className="canvas-controls flex flex-wrap gap-2 mb-4">
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={zoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={zoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant={canvasConfig.showGrid ? "secondary" : "outline"} 
                onClick={toggleGrid} 
                title="Toggle Grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant={canvasConfig.snapToGrid ? "secondary" : "outline"} 
                onClick={toggleSnapToGrid} 
                title="Toggle Snap to Grid"
              >
                <PinOff className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-1 ml-auto">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => fabricCanvas?.undo?.()}
                disabled={!fabricCanvas?.canUndo}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => fabricCanvas?.redo?.()}
                disabled={!fabricCanvas?.canRedo}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={exportAsImage} title="Export as Image">
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="default" 
                onClick={handleSave} 
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
            </div>
          </div>
        )}
        
        <div className="canvas-container relative border rounded-md bg-background">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <canvas ref={canvasRef} className="w-full h-auto min-h-[600px]" />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedWireframeCanvas;
