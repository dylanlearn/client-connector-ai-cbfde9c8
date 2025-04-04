
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { checkSupabaseHealth, verifyRequiredTables, checkRLSPolicies } from '@/utils/supabase-audit';
import { supabaseAuditService } from '@/services/ai/supabase-audit-service';
import { SupabaseAuditResults } from '@/components/admin/SupabaseAuditResults';

export default function SupabaseAuditDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [tablesCheck, setTablesCheck] = useState<{
    missingTables: string[];
    existingTables: string[];
  } | null>(null);
  const [rlsCheck, setRlsCheck] = useState<Record<string, boolean> | null>(null);
  const [cacheCleanup, setCacheCleanup] = useState<number>(0);
  
  const runAudit = async () => {
    setIsLoading(true);
    try {
      const requiredTables = [
        'profiles', 
        'global_memories', 
        'user_memories', 
        'project_memories', 
        'feedback_analysis',
        'projects',
        'ai_wireframes',
        'wireframe_sections',
        'wireframe_versions'
      ];
      
      const [health, tables, rls, cache] = await Promise.all([
        checkSupabaseHealth(),
        verifyRequiredTables(requiredTables),
        checkRLSPolicies(requiredTables.filter(table => 
          tables ? tables.existingTables.includes(table) : true
        )),
        supabaseAuditService.checkExpiredCacheEntries()
      ]);
      
      setHealthCheck(health);
      setTablesCheck(tables);
      setRlsCheck(rls);
      setCacheCleanup(cache);
      
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
        <p className="text-gray-500">Running Supabase audit...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Enterprise Audit</h1>
      <p className="text-gray-600 mb-8">
        This dashboard provides a comprehensive audit of your Supabase configuration
        to ensure it meets enterprise-level requirements.
      </p>
      
      <SupabaseAuditResults 
        healthCheck={healthCheck} 
        tablesCheck={tablesCheck}
        rlsCheck={rlsCheck}
        cacheCleanup={cacheCleanup}
        onRefresh={runAudit}
        isLoading={isLoading}
      />
    </div>
  );
}
