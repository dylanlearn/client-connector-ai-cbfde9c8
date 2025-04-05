
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client'; // Added this import

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
            <TabsTrigger value="health">System Health</TabsTrigger>
            <TabsTrigger value="audit">Supabase Audit</TabsTrigger>
            <TabsTrigger value="errors">Client Errors</TabsTrigger>
            <TabsTrigger value="config">Monitoring Config</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="mt-0">
            <SystemHealthDashboard />
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
              />
            )}
          </TabsContent>

          <TabsContent value="errors" className="mt-0">
            <ClientErrorMonitoring />
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <MonitoringControls onConfigUpdate={() => {
              runSupabaseAudit();
            }} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
