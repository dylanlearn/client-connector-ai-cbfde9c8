
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  History, 
  Layers, 
  Maximize2, 
  Minimize2, 
  MoveHorizontal
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useWireframeRenderer } from '@/hooks/wireframe/use-wireframe-renderer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WireframeComparisonViewProps {
  wireframes: {
    id: string;
    wireframe: WireframeData;
    label?: string;
  }[];
  onSelectWireframe?: (id: string) => void;
  className?: string;
}

const WireframeComparisonView: React.FC<WireframeComparisonViewProps> = ({
  wireframes,
  onSelectWireframe,
  className
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // When a wireframe is selected
  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (onSelectWireframe) {
      onSelectWireframe(id);
    }
  };
  
  if (!wireframes || wireframes.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No wireframes available for comparison</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Compare Wireframes
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('side-by-side')}
              className={viewMode === 'side-by-side' ? 'bg-secondary' : ''}
            >
              <MoveHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('overlay')}
              className={viewMode === 'overlay' ? 'bg-secondary' : ''}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wireframes.map((item) => (
              <WireframeComparisonItem 
                key={item.id}
                wireframe={item.wireframe}
                label={item.label || `Wireframe ${item.id.substring(0, 6)}`}
                isSelected={selectedId === item.id}
                onSelect={() => handleSelect(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs defaultValue={wireframes[0].id} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                {wireframes.map((item) => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.label || `Wireframe ${item.id.substring(0, 6)}`}
                  </TabsTrigger>
                ))}
              </TabsList>
              {wireframes.map((item) => (
                <TabsContent key={item.id} value={item.id}>
                  <WireframeComparisonItem 
                    wireframe={item.wireframe}
                    label={item.label || `Wireframe ${item.id.substring(0, 6)}`}
                    isSelected={selectedId === item.id}
                    onSelect={() => handleSelect(item.id)}
                    expanded
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {wireframes.length} wireframes available
        </div>
        {selectedId && (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => handleSelect(selectedId)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Select This Wireframe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Sub-component for each wireframe in the comparison
const WireframeComparisonItem: React.FC<{
  wireframe: WireframeData;
  label: string;
  isSelected?: boolean;
  onSelect: () => void;
  expanded?: boolean;
}> = ({ wireframe, label, isSelected, onSelect, expanded = false }) => {
  const [isFullsize, setIsFullsize] = useState(false);
  
  const { canvas, canvasRef, initializeCanvas, renderWireframe } = useWireframeRenderer({
    deviceType: 'desktop',
    darkMode: false,
    interactive: false,
    canvasConfig: {
      width: expanded ? 1000 : 600,
      height: expanded ? 800 : 500,
      zoom: expanded ? 0.8 : 0.5
    }
  });
  
  React.useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = initializeCanvas(canvasRef.current);
      if (fabricCanvas) {
        renderWireframe(wireframe, fabricCanvas);
      }
    }
  }, [wireframe, canvasRef, initializeCanvas, renderWireframe]);
  
  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden transition-all relative",
        isSelected ? "ring-2 ring-primary" : "",
        isFullsize ? "fixed inset-0 z-50 bg-background" : ""
      )}
    >
      <div className="flex justify-between items-center p-2 bg-muted/50">
        <div className="flex items-center gap-2">
          <Badge variant={isSelected ? "default" : "outline"} className="text-xs">
            {label}
          </Badge>
          {wireframe.sections && (
            <span className="text-xs text-muted-foreground">
              {wireframe.sections.length} sections
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsFullsize(!isFullsize)}
        >
          {isFullsize ? 
            <Minimize2 className="h-4 w-4" /> : 
            <Maximize2 className="h-4 w-4" />
          }
        </Button>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="relative">
          <canvas ref={canvasRef} />
          {!isFullsize && (
            <div
              className="absolute inset-0 bg-transparent cursor-pointer"
              onClick={onSelect}
            />
          )}
        </div>
      </ScrollArea>
      
      <div className="p-2 bg-muted/30">
        <Button 
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={onSelect}
        >
          {isSelected ? "Selected" : "Select This Version"}
        </Button>
      </div>
    </div>
  );
};

export default WireframeComparisonView;
