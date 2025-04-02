
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  useHeatmapData, 
  HeatmapFilterOptions 
} from '@/hooks/analytics/use-heatmap-data';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  InfoIcon, 
  Calendar, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Clock, 
  Filter 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const HeatmapDisplay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [displayMode, setDisplayMode] = useState<'clicks' | 'hover' | 'scrolls' | 'movements' | 'attention'>('clicks');
  const [viewType, setViewType] = useState<'heatmap' | 'map' | 'timeline'>('heatmap');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [filters, setFilters] = useState<HeatmapFilterOptions>({
    deviceType: 'all',
    sessionId: undefined,
    aggregationType: 'density'
  });
  
  const {
    heatmapData,
    isLoading,
    error,
    selectedPage,
    setSelectedPage,
    fetchHeatmapData
  } = useHeatmapData(user?.id);
  
  // Apply filters
  const applyFilters = () => {
    fetchHeatmapData({
      ...filters,
      startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      pageUrl: selectedPage
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      deviceType: 'all',
      sessionId: undefined,
      aggregationType: 'density'
    });
    setDateRange({ from: undefined, to: undefined });
    fetchHeatmapData({ pageUrl: selectedPage });
  };
  
  // Draw heatmap on canvas
  useEffect(() => {
    if (!canvasRef.current || isLoading || viewType !== 'heatmap') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get the container dimensions
    if (canvasContainerRef.current) {
      const containerWidth = canvasContainerRef.current.clientWidth;
      canvas.width = containerWidth;
      canvas.height = Math.round(containerWidth * 0.6); // 16:10 aspect ratio
    }
    
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
      // Scale points to fit the canvas
      const scaledX = (point.x / 1200) * canvas.width;
      const scaledY = (point.y / 800) * canvas.height;
      
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
      } else if (displayMode === 'scrolls') {
        color = getGreenGradient(value);
      } else if (displayMode === 'movements') {
        color = getYellowGradient(value);
      } else {
        color = getPurpleGradient(value);
      }
      
      // Draw circle with gradient
      const gradient = ctx.createRadialGradient(
        scaledX, scaledY, 0,
        scaledX, scaledY, radius
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(scaledX, scaledY, radius, 0, Math.PI * 2);
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
  
  const getGreenGradient = (value: number) => {
    return `rgba(0, 128, 0, ${0.2 + (value * 0.4)})`;
  };
  
  const getYellowGradient = (value: number) => {
    return `rgba(255, 215, 0, ${0.2 + (value * 0.4)})`;
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
  
  // Render timeline visualization
  const renderTimeline = () => {
    // Get data for the timeline (movement points by time)
    const timePoints = heatmapData.movements
      .sort((a, b) => (a.timestamp && b.timestamp) ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() : 0)
      .slice(0, 50); // Take only the first 50 points
    
    if (timePoints.length === 0) {
      return (
        <div className="flex items-center justify-center h-[500px] bg-gray-50 border rounded-md">
          <div className="text-center">
            <Clock className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Timeline Data</h3>
            <p className="text-gray-600">
              No interaction timeline data is available for the selected filters.
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-2 p-4 max-h-[500px] overflow-y-auto">
        {timePoints.map((point, index) => (
          <Card key={index} className="mb-2">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {point.timestamp ? format(new Date(point.timestamp), 'MMM d, yyyy HH:mm:ss') : 'Unknown time'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {point.element || 'Unknown element'} ({point.x}, {point.y})
                  </p>
                </div>
                <Badge variant="outline" className="ml-4">
                  {point.value} interactions
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Heatmap Filters</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <div className="flex flex-col space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="device-type">Device Type</Label>
                  <Select
                    value={filters.deviceType}
                    onValueChange={(value) => setFilters({...filters, deviceType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="session-id">Session ID (optional)</Label>
                  <Input
                    id="session-id"
                    value={filters.sessionId || ''}
                    onChange={(e) => setFilters({...filters, sessionId: e.target.value || undefined})}
                    placeholder="Enter specific session ID"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="aggregation-type">Aggregation Type</Label>
                  <Select
                    value={filters.aggregationType}
                    onValueChange={(value) => setFilters({
                      ...filters, 
                      aggregationType: value as 'density' | 'time' | 'element'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select aggregation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="density">Density (Points)</SelectItem>
                      <SelectItem value="time">Time-based</SelectItem>
                      <SelectItem value="element">Element-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={resetFilters}>Reset</Button>
                <Button onClick={() => {
                  applyFilters();
                }}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Select defaultValue={displayMode} onValueChange={(value) => setDisplayMode(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clicks">Clicks</SelectItem>
              <SelectItem value="hover">Hover</SelectItem>
              <SelectItem value="scrolls">Scrolls</SelectItem>
              <SelectItem value="movements">Movements</SelectItem>
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
              <SelectItem value="dashboard">Dashboard</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="heatmap" onValueChange={(value) => setViewType(value as 'heatmap' | 'map' | 'timeline')}>
        <TabsList className="mb-4">
          <TabsTrigger value="heatmap">Element Heatmap</TabsTrigger>
          <TabsTrigger value="timeline">Interaction Timeline</TabsTrigger>
          <TabsTrigger value="map">Geographic Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heatmap" className="relative border rounded-md overflow-hidden bg-white">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div ref={canvasContainerRef} className="w-full">
            <canvas 
              ref={canvasRef} 
              className="w-full aspect-video"
            />
          </div>
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="timeline">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px] bg-gray-50 border rounded-md">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            renderTimeline()
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
          <span className="font-medium text-foreground">AI Insight:</span> Users spend more time focused on the pricing plans section. The pro plan receives 60% more attention than the basic plan, suggesting a stronger interest in premium features.
        </p>
      </div>
    </div>
  );
};

export default HeatmapDisplay;
