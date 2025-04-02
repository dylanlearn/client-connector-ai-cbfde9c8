
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHeatmapData } from '@/hooks/analytics/use-heatmap-data';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const HeatmapDisplay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const [displayMode, setDisplayMode] = useState<'clicks' | 'hover' | 'attention'>('clicks');
  const [viewType, setViewType] = useState<'heatmap' | 'map'>('heatmap');
  
  const {
    heatmapData,
    isLoading,
    selectedPage,
    setSelectedPage
  } = useHeatmapData(user?.id);
  
  // Draw heatmap on canvas
  useEffect(() => {
    if (!canvasRef.current || isLoading || viewType !== 'heatmap') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get data points for current display mode
    const dataPoints = heatmapData[displayMode];
    if (!dataPoints || dataPoints.length === 0) {
      drawEmptyState(ctx, canvas);
      return;
    }
    
    // Find maximum value for normalization
    const maxValue = Math.max(...dataPoints.map(p => p.value));
    
    // Draw each data point
    dataPoints.forEach(point => {
      // Normalize value between 0 and 1
      const value = Math.min(1, point.value / maxValue);
      
      // Radius based on value (min 10, max 50)
      const radius = 10 + (value * 40);
      
      // Gradient color based on display mode
      let color;
      if (displayMode === 'clicks') {
        color = getRedGradient(value);
      } else if (displayMode === 'hover') {
        color = getBlueGradient(value);
      } else {
        color = getPurpleGradient(value);
      }
      
      // Draw circle with gradient
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
  }, [heatmapData, displayMode, isLoading, viewType]);
  
  // Helpers for color gradients
  const getRedGradient = (value: number) => {
    return `rgba(255, 0, 0, ${0.3 + (value * 0.5)})`;
  };
  
  const getBlueGradient = (value: number) => {
    return `rgba(0, 0, 255, ${0.2 + (value * 0.4)})`;
  };
  
  const getPurpleGradient = (value: number) => {
    return `rgba(128, 0, 128, ${0.2 + (value * 0.5)})`;
  };
  
  // Draw empty state message
  const drawEmptyState = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText('No interaction data available for this view', canvas.width / 2, canvas.height / 2);
    ctx.font = '14px Arial';
    ctx.fillText('Interact with your application to collect data', canvas.width / 2, canvas.height / 2 + 30);
  };
  
  // Placeholder for future map implementation
  const renderMapPlaceholder = () => {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-50 border rounded-md">
        <div className="text-center max-w-md p-6">
          <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full mb-4">
            <InfoIcon className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Geographic Map Coming Soon</h3>
          <p className="text-gray-600 mb-3">
            This feature will display user interactions on a geographic map when fully implemented.
          </p>
          <p className="text-sm text-gray-500">
            Location data collection is not yet active. When implemented, you'll be able to view interaction 
            patterns based on user location.
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            AI-Enhanced
          </Badge>
          <span className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : 'Updated just now'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select defaultValue={displayMode} onValueChange={(value) => setDisplayMode(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clicks">Clicks</SelectItem>
              <SelectItem value="hover">Hover</SelectItem>
              <SelectItem value="attention">Attention</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homepage">Homepage</SelectItem>
              <SelectItem value="about">About Us</SelectItem>
              <SelectItem value="pricing">Pricing</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="heatmap" onValueChange={(value) => setViewType(value as 'heatmap' | 'map')}>
        <TabsList className="mb-4">
          <TabsTrigger value="heatmap">Element Heatmap</TabsTrigger>
          <TabsTrigger value="map">Geographic Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heatmap" className="relative border rounded-md overflow-hidden bg-white">
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className="w-full aspect-video"
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="map">
          <Alert className="mb-4">
            <AlertDescription>
              <span className="font-medium">Note:</span> Geographic location tracking is not yet active. 
              This is a placeholder for the upcoming map feature.
            </AlertDescription>
          </Alert>
          {renderMapPlaceholder()}
        </TabsContent>
      </Tabs>
      
      <div className="text-sm mt-2">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">AI Insight:</span> Users spend more time focused on the top sections of your content. Consider placing your most important call-to-action elements in these high-attention areas.
        </p>
      </div>
    </div>
  );
};

export default HeatmapDisplay;
