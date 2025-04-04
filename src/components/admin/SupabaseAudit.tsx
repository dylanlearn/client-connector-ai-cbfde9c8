import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Database, 
  Key, 
  HardDrive, 
  FunctionSquare, 
  Loader2, 
  Shield 
} from 'lucide-react';
import { checkSupabaseHealth, verifyRequiredTables, checkRLSPolicies } from '@/utils/supabase-audit';
import { toast } from 'sonner';

export function SupabaseAudit() {
  const [isLoading, setIsLoading] = useState(false);
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [tablesCheck, setTablesCheck] = useState<{
    missingTables: string[];
    existingTables: string[];
  } | null>(null);
  const [rlsCheck, setRlsCheck] = useState<Record<string, boolean> | null>(null);
  
  const runAudit = async () => {
    setIsLoading(true);
    try {
      const requiredTables = [
        'profiles', 
        'global_memories', 
        'user_memories', 
        'project_memories', 
        'feedback_analysis',
        'projects'
      ];
      
      const health = await checkSupabaseHealth();
      setHealthCheck(health);
      
      const tables = await verifyRequiredTables(requiredTables);
      setTablesCheck(tables);
      
      const tablesToCheckRLS = ['profiles', 'global_memories', 'user_memories', 'project_memories', 'feedback_analysis'];
      const rls = await checkRLSPolicies(tablesToCheckRLS.filter(table => 
        tables.existingTables.includes(table)
      ));
      setRlsCheck(rls);
      
      toast.success('Supabase audit completed', {
        description: `Overall status: ${health.overall}`
      });
    } catch (error) {
      console.error('Error running Supabase audit:', error);
      toast.error('Failed to complete Supabase audit', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    runAudit();
  }, []);
  
  const getStatusIcon = (status: 'ok' | 'error' | boolean) => {
    if (status === 'ok' || status === true) {
      return <Check className="h-5 w-5 text-green-500" />;
    } else if (status === 'error' || status === false) {
      return <X className="h-5 w-5 text-red-500" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };
  
  const getHealthColor = (status: string) => {
    if (status === 'healthy' || status === 'ok') return 'text-green-600';
    if (status === 'degraded') return 'text-yellow-600';
    return 'text-red-600';
  };
  
  if (isLoading && !healthCheck) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Supabase Audit</CardTitle>
          <CardDescription>Checking Supabase services and configuration...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-sm text-gray-600">
              Running comprehensive audit of your Supabase instance...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Supabase Audit</CardTitle>
            <CardDescription>
              Enterprise-level check of your Supabase configuration
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runAudit} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Recheck
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {healthCheck && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Service Health</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Authentication</span>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(healthCheck.auth.status)}
                      <span className={`ml-2 text-xs ${getHealthColor(healthCheck.auth.status)}`}>
                        {healthCheck.auth.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Database</span>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(healthCheck.database.status)}
                      <span className={`ml-2 text-xs ${getHealthColor(healthCheck.database.status)}`}>
                        {healthCheck.database.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Storage</span>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(healthCheck.storage.status)}
                      <span className={`ml-2 text-xs ${getHealthColor(healthCheck.storage.status)}`}>
                        {healthCheck.storage.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <FunctionSquare className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Edge Functions</span>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(healthCheck.functions.status)}
                      <span className={`ml-2 text-xs ${getHealthColor(healthCheck.functions.status)}`}>
                        {healthCheck.functions.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Edge Functions</h3>
                <div className="p-3 border rounded-md bg-gray-50 h-[160px] overflow-y-auto">
                  {healthCheck.functions.availableFunctions.length > 0 ? (
                    <ul className="space-y-2">
                      {healthCheck.functions.availableFunctions.map((fn: string) => (
                        <li key={fn} className="flex items-center text-sm">
                          <FunctionSquare className="h-3 w-3 mr-2 text-blue-500" />
                          {fn}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No edge functions detected</p>
                  )}
                </div>
              </div>
            </div>
            
            {tablesCheck && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Database Tables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500">Required Tables</h4>
                    <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
                      <ul className="space-y-2">
                        {['profiles', 'global_memories', 'user_memories', 'project_memories', 'feedback_analysis', 'projects'].map(table => (
                          <li key={table} className="flex items-center justify-between text-sm">
                            <span>{table}</span>
                            {tablesCheck.missingTables.includes(table) ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500">RLS Policies</h4>
                    <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
                      {rlsCheck ? (
                        <ul className="space-y-2">
                          {Object.entries(rlsCheck).map(([table, hasRLS]) => (
                            <li key={table} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <Shield className="h-3 w-3 mr-2 text-gray-500" />
                                {table}
                              </div>
                              {hasRLS ? (
                                <span className="text-xs text-green-600">Protected</span>
                              ) : (
                                <span className="text-xs text-red-600">Unprotected</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">RLS policy information not available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t">
        <div className="flex w-full justify-between items-center">
          <div className="text-sm text-gray-600">
            Last checked: {new Date().toLocaleTimeString()}
          </div>
          
          {healthCheck && (
            <div className={`font-medium ${getHealthColor(healthCheck.overall)}`}>
              Overall: {healthCheck.overall.toUpperCase()}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
