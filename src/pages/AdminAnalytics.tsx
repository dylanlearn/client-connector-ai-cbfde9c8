
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
import { motion } from "framer-motion";
import VisualPicker from "@/components/design/VisualPicker";

// Custom motion tab trigger component with proper TypeScript typing
interface MotionTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const MotionTabsTrigger = ({ value, children, className = "" }: MotionTabsTriggerProps) => {
  return (
    <TabsTrigger value={value} className={className} asChild>
      <motion.div
        whileHover={{ 
          scale: 1.05,
          backgroundColor: "rgba(var(--primary-rgb), 0.1)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ 
          duration: 0.2, 
          ease: "easeInOut" 
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer"
      >
        {children}
      </motion.div>
    </TabsTrigger>
  );
};

// Sample design options for the VisualPicker demo
const sampleDesignOptions = [
  {
    id: "1",
    title: "Modern Minimalist",
    description: "Clean lines with minimalist aesthetics focused on simplicity and function",
    imageUrl: "/lovable-uploads/480f7861-cc1e-41e1-9ee1-be7ba9aa52b9.png",
    category: "design"
  },
  {
    id: "2",
    title: "Bold & Vibrant",
    description: "Energetic design with bright colors and dynamic elements",
    imageUrl: "/lovable-uploads/23ecc16f-a53c-43af-8d71-1034d90498b3.png",
    category: "design"
  },
  {
    id: "3",
    title: "Professional Business",
    description: "Corporate aesthetic with refined elements and professional appeal",
    imageUrl: "/lovable-uploads/0392ac21-110f-484c-8f3d-5fcbb0dcefc6.png",
    category: "design"
  }
];

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

  const handleDesignSelect = (option: any, liked: boolean) => {
    console.log(`${liked ? 'Liked' : 'Disliked'} option:`, option);
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-11">
          <h1 className="text-3xl font-bold tracking-tight">Admin Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive system monitoring and analytical insights for administrators
          </p>
        </div>
        
        <Tabs defaultValue="memory" className="space-y-8">
          <TabsList className="flex flex-wrap gap-2 p-1 mb-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-3 pt-3 rounded-lg shadow-sm">
            <MotionTabsTrigger value="memory">
              <BrainCircuit className="h-4 w-4" />
              Memory Analytics
            </MotionTabsTrigger>
            
            <MotionTabsTrigger value="system">
              <Database className="h-4 w-4" />
              System Monitoring
            </MotionTabsTrigger>
            
            <MotionTabsTrigger value="prompts">
              <LineChart className="h-4 w-4" />
              Prompt Testing
            </MotionTabsTrigger>
            
            <MotionTabsTrigger value="health">
              <Activity className="h-4 w-4" />
              System Health
            </MotionTabsTrigger>
            
            <MotionTabsTrigger value="audit">
              <FileText className="h-4 w-4" />
              Audit Logs
            </MotionTabsTrigger>
            
            <MotionTabsTrigger value="supabase">
              <AlertTriangle className="h-4 w-4" />
              Supabase Audit
            </MotionTabsTrigger>

            <MotionTabsTrigger value="design-picker">
              <Activity className="h-4 w-4" />
              Design Picker
            </MotionTabsTrigger>
          </TabsList>
          
          <TabsContent value="memory" className="space-y-6 pt-4">
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
          
          <TabsContent value="system" className="pt-4">
            <MonitoringDashboard />
          </TabsContent>
          
          <TabsContent value="prompts" className="pt-4">
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

          <TabsContent value="health" className="pt-4">
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

          <TabsContent value="audit" className="pt-4">
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

          <TabsContent value="supabase" className="pt-4">
            <SupabaseAudit />
          </TabsContent>

          <TabsContent value="design-picker" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Design Selection</CardTitle>
                <CardDescription>
                  Tinder-style design selection interface for quick visual feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full max-w-md">
                  <VisualPicker 
                    options={sampleDesignOptions} 
                    onSelectOption={handleDesignSelect} 
                    category="design" 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
