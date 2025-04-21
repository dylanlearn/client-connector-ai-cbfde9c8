
import React from 'react';
import { Check, X, Shield, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DatabaseTablesSectionProps {
  databaseData: {
    tables?: string[];
    status: 'ok' | 'error';
    message: string;
    performance?: any;
  };
}

export function DatabaseTablesSection({ databaseData }: DatabaseTablesSectionProps) {
  const { data: actualTables, isLoading, error } = useQuery({
    queryKey: ['database-tables'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('pg_catalog.pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
          .order('tablename');
          
        if (error) throw error;
        return data.map(table => table.tablename);
      } catch (err) {
        console.error('Error fetching tables:', err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: rlsData, isLoading: isLoadingRLS } = useQuery({
    queryKey: ['rls-policies'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('pg_catalog.pg_policy')
          .select('tablename, policyname')
          .eq('schemaname', 'public');
          
        if (error) throw error;
        
        // Create a map of table names to boolean indicating if they have RLS
        const tablesWithRLS = {};
        data.forEach(policy => {
          tablesWithRLS[policy.tablename] = true;
        });
        
        return tablesWithRLS;
      } catch (err) {
        console.error('Error fetching RLS policies:', err);
        return {};
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Required tables that should exist in the database
  const requiredTables = [
    'profiles',
    'global_memories',
    'user_memories',
    'project_memories',
    'feedback_analysis',
    'projects'
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Database Tables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">Required Tables</h4>
            <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">RLS Policies</h4>
            <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-3 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-4 w-[60px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading database tables. Check console for details.
        </AlertDescription>
      </Alert>
    );
  }

  const tables = actualTables || [];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Database Tables</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500">Required Tables</h4>
          <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
            <ul className="space-y-2">
              {requiredTables.map(table => (
                <li key={table} className="flex items-center justify-between text-sm">
                  <span>{table}</span>
                  {!tables.includes(table) ? (
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
            {isLoadingRLS ? (
              <p className="text-sm text-gray-500">Loading RLS information...</p>
            ) : (
              <ul className="space-y-2">
                {requiredTables.map(table => (
                  <li key={table} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-2 text-gray-500" />
                      {table}
                    </div>
                    {rlsData && rlsData[table] ? (
                      <span className="text-xs text-green-600">Protected</span>
                    ) : (
                      <span className="text-xs text-red-600">Unprotected</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
