
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function ProfileQueryMonitor() {
  const [queryStats, setQueryStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQueryStats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('analyze_profile_queries');
        
        if (error) {
          throw error;
        }
        
        setQueryStats(data);
      } catch (error) {
        console.error('Error fetching profile query stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueryStats();
    
    // Set up a refresh interval
    const intervalId = setInterval(fetchQueryStats, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Query Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading query statistics...</div>
        ) : queryStats?.queries ? (
          <div className="space-y-4">
            <div className="text-sm">Last updated: {new Date(queryStats.timestamp).toLocaleString()}</div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Query</th>
                    <th className="text-right p-2">Calls</th>
                    <th className="text-right p-2">Total Time (ms)</th>
                    <th className="text-right p-2">Avg Time (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {queryStats.queries.map((query: any, idx: number) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">
                        <div className="max-w-md overflow-hidden text-ellipsis whitespace-nowrap">
                          {query.query}
                        </div>
                      </td>
                      <td className="text-right p-2">{query.calls}</td>
                      <td className="text-right p-2">{(query.total_time).toFixed(2)}</td>
                      <td className="text-right p-2">{(query.mean_time).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">No query data available</div>
        )}
      </CardContent>
    </Card>
  );
}
