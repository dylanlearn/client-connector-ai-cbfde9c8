
import React from 'react';
import { SimilarityTrend } from '@/hooks/ai-memory/useMemoryAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartPie, Loader2, AlertCircle, TrendingUp, Layers } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface EmbeddingSimilarityTrendsProps {
  data: SimilarityTrend[];
  isLoading: boolean;
  error: Error | null;
}

export function EmbeddingSimilarityTrends({ data, isLoading, error }: EmbeddingSimilarityTrendsProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Analyzing similarity trends...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load similarity trends: {error.message}
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
          No similarity trend data is available. Try changing your filters or adding more memories.
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare data for visualization
  const pieChartData = data.map(segment => ({
    name: segment.segment,
    value: segment.count,
    avgSimilarity: Math.round(segment.average_similarity * 100) / 100
  }));

  // Generate a color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a75cff', '#ff5cab'];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <ChartPie className="h-5 w-5 mr-2" />
                Memory Segments
              </CardTitle>
            </div>
            <CardDescription>
              Distribution of memories across segments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `Count: ${value}, Similarity: ${props.payload.avgSimilarity}`,
                      name
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Memory Clusters
              </CardTitle>
            </div>
            <CardDescription>
              Top clusters and their similarity scores
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[300px]">
              {data.map((segment, i) => (
                <div key={i} className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></span>
                      {segment.segment} ({segment.count} memories)
                    </h4>
                    <Badge variant="outline">
                      Avg Similarity: {(segment.average_similarity * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {segment.clusters.slice(0, 3).map((cluster, j) => (
                      <div key={j} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{cluster.cluster_name}</h5>
                          <Badge variant={cluster.similarity > 0.7 ? "default" : "secondary"}>
                            {(cluster.similarity * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {cluster.top_terms.map((term, k) => (
                            <Badge key={k} variant="outline" className="bg-muted/50">
                              {term.term} ({term.count})
                            </Badge>
                          ))}
                        </div>
                        
                        {cluster.examples.length > 0 && (
                          <div className="text-sm text-muted-foreground mt-2">
                            <p className="truncate">{cluster.examples[0].content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
