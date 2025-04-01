
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Zap, 
  Crown, 
  PaintBucket,
  LayoutDashboard
} from "lucide-react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset
} from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };
  
  const isProSection = (path: string) => {
    return path === "/analytics" || path === "/clients";
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="px-2 py-4">
            <div className="flex items-center px-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 mr-2 flex items-center justify-center text-white">
                <LayoutDashboard size={18} />
              </div>
              <span className="font-semibold text-lg">DezignSync</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {/* Sync Section */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <Zap className="mr-2" size={16} />
                Sync
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/dashboard")}
                      isActive={isActive("/dashboard")}
                    >
                      <LayoutDashboard size={20} />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/projects")}
                      isActive={isActive("/projects")}
                    >
                      <FileText size={20} />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {/* Sync Pro Section */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <Crown className="mr-2" size={16} />
                Sync Pro
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/clients")}
                      isActive={isActive("/clients")}
                    >
                      <Users size={20} />
                      <span>Clients</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/analytics")}
                      isActive={isActive("/analytics")}
                    >
                      <BarChart3 size={20} />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {/* Templates Section */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <PaintBucket className="mr-2" size={16} />
                Templates
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/templates")}
                      isActive={isActive("/templates")}
                    >
                      <PaintBucket size={20} />
                      <span>Marketplace</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/settings")}
                      isActive={isActive("/settings")}
                    >
                      <Settings size={20} />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="flex flex-col w-full">
            <DashboardHeader />
            <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
