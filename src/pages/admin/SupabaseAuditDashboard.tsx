
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleAlert, Database, FunctionSquare, TableProperties } from 'lucide-react';
import { SupabaseAuditService } from '@/services/ai/supabase-audit-service';
import { DatabaseTablesSection } from '@/components/admin/supabase-audit/DatabaseTablesSection';
import { EdgeFunctionsSection } from '@/components/admin/supabase-audit/EdgeFunctionsSection';
import { ServiceHealthSection } from '@/components/admin/supabase-audit/ServiceHealthSection';
import { LoadingState } from '@/components/admin/supabase-audit/LoadingState';
import DashboardLayout from '@/components/layout/DashboardLayout';

const SupabaseAuditDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<any>(null);

  useEffect(() => {
    const runAudit = async () => {
      try {
        setLoading(true);
        const data = await SupabaseAuditService.runFullHealthCheck();
        setAuditData(data);
        setError(null);
      } catch (err) {
        console.error('Error running Supabase audit:', err);
        setError('Failed to run Supabase audit. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    runAudit();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Supabase Audit Dashboard</h1>
          <LoadingState />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Supabase Audit Dashboard</h1>
          <Alert variant="destructive">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Supabase Audit Dashboard</h1>

        <div className="grid gap-6">
          <ServiceHealthSection healthData={auditData} />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TableProperties className="mr-2 h-5 w-5 text-blue-500" />
                  Database Tables
                </CardTitle>
                <CardDescription>
                  Tables in your Supabase database and their RLS policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DatabaseTablesSection databaseData={auditData?.database} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FunctionSquare className="mr-2 h-5 w-5 text-green-500" />
                  Edge Functions
                </CardTitle>
                <CardDescription>
                  Deployed edge functions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EdgeFunctionsSection functionsData={auditData?.functions} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupabaseAuditDashboard;
