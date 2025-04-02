
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationManager } from "@/components/admin/InvitationManager";
import { UserManagement } from "@/components/admin/UserManagement";
import { PromptTestingAnalytics } from "@/components/admin/PromptTestingAnalytics";
import { MonitoringDashboard } from "@/components/admin/monitoring";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";
import RoleManagementGuide from "@/components/admin/RoleManagementGuide";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isVerifying, verifyAdminStatus } = useAdminStatus();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      
      // Verify admin status - the hook will handle the rest
      await verifyAdminStatus(true); // Force check to ensure fresh status
    };
    
    checkAccess();
  }, [user, navigate, toast, verifyAdminStatus]);
  
  if (isVerifying) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              You don't have permission to access the admin panel. This area is restricted to administrators only.
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage your application settings and user access
          </p>
        </div>
        
        <RoleManagementGuide />
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="invitations">Invitation Codes</TabsTrigger>
            <TabsTrigger value="promptTesting">Prompt Testing</TabsTrigger>
            <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
            <TabsTrigger value="settings">Application Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="invitations">
            <InvitationManager />
          </TabsContent>
          
          <TabsContent value="promptTesting">
            <PromptTestingAnalytics />
          </TabsContent>
          
          <TabsContent value="monitoring">
            <MonitoringDashboard />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="rounded-lg border p-8 text-center">
              <h3 className="font-medium text-lg mb-2">Application Settings</h3>
              <p className="text-muted-foreground">Application settings coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
