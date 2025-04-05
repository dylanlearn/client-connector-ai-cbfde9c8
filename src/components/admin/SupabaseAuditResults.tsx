
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SupabaseHealthCheck } from '@/types/supabase-audit';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface SupabaseAuditResultsProps {
  healthCheck: SupabaseHealthCheck | null;
  tablesCheck: {
    missingTables: string[];
    existingTables: string[];
  } | null;
  rlsCheck: Record<string, boolean> | null;
  cacheCleanup: number;
  onRefresh: () => void;
  isLoading: boolean;
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

export function SupabaseAuditResults({
  healthCheck,
  tablesCheck,
  rlsCheck,
  cacheCleanup,
  onRefresh,
  isLoading,
  redisStatus
}: SupabaseAuditResultsProps) {
  const getStatusIcon = (status: string) => {
    if (status === 'ok' || status === 'healthy') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (status === 'degraded') {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    if (status === 'ok' || status === 'healthy') {
      return 'bg-green-100 text-green-800 border-green-300';
    } else if (status === 'degraded') {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    } else {
      return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supabase Audit Results</h2>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {healthCheck && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Overall Health</CardTitle>
              <Badge className={getStatusClass(healthCheck.overall)}>
                {healthCheck.overall.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {getStatusIcon(healthCheck.auth.status)}
                  <h3 className="ml-2 text-lg font-semibold">Authentication Service</h3>
                </div>
                <p className="text-sm text-gray-600">{healthCheck.auth.message}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {getStatusIcon(healthCheck.database.status)}
                  <h3 className="ml-2 text-lg font-semibold">Database Service</h3>
                </div>
                <p className="text-sm text-gray-600">{healthCheck.database.message}</p>
                {healthCheck.database.performance && (
                  <p className="text-xs text-gray-500 mt-1">
                    Query time: {healthCheck.database.performance.queryTime}ms
                  </p>
                )}
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {getStatusIcon(healthCheck.storage.status)}
                  <h3 className="ml-2 text-lg font-semibold">Storage Service</h3>
                </div>
                <p className="text-sm text-gray-600">{healthCheck.storage.message}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {getStatusIcon(healthCheck.functions.status)}
                  <h3 className="ml-2 text-lg font-semibold">Functions Service</h3>
                </div>
                <p className="text-sm text-gray-600">{healthCheck.functions.message}</p>
                {healthCheck.functions.availableFunctions && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Available Functions:</p>
                    <div className="flex flex-wrap gap-1">
                      {healthCheck.functions.availableFunctions.map((fn, index) => (
                        <Badge key={index} variant="outline">{fn}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {tablesCheck && (
        <Card>
          <CardHeader>
            <CardTitle>Database Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Existing Tables</h3>
                {tablesCheck.existingTables.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tablesCheck.existingTables.map((table, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50">
                        {table}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tables found</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Missing Tables</h3>
                {tablesCheck.missingTables.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tablesCheck.missingTables.map((table, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-800">
                        {table}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">All required tables exist</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {rlsCheck && (
        <Card>
          <CardHeader>
            <CardTitle>Row Level Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(rlsCheck).map(([table, enabled], index) => (
                <div key={index} className={`border rounded-lg p-3 ${enabled ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2">
                    {enabled ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{table}</span>
                  </div>
                  <p className="text-xs mt-1">
                    RLS {enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Entries cleaned in last run</p>
                <p className="text-sm text-gray-600">Cache entries removed: {cacheCleanup}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
                Clean Cache
              </Button>
            </div>
            
            {redisStatus && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Redis Cache Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="border rounded-lg p-3 bg-blue-50">
                    <p className="text-sm font-medium">Connection Status</p>
                    <div className="flex items-center mt-1">
                      {redisStatus.connected ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span>{redisStatus.connected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">AI Generation Cache</p>
                    <p className="text-lg mt-1">{redisStatus.cacheStats.aiGeneration}</p>
                    <p className="text-xs text-gray-500">Entries</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Wireframe Cache</p>
                    <p className="text-lg mt-1">{redisStatus.cacheStats.wireframeGeneration}</p>
                    <p className="text-xs text-gray-500">Entries</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Memory Contexts</p>
                    <p className="text-lg mt-1">{redisStatus.cacheStats.memoryContexts}</p>
                    <p className="text-xs text-gray-500">Entries</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Embedding Vectors</p>
                    <p className="text-lg mt-1">{redisStatus.cacheStats.embeddingVectors}</p>
                    <p className="text-xs text-gray-500">Entries</p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Semantic Searches</p>
                    <p className="text-lg mt-1">{redisStatus.cacheStats.semanticSearches}</p>
                    <p className="text-xs text-gray-500">Entries</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
