
import { format } from 'date-fns';
import { HeatmapDataPoint } from '@/types/analytics';
import { Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineViewProps {
  timelineData: HeatmapDataPoint[];
}

const TimelineView = ({ timelineData }: TimelineViewProps) => {
  const timePoints = timelineData
    .sort((a, b) => (a.timestamp && b.timestamp) 
      ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() 
      : 0)
    .slice(0, 50);

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

export default TimelineView;
