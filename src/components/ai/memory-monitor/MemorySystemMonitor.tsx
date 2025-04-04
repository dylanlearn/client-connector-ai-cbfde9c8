
import React, { useState, useEffect } from 'react';
import { VectorMemoryService } from '@/services/ai/memory/vector-memory-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MemoryStat {
  memory_type: string;
  memory_count: number;
  oldest_memory?: string;
  newest_memory?: string;
  avg_clusters_per_memory?: number;
}

export const MemorySystemMonitor: React.FC = () => {
  const [stats, setStats] = useState<MemoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const memoryStats = await VectorMemoryService.getMemorySystemStats();
        setStats(memoryStats || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching memory stats:", err);
        setError("Failed to load memory system statistics");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    
    // Refresh stats every 60 seconds
    const intervalId = setInterval(fetchStats, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Prepare data for charts
  const chartData = stats.map(stat => ({
    name: stat.memory_type,
    count: stat.memory_count,
    clusters: stat.avg_clusters_per_memory || 0,
  }));
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Memory System Monitor
          {isLoading && <Badge variant="outline">Updating...</Badge>}
        </CardTitle>
        <CardDescription>Real-time monitoring of memory system performance</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {stats.map((stat) => (
                  <Card key={stat.memory_type}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{stat.memory_type} Memories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.memory_count}</div>
                      {stat.newest_memory && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Last updated: {new Date(stat.newest_memory).toLocaleString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="charts">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      name="Memory Count" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clusters" 
                      stroke="#82ca9d" 
                      name="Avg Clusters" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="mt-4 space-y-4">
                {stats.map((stat) => (
                  <div key={stat.memory_type} className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg">{stat.memory_type} Memory Details</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="text-sm font-medium">Total Count</div>
                        <div>{stat.memory_count}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Avg Clusters</div>
                        <div>{stat.avg_clusters_per_memory?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Oldest Memory</div>
                        <div>{stat.oldest_memory ? new Date(stat.oldest_memory).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Newest Memory</div>
                        <div>{stat.newest_memory ? new Date(stat.newest_memory).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
