
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
  Loader2
} from 'lucide-react';
import { checkSupabaseHealth, verifyRequiredTables, checkRLSPolicies } from '@/utils/supabase-audit';
import { toast } from 'sonner';
import { ServiceHealthSection } from './supabase-audit/ServiceHealthSection';
import { EdgeFunctionsSection } from './supabase-audit/EdgeFunctionsSection';
import { DatabaseTablesSection } from './supabase-audit/DatabaseTablesSection';
import { LoadingState } from './supabase-audit/LoadingState';

export function SupabaseAudit() {
  const [isLoading, setIsLoading] = useState(false);
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [tablesCheck, setTablesCheck] = useState<{
    missingTables: string[];
    existingTables: string[];
  } | null>(null);
  const [rlsCheck, setRlsCheck] = useState<Record<string, boolean> | null>(null);
  
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
  
  if (isLoading && !healthCheck) {
    return <LoadingState />;
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
              <ServiceHealthSection 
                healthCheck={healthCheck} 
                getStatusIcon={getStatusIcon} 
                getHealthColor={getHealthColor} 
              />
              <EdgeFunctionsSection healthCheck={healthCheck} />
            </div>
            <DatabaseTablesSection tablesCheck={tablesCheck} rlsCheck={rlsCheck} />
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
