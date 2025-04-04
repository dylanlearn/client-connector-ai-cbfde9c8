
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVectorMemory } from '@/hooks/ai-memory/useVectorMemory';
import { Badge } from '@/components/ui/badge';

// Define proper types for memory stats
interface MemoryStat {
  memory_type: string;
  memory_count: number;
  oldest_memory?: string;
  newest_memory?: string;
  avg_clusters_per_memory?: number;
}

export function MemorySystemMonitor() {
  const { getMemoryStats } = useVectorMemory();
  const [stats, setStats] = useState<MemoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const memoryStats = await getMemoryStats();
        // Make sure we're setting data with the correct type
        if (Array.isArray(memoryStats)) {
          setStats(memoryStats as MemoryStat[]);
        } else {
          console.error('Invalid memory stats format:', memoryStats);
          setStats([]);
        }
      } catch (error) {
        console.error('Error fetching memory system stats:', error);
        setStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [getMemoryStats]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Memory System Monitor</CardTitle>
        <CardDescription>
          Monitor the status and health of the AI memory system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading memory system stats...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{stat.memory_type} Memories</h3>
                      <Badge variant={stat.memory_count > 0 ? "success" : "secondary"}>
                        {stat.memory_count > 0 ? "Active" : "Empty"}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">{stat.memory_count}</p>
                    <div className="text-sm text-muted-foreground mt-2">
                      {stat.newest_memory && (
                        <p>Last updated: {new Date(stat.newest_memory).toLocaleString()}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {["user", "project", "global"].map((type) => (
            <TabsContent key={type} value={type}>
              <Card>
                <CardContent className="pt-6">
                  {isLoading ? (
                    <div className="text-center py-4">Loading {type} memory stats...</div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium mb-4 capitalize">{type} Memory Details</h3>
                      {stats.find(s => s.memory_type === type) ? (
                        <dl className="grid grid-cols-1 gap-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Total Memories</dt>
                            <dd className="mt-1 text-lg">
                              {stats.find(s => s.memory_type === type)?.memory_count || 0}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">First Created</dt>
                            <dd className="mt-1">
                              {stats.find(s => s.memory_type === type)?.oldest_memory 
                                ? new Date(stats.find(s => s.memory_type === type)?.oldest_memory as string).toLocaleString()
                                : 'N/A'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                            <dd className="mt-1">
                              {stats.find(s => s.memory_type === type)?.newest_memory
                                ? new Date(stats.find(s => s.memory_type === type)?.newest_memory as string).toLocaleString()
                                : 'N/A'}
                            </dd>
                          </div>
                        </dl>
                      ) : (
                        <p>No {type} memories found.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
