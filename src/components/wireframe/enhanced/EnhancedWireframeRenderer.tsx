
import React, { useState, useRef, useEffect } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useWireframeRenderer } from '@/hooks/wireframe/use-wireframe-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2,
  Smartphone, 
  Tablet, 
  Monitor, 
  Grid, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WireframeFeedbackControls from '../feedback/WireframeFeedbackControls';

interface EnhancedWireframeRendererProps {
  wireframe: WireframeData | null;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  darkMode?: boolean;
  onSectionClick?: (sectionId: string) => void;
  className?: string;
  showControls?: boolean;
  showFeedback?: boolean;
  height?: string | number;
}

const EnhancedWireframeRenderer: React.FC<EnhancedWireframeRendererProps> = ({
  wireframe,
  deviceType = 'desktop',
  darkMode = false,
  onSectionClick,
  className,
  showControls = true,
  showFeedback = false,
  height = 600
}) => {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [activeDeviceType, setActiveDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>(deviceType);
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  
  // Configure canvas dimensions based on device type
  const getCanvasConfig = () => {
    switch (activeDeviceType) {
      case 'mobile':
        return { width: 375, height: 667, zoom: 0.8 };
      case 'tablet':
        return { width: 768, height: 1024, zoom: 0.7 };
      default:
        return { width: 1200, height: 800, zoom: 0.6 };
    }
  };
  
  const { 
    canvas, 
    canvasRef, 
    initializeCanvas, 
    renderWireframe,
    isRendering
  } = useWireframeRenderer({
    deviceType: activeDeviceType,
    darkMode,
    interactive: true,
    canvasConfig: getCanvasConfig(),
    onSectionClick
  });
  
  // Initialize canvas when loaded
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = initializeCanvas(canvasRef.current);
      if (fabricCanvas && wireframe) {
        renderWireframe(wireframe, fabricCanvas, {
          deviceType: activeDeviceType,
          darkMode,
          renderGrid: showGrid
        });
      }
    }
  }, [canvasRef, initializeCanvas, renderWireframe, wireframe, activeDeviceType, darkMode, showGrid]);

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    if (canvas && wireframe) {
      setHiddenSections(prev => {
        const isHidden = prev.includes(sectionId);
        const newHiddenSections = isHidden
          ? prev.filter(id => id !== sectionId)
          : [...prev, sectionId];
        
        // Re-render with the updated visibility
        setTimeout(() => {
          if (canvas) {
            // Find all objects with the section ID and toggle their visibility
            canvas.getObjects().forEach(obj => {
              if (obj.data?.id === sectionId) {
                obj.visible = !newHiddenSections.includes(sectionId);
              }
            });
            canvas.requestRenderAll();
          }
        }, 0);
        
        return newHiddenSections;
      });
    }
  };
  
  // Change device type
  const handleDeviceChange = (newDeviceType: 'desktop' | 'tablet' | 'mobile') => {
    setActiveDeviceType(newDeviceType);
  };
  
  return (
    <div 
      className={cn(
        "enhanced-wireframe-renderer relative bg-card border rounded-lg overflow-hidden",
        fullscreen && "fixed inset-0 z-50",
        className
      )}
      style={{ height: fullscreen ? '100vh' : height }}
    >
      {showControls && (
        <div className="wireframe-controls border-b bg-card/80 backdrop-blur-sm p-2 flex items-center justify-between gap-2 sticky top-0 z-10">
          <div className="device-controls flex items-center gap-2">
            <Button
              variant={activeDeviceType === 'desktop' ? "default" : "outline"}
              size="sm"
              onClick={() => handleDeviceChange('desktop')}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={activeDeviceType === 'tablet' ? "default" : "outline"}
              size="sm"
              onClick={() => handleDeviceChange('tablet')}
              title="Tablet view"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={activeDeviceType === 'mobile' ? "default" : "outline"}
              size="sm"
              onClick={() => handleDeviceChange('mobile')}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="display-controls flex items-center gap-2">
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              title={showGrid ? "Hide grid" : "Show grid"}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFullscreen(!fullscreen)}
              title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
      
      <div className="wireframe-view flex h-full">
        {wireframe && wireframe.sections && wireframe.sections.length > 0 && (
          <div className="section-controls w-64 border-r bg-card/50 p-2 overflow-auto hidden lg:block">
            <h3 className="font-medium mb-2 text-sm">Wireframe Sections</h3>
            <ScrollArea className="h-[calc(100%-3rem)]">
              <div className="space-y-1">
                {wireframe.sections.map((section: WireframeSection) => (
                  <div 
                    key={section.id} 
                    className="flex items-center justify-between p-2 text-sm rounded hover:bg-accent/30 cursor-pointer"
                    onClick={() => onSectionClick && onSectionClick(section.id)}
                  >
                    <span className="truncate">{section.name || section.sectionType}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionVisibility(section.id);
                      }}
                    >
                      {hiddenSections.includes(section.id) ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        <div 
          ref={canvasParentRef} 
          className="canvas-container flex-1 overflow-auto relative flex items-center justify-center p-4"
        >
          {isRendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="loader">Loading...</div>
            </div>
          )}
          
          <div className={cn(
            "canvas-wrapper mx-auto",
            activeDeviceType === 'mobile' && 'max-w-[375px]',
            activeDeviceType === 'tablet' && 'max-w-[768px]'
          )}>
            <canvas 
              ref={canvasRef} 
              className="mx-auto border border-dashed border-muted-foreground/30"
            />
          </div>
        </div>
      </div>
      
      {showFeedback && wireframe && (
        <div className="wireframe-feedback border-t p-2">
          <WireframeFeedbackControls 
            wireframeId={wireframe.id} 
            compact 
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedWireframeRenderer;
