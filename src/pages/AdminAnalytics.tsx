
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MemoryAnalytics } from "@/components/ai/memory-monitor";
import { MonitoringDashboard } from "@/components/admin/monitoring";
import { PromptTestingAnalytics } from "@/components/admin/PromptTestingAnalytics";
import { Loader2, ShieldAlert, Database, BrainCircuit, LineChart, Activity, FileText, AlertTriangle } from "lucide-react";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { SupabaseAudit } from "@/components/admin/SupabaseAudit";
import { AuditLogViewer } from "@/components/admin/audit/AuditLogViewer";
import { SystemHealthDashboard } from "@/components/admin/health/SystemHealthDashboard";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { isAdmin, isVerifying } = useAdminStatus();
  // Track if we've already redirected to prevent infinite loop
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    // Redirect non-admin users - only if not already redirected and not still verifying
    if (!isVerifying && !isAdmin && !hasRedirected.current) {
      hasRedirected.current = true; // Mark as redirected
      navigate("/dashboard");
    }
  }, [isAdmin, isVerifying, navigate]);

  if (isVerifying) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Verifying admin access...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
            <p className="text-muted-foreground max-w-md">
              You don't have permission to access the admin analytics. This area is restricted to administrators only.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Admin Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive system monitoring and analytical insights for administrators
          </p>
        </div>
        
        <Tabs defaultValue="memory" className="space-y-6">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="memory" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              Memory Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System Monitoring
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Prompt Testing
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Health
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="supabase" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Supabase Audit
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="memory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Memory System Analytics</CardTitle>
                <CardDescription>
                  Deep insights into memory patterns, clusters, and user behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemoryAnalytics />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <MonitoringDashboard />
          </TabsContent>
          
          <TabsContent value="prompts">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Testing Analytics</CardTitle>
                <CardDescription>
                  Track and optimize AI prompt performance across variants
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <PromptTestingAnalytics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>System Health Dashboard</CardTitle>
                <CardDescription>
                  Enterprise-level monitoring and alerting for all system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemHealthDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log Explorer</CardTitle>
                <CardDescription>
                  Comprehensive audit trail of all system actions and user activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuditLogViewer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supabase">
            <SupabaseAudit />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
