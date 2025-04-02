
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  useHeatmapData, 
  HeatmapFilterOptions 
} from '@/hooks/analytics/use-heatmap-data';
import { DateRange } from "react-day-picker";
import { format } from 'date-fns';
import HeatmapCanvas from './heatmap/HeatmapCanvas';
import TimelineView from './heatmap/TimelineView';
import GeographicMapPlaceholder from './heatmap/GeographicMapPlaceholder';
import HeatmapHeader from './heatmap/HeatmapHeader';

const HeatmapDisplay = () => {
  const { user } = useAuth();
  const [displayMode, setDisplayMode] = useState<'clicks' | 'hover' | 'scrolls' | 'movements' | 'attention'>('clicks');
  const [viewType, setViewType] = useState<'heatmap' | 'map' | 'timeline'>('heatmap');
  const [dateRange, setDateRange] = useState<DateRange>({
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
  
  const applyFilters = () => {
    fetchHeatmapData({
      ...filters,
      startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      pageUrl: selectedPage
    });
  };
  
  const resetFilters = () => {
    setFilters({
      deviceType: 'all',
      sessionId: undefined,
      aggregationType: 'density'
    });
    setDateRange({ from: undefined, to: undefined });
    fetchHeatmapData({ pageUrl: selectedPage });
  };

  return (
    <div className="space-y-4">
      <HeatmapHeader 
        isLoading={isLoading}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        filters={filters}
        setFilters={setFilters}
        dateRange={dateRange}
        setDateRange={setDateRange}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
      
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
          
          <HeatmapCanvas 
            isLoading={isLoading}
            displayMode={displayMode}
            heatmapData={heatmapData}
            viewType={viewType}
          />
          
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
            <TimelineView timelineData={heatmapData.movements} />
          )}
        </TabsContent>
        
        <TabsContent value="map">
          <Alert className="mb-4">
            <AlertDescription>
              <span className="font-medium">Note:</span> Geographic location tracking is not yet active. 
              This is a placeholder for the upcoming map feature.
            </AlertDescription>
          </Alert>
          <GeographicMapPlaceholder />
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
