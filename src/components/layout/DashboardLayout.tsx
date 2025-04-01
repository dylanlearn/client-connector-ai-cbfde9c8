
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
  LayoutDashboard,
  ChevronDown,
  ChevronRight
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
import { cn } from "@/lib/utils";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const currentPath = location.pathname;
  const [syncProOpen, setSyncProOpen] = useState(
    currentPath === "/projects" || 
    currentPath === "/clients" || 
    currentPath === "/analytics"
  );

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };
  
  const isProSection = (path: string) => {
    return path === "/projects" || path === "/clients" || path === "/analytics";
  };

  const handleSyncProClick = () => {
    setSyncProOpen(!syncProOpen);
    if (!syncProOpen && !isProSection(currentPath)) {
      // If opening the submenu and not already on a pro section page, navigate to projects
      navigate("/projects");
    }
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
                      onClick={handleSyncProClick}
                      className="justify-between"
                    >
                      <div className="flex items-center">
                        <Crown size={20} className="mr-2" />
                        <span>Pro Features</span>
                      </div>
                      {syncProOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {syncProOpen && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => navigate("/projects")}
                          isActive={isActive("/projects")}
                        >
                          <FileText size={16} />
                          <span>Projects</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => navigate("/clients")}
                          isActive={isActive("/clients")}
                        >
                          <Users size={16} />
                          <span>Clients</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => navigate("/analytics")}
                          isActive={isActive("/analytics")}
                        >
                          <BarChart3 size={16} />
                          <span>Analytics</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
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
