
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationManager } from "@/components/admin/InvitationManager";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        // Here's where the error was - comparing with "admin" when that's not a valid role
        // Instead, check if the role is "pro" which is an admin in this system
        if (data.role === "pro") {
          setIsAdmin(true);
        } else {
          // Not an admin, redirect to dashboard
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user, navigate, toast]);
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!isAdmin) {
    return null; // Will redirect in useEffect
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
        
        <Tabs defaultValue="invitations">
          <TabsList className="mb-6">
            <TabsTrigger value="invitations">Invitation Codes</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">Application Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invitations">
            <InvitationManager />
          </TabsContent>
          
          <TabsContent value="users">
            <div className="rounded-lg border p-8 text-center">
              <h3 className="font-medium text-lg mb-2">User Management</h3>
              <p className="text-muted-foreground">User management features coming soon</p>
            </div>
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
