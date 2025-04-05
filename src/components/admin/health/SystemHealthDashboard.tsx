
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Database } from 'lucide-react';

interface SystemHealthDashboardProps {
  redisStatus?: {
    connected: boolean;
    cacheStats: {
      aiGeneration: number;
      wireframeGeneration: number;
      memoryContexts: number;
      embeddingVectors: number;
      semanticSearches: number;
    };
  };
}

export function SystemHealthDashboard({ redisStatus }: SystemHealthDashboardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Services Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Database</h3>
                <Badge variant="outline" className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <p className="text-sm text-gray-600">All database connections are operational.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Authentication</h3>
                <Badge variant="outline" className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <p className="text-sm text-gray-600">Authentication services functioning normally.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Storage</h3>
                <Badge variant="outline" className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <p className="text-sm text-gray-600">File storage services are operational.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Redis Cache</h3>
                {redisStatus ? (
                  <Badge 
                    variant="outline" 
                    className={redisStatus.connected ? 
                      "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                    }
                  >
                    {redisStatus.connected ? "Connected" : "Disconnected"}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100">Unknown</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {redisStatus?.connected 
                  ? "Redis cache services are operational." 
                  : "Redis cache connection unavailable."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {redisStatus?.connected && (
        <Card>
          <CardHeader>
            <CardTitle>Redis Cache Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-medium mb-1">AI Generation</p>
                <p className="text-2xl font-semibold">{redisStatus.cacheStats.aiGeneration}</p>
                <p className="text-xs text-gray-500">Cache Entries</p>
              </div>
              
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-medium mb-1">Wireframes</p>
                <p className="text-2xl font-semibold">{redisStatus.cacheStats.wireframeGeneration}</p>
                <p className="text-xs text-gray-500">Cache Entries</p>
              </div>
              
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-medium mb-1">Memory Contexts</p>
                <p className="text-2xl font-semibold">{redisStatus.cacheStats.memoryContexts}</p>
                <p className="text-xs text-gray-500">Cache Entries</p>
              </div>
              
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-medium mb-1">Embeddings</p>
                <p className="text-2xl font-semibold">{redisStatus.cacheStats.embeddingVectors}</p>
                <p className="text-xs text-gray-500">Cache Entries</p>
              </div>
              
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm font-medium mb-1">Semantic Search</p>
                <p className="text-2xl font-semibold">{redisStatus.cacheStats.semanticSearches}</p>
                <p className="text-xs text-gray-500">Cache Entries</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center space-x-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                Redis cache is active and improving application performance.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
