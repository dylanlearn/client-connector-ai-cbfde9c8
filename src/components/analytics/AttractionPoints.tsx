
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useHeatmapData } from '@/hooks/analytics/use-heatmap-data';
import { Eye, Pointer, BarChart2 } from 'lucide-react';

const AttractionPoints = () => {
  const { user } = useAuth();
  const { heatmapData, isLoading } = useHeatmapData(user?.id);
  const [filter, setFilter] = useState<'all' | 'clicks' | 'hover'>('all');
  
  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="h-4 bg-muted rounded w-4/5"></div>
      </div>
    );
  }
  
  // Get top elements by interaction count
  const getTopElements = () => {
    // Combine all data points
    const allPoints = [
      ...heatmapData.clicks,
      ...heatmapData.hover
    ];
    
    // Count by element
    const elementCounts: Record<string, { count: number, type: 'click' | 'hover' | 'both' }> = {};
    
    allPoints.forEach(point => {
      if (!point.element) return;
      
      const isClick = heatmapData.clicks.some(
        click => click.x === point.x && click.y === point.y
      );
      
      const isHover = heatmapData.hover.some(
        hover => hover.x === point.x && hover.y === point.y
      );
      
      if (!elementCounts[point.element]) {
        elementCounts[point.element] = {
          count: 0,
          type: 'both'
        };
      }
      
      if (isClick && isHover) {
        elementCounts[point.element].type = 'both';
      } else if (isClick) {
        elementCounts[point.element].type = 'click';
      } else if (isHover) {
        elementCounts[point.element].type = 'hover';
      }
      
      elementCounts[point.element].count += point.value;
    });
    
    // Filter by selected type
    const filtered = Object.entries(elementCounts)
      .filter(([_, data]) => {
        if (filter === 'all') return true;
        return data.type === filter || data.type === 'both';
      })
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);
    
    return filtered;
  };
  
  const topElements = getTopElements();
  
  if (topElements.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <BarChart2 className="h-10 w-10 mx-auto mb-2 text-muted" />
        <p>No element interaction data available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Top Elements</div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`text-xs px-2 py-1 rounded-md ${filter === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('clicks')}
            className={`text-xs px-2 py-1 rounded-md ${filter === 'clicks' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          >
            Clicks
          </button>
          <button 
            onClick={() => setFilter('hover')}
            className={`text-xs px-2 py-1 rounded-md ${filter === 'hover' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          >
            Hover
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {topElements.map(([element, data]) => (
          <li key={element} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {data.type === 'click' || data.type === 'both' ? (
                <Pointer className="h-4 w-4 text-red-500" />
              ) : (
                <Eye className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm font-mono">{element}</span>
            </div>
            <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
              {data.count} interactions
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttractionPoints;
