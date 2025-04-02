
import { useAuth } from '@/hooks/use-auth';
import { useHeatmapData } from '@/hooks/analytics/use-heatmap-data';
import { MousePointerClick, MousePointer, Eye } from 'lucide-react';

const InteractionMetrics = () => {
  const { user } = useAuth();
  const { heatmapData, isLoading } = useHeatmapData(user?.id);
  
  // Calculate metrics from heatmap data
  const calculateMetrics = () => {
    return {
      totalClicks: heatmapData.clicks.reduce((sum, point) => sum + point.value, 0),
      totalHovers: heatmapData.hover.reduce((sum, point) => sum + point.value, 0),
      attentionHotspots: heatmapData.attention
        .filter(point => point.value > (heatmapData.attention[0]?.value / 2 || 0))
        .length,
      engagementScore: calculateEngagementScore(),
    };
  };
  
  // Calculate a simulated engagement score based on interaction data
  const calculateEngagementScore = () => {
    const clickWeight = 1.5;
    const hoverWeight = 0.7;
    
    const clickValue = heatmapData.clicks.reduce((sum, point) => sum + point.value, 0) * clickWeight;
    const hoverValue = heatmapData.hover.reduce((sum, point) => sum + point.value, 0) * hoverWeight;
    
    const total = clickValue + hoverValue;
    
    // Scale to 0-100
    const scaled = Math.min(100, Math.floor(total / 10));
    
    return scaled;
  };
  
  const metrics = calculateMetrics();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 animate-pulse">
        <div className="h-16 bg-muted rounded"></div>
        <div className="h-16 bg-muted rounded"></div>
        <div className="h-16 bg-muted rounded"></div>
        <div className="h-16 bg-muted rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
        <MousePointerClick className="h-4 w-4 text-primary mb-1" />
        <div className="text-2xl font-bold">{metrics.totalClicks}</div>
        <div className="text-xs text-muted-foreground">Total Clicks</div>
      </div>
      
      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
        <MousePointer className="h-4 w-4 text-primary mb-1" />
        <div className="text-2xl font-bold">{metrics.totalHovers}</div>
        <div className="text-xs text-muted-foreground">Hover Events</div>
      </div>
      
      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
        <Eye className="h-4 w-4 text-primary mb-1" />
        <div className="text-2xl font-bold">{metrics.attentionHotspots}</div>
        <div className="text-xs text-muted-foreground">Attention Hotspots</div>
      </div>
      
      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
        <div className="relative w-full h-2 bg-muted rounded mb-2">
          <div 
            className="absolute left-0 top-0 h-full bg-primary rounded"
            style={{ width: `${metrics.engagementScore}%` }}
          ></div>
        </div>
        <div className="text-2xl font-bold">{metrics.engagementScore}</div>
        <div className="text-xs text-muted-foreground">Engagement Score</div>
      </div>
    </div>
  );
};

export default InteractionMetrics;
