
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAdminStatus } from '@/hooks/use-admin-status';
import { useToast } from '@/components/ui/use-toast';
import { ServiceHealthSection } from '@/components/admin/supabase-audit/ServiceHealthSection';
import { DatabaseTablesSection } from '@/components/admin/supabase-audit/DatabaseTablesSection';
import { EdgeFunctionsSection } from '@/components/admin/supabase-audit/EdgeFunctionsSection';
import { SupabaseAuditService } from '@/services/ai/supabase-audit-service';
import { SupabaseHealthCheck } from '@/types/supabase-audit';

export default function AuditAndMonitoring() {
  const { isAdmin, isVerifying } = useAdminStatus();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState<SupabaseHealthCheck | null>(null);
  const [typesCheck, setTypesCheck] = useState<any | null>(null);
  const [functionsCheck, setFunctionsCheck] = useState<any | null>(null);
  const [requiredTables] = useState([
    'profiles',
    'projects',
    'user_memories',
    'project_memories',
    'global_memories',
    'memory_embeddings',
    'wireframe_system_events',
    'client_errors',
    'audit_logs',
    'system_alerts',
    'system_health_checks',
    'system_monitoring'
  ]);
  const [schemaCheck, setSchemaCheck] = useState<{ 
    missingTables: string[];
    existingTables: string[];
  } | null>(null);

  const runFullAudit = async () => {
    setLoading(true);
    try {
      // Run all audit checks in parallel
      const [
        healthCheckResult,
        schemaCheckResult,
        typesCheckResult,
        functionsCheckResult
      ] = await Promise.all([
        SupabaseAuditService.runFullHealthCheck(),
        SupabaseAuditService.checkDatabaseSchema(requiredTables),
        SupabaseAuditService.checkTypeConsistency(),
        SupabaseAuditService.checkDatabaseFunctions()
      ]);

      setHealthCheck(healthCheckResult);
      setSchemaCheck(schemaCheckResult);
      setTypesCheck(typesCheckResult);
      setFunctionsCheck(functionsCheckResult);

      // Show aggregate status
      if (
        healthCheckResult.overall === 'healthy' && 
        schemaCheckResult.missingTables.length === 0 &&
        typesCheckResult.status === 'ok' &&
        functionsCheckResult.status === 'ok'
      ) {
        toast({
          title: "System Healthy",
          description: "All systems and connections are working properly.",
          variant: "default",
        });
      } else {
        toast({
          title: "System Issues Detected",
          description: "There are some issues that require attention.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Audit failed:', error);
      toast({
        title: "Audit Failed",
        description: "Could not complete the system audit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !isVerifying) {
      runFullAudit();
    }
  }, [isAdmin, isVerifying]);

  if (isVerifying) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Verifying admin access...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">System Audit & Monitoring</h1>
          <Button 
            onClick={runFullAudit} 
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Running Audit...' : 'Run Full Audit'}
          </Button>
        </div>

        <Tabs defaultValue="health">
          <TabsList className="mb-4">
            <TabsTrigger value="health">Service Health</TabsTrigger>
            <TabsTrigger value="schema">Database Schema</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="types">Type Consistency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Supabase Service Health</CardTitle>
                <CardDescription>
                  Status of essential Supabase services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : healthCheck ? (
                  <ServiceHealthSection healthCheck={healthCheck} />
                ) : (
                  <p className="text-center text-gray-500">No health data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schema">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema Check</CardTitle>
                <CardDescription>
                  Verify essential tables exist in the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : schemaCheck ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Existing Tables ({schemaCheck.existingTables.length})</h3>
                        <div className="border rounded-md p-3 bg-gray-50 max-h-[200px] overflow-y-auto">
                          {schemaCheck.existingTables.length > 0 ? (
                            <ul className="space-y-1">
                              {schemaCheck.existingTables.map(table => (
                                <li key={table} className="flex items-center">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-2" />
                                  {table}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No matching tables found</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Missing Tables ({schemaCheck.missingTables.length})</h3>
                        <div className="border rounded-md p-3 bg-gray-50 max-h-[200px] overflow-y-auto">
                          {schemaCheck.missingTables.length > 0 ? (
                            <ul className="space-y-1">
                              {schemaCheck.missingTables.map(table => (
                                <li key={table} className="flex items-center">
                                  <XCircle className="h-3.5 w-3.5 text-red-500 mr-2" />
                                  {table}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">All required tables exist</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {healthCheck?.database.tables && (
                      <DatabaseTablesSection databaseData={healthCheck.database} />
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No schema data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="functions">
            <Card>
              <CardHeader>
                <CardTitle>Functions Check</CardTitle>
                <CardDescription>
                  Verify database functions and edge functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Database Functions</h3>
                      <div className={`p-3 border rounded-md ${functionsCheck?.status === 'ok' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center mb-2">
                          {functionsCheck?.status === 'ok' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span className={functionsCheck?.status === 'ok' ? "text-green-700" : "text-red-700"}>
                            {functionsCheck?.message}
                          </span>
                        </div>
                        
                        <div className="mt-2 max-h-[150px] overflow-y-auto">
                          <ul className="space-y-1">
                            {functionsCheck?.functions.map((fn: string) => (
                              <li key={fn} className="text-sm flex items-center">
                                <FunctionSquare className="h-3 w-3 mr-2 text-blue-500" />
                                {fn}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Edge Functions</h3>
                      {healthCheck?.functions && (
                        <EdgeFunctionsSection functionsData={healthCheck.functions} />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="types">
            <Card>
              <CardHeader>
                <CardTitle>Type Consistency</CardTitle>
                <CardDescription>
                  Verify TypeScript type definitions match database schema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : typesCheck ? (
                  <div className={`p-4 border rounded-md ${typesCheck.status === 'ok' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center">
                      {typesCheck.status === 'ok' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <h3 className="font-medium">
                        {typesCheck.message}
                      </h3>
                    </div>
                    
                    {typesCheck.issues.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium">Issues Found:</h4>
                        <ul className="space-y-1">
                          {typesCheck.issues.map((issue: string, index: number) => (
                            <li key={index} className="text-sm ml-4 list-disc">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No type check data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
