
import React from 'react';
import { PhraseHeatmapItem } from '@/hooks/ai-memory/useMemoryAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartBar, Loader2, AlertCircle, Grid3x3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PromptHeatmapProps {
  data: PhraseHeatmapItem[];
  isLoading: boolean;
  error: Error | null;
}

export function PromptHeatmap({ data, isLoading, error }: PromptHeatmapProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Analyzing prompt patterns...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load prompt heatmap data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          No prompt heatmap data is available. Try changing your filters or adding more prompts.
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare chart data - top phrases by impact
  const chartData = data
    .slice(0, 10)
    .map(item => ({
      phrase: item.phrase.length > 15 ? item.phrase.substring(0, 15) + '...' : item.phrase,
      impact: parseFloat(item.impact.toFixed(2)),
      count: item.count,
      outcome: parseFloat(item.outcome.toFixed(2))
    }));

  // Generate color gradient based on impact
  const getBarColor = (impact: number) => {
    // Color gradient from blue (low) to purple (medium) to red (high)
    if (impact < 0.3) return '#3b82f6'; // blue
    if (impact < 0.6) return '#8b5cf6'; // purple
    return '#ef4444'; // red
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <ChartBar className="h-5 w-5 mr-2" />
                Phrase Impact Chart
              </CardTitle>
            </div>
            <CardDescription>
              Impact of key phrases on outcomes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 'auto']} />
                  <YAxis 
                    type="category" 
                    dataKey="phrase" 
                    width={150}
                    tick={{ fontSize: 12 }} 
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} (Count: ${props.payload.count})`,
                      name === 'impact' ? 'Impact Score' : name
                    ]}
                  />
                  <Bar dataKey="impact" name="Impact Score">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.impact)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Grid3x3 className="h-5 w-5 mr-2" />
                Phrase Details
              </CardTitle>
            </div>
            <CardDescription>
              Key phrases with highest impact
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[350px]">
              <div className="space-y-4">
                {data.slice(0, 15).map((item, i) => (
                  <div key={i} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm">{item.phrase}</h5>
                      <Badge 
                        variant={item.impact > 0.5 ? "default" : "secondary"}
                        style={{ backgroundColor: getBarColor(item.impact) }}
                      >
                        Impact: {item.impact.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Occurrences: {item.count}
                      </span>
                      <span className="text-muted-foreground">
                        Outcome: {item.outcome.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
