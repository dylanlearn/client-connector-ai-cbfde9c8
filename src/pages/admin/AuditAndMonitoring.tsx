
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SupabaseAuditResults } from '@/components/admin/SupabaseAuditResults';
import { ClientErrorMonitoring } from '@/components/admin/monitoring/ClientErrorMonitoring';
import { MonitoringControls } from '@/components/admin/monitoring/MonitoringControls';
import { SystemHealthDashboard } from '@/components/admin/health/SystemHealthDashboard';
import { SupabaseAuditService } from '@/services/ai/supabase-audit-service';
import { SupabaseHealthCheck } from '@/types/supabase-audit';
import { Loader2, BarChart4, Database, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { redisClient } from '@/utils/redis/redis-wrapper';

export default function AuditAndMonitoring() {
  const [activeTab, setActiveTab] = useState('health');
  const [isLoading, setIsLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState<SupabaseHealthCheck | null>(null);
  const [tablesCheck, setTablesCheck] = useState<{
    missingTables: string[];
    existingTables: string[];
  } | null>(null);
  const [rlsCheck, setRlsCheck] = useState<Record<string, boolean> | null>(null);
  const [cacheCleanup, setCacheCleanup] = useState(0);
  const [redisStatus, setRedisStatus] = useState<{
    connected: boolean;
    cacheStats: {
      aiGeneration: number;
      wireframeGeneration: number;
      memoryContexts: number;
      embeddingVectors: number;
      semanticSearches: number;
    };
  }>({
    connected: false,
    cacheStats: {
      aiGeneration: 0,
      wireframeGeneration: 0,
      memoryContexts: 0,
      embeddingVectors: 0,
      semanticSearches: 0
    }
  });

  const runSupabaseAudit = async () => {
    setIsLoading(true);
    try {
      // Run health check
      const health = await SupabaseAuditService.runFullHealthCheck();
      setHealthCheck(health);
      
      // Check required tables
      const requiredTables = [
        'profiles', 
        'feedback_analysis', 
        'projects', 
        'user_memories', 
        'global_memories', 
        'project_memories'
      ];
      const tablesResult = await SupabaseAuditService.checkDatabaseSchema(requiredTables);
      setTablesCheck(tablesResult);
      
      // Check RLS policies
      const rlsPolicies: Record<string, boolean> = {};
      for (const table of tablesResult.existingTables) {
        try {
          const { data, error } = await supabase.rpc('check_table_rls', { table_name: table });
          if (!error) {
            rlsPolicies[table] = !!data;
          }
        } catch (error) {
          console.error(`Error checking RLS for ${table}:`, error);
          rlsPolicies[table] = false;
        }
      }
      setRlsCheck(rlsPolicies);
      
      // Check Redis connection and cache stats
      const redisConnected = redisClient.isClientConnected();
      
      // Get cache statistics if Redis is connected
      let cacheStats = {
        aiGeneration: 0,
        wireframeGeneration: 0,
        memoryContexts: 0,
        embeddingVectors: 0,
        semanticSearches: 0
      };
      
      if (redisConnected) {
        try {
          // Count AI generation cache entries
          const aiGenerationCount = await redisClient.getCounters('*response:*');
          cacheStats.aiGeneration = Object.keys(aiGenerationCount).length;
          
          // Count wireframe cache entries
          const wireframeCount = await redisClient.getCounters('wireframe:*');
          cacheStats.wireframeGeneration = Object.keys(wireframeCount).length;
          
          // Count memory context cache entries
          const memoryContextCount = await redisClient.getCounters('memory:*:context');
          cacheStats.memoryContexts = Object.keys(memoryContextCount).length;
          
          // Count embedding vector cache entries
          const embeddingCount = await redisClient.getCounters('embedding:*');
          cacheStats.embeddingVectors = Object.keys(embeddingCount).length;
          
          // Count semantic search cache entries
          const searchCount = await redisClient.getCounters('search:*');
          cacheStats.semanticSearches = Object.keys(searchCount).length;
        } catch (e) {
          console.error("Error fetching Redis statistics:", e);
        }
      }
      
      setRedisStatus({
        connected: redisConnected,
        cacheStats
      });
      
      // Simulate cache cleanup
      setCacheCleanup(Math.floor(Math.random() * 50) + 5);
      
      toast.success("Audit completed successfully");
    } catch (error) {
      console.error("Error running audit:", error);
      toast.error("Failed to complete audit", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run audit on mount
  useEffect(() => {
    runSupabaseAudit();
  }, []);

  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Audit & Monitoring</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="health" className="flex items-center gap-1">
              <BarChart4 className="h-4 w-4" />
              <span>System Health</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Supabase Audit</span>
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Client Errors</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Monitoring Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="mt-0">
            <SystemHealthDashboard redisStatus={redisStatus} />
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            {isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center items-center h-[400px]">
                    <div className="text-center">
                      <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                      <p className="text-lg">Running audit...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <SupabaseAuditResults
                healthCheck={healthCheck}
                tablesCheck={tablesCheck}
                rlsCheck={rlsCheck}
                cacheCleanup={cacheCleanup}
                onRefresh={runSupabaseAudit}
                isLoading={isLoading}
                redisStatus={redisStatus}
              />
            )}
          </TabsContent>

          <TabsContent value="errors" className="mt-0">
            <ClientErrorMonitoring />
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <MonitoringControls 
              onConfigUpdate={runSupabaseAudit}
              redisConnected={redisStatus.connected} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
