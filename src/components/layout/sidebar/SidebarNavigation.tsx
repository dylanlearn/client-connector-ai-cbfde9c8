
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FileText, 
  Users, 
  BarChart3, 
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Crown,
  PaintBucket,
  ShieldCheck
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

interface SidebarNavigationProps {
  currentPath: string;
}

const SidebarNavigation = ({ currentPath }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
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
      navigate("/projects");
    }
  };

  // Check if user has admin role
  const isAdmin = profile?.role === "admin";

  return (
    <>
      {/* Sync Section */}
      <SidebarGroup>
        <SidebarGroupLabel>
          <LayoutDashboard className="mr-2" size={16} />
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
            
            {/* Admin Panel Link - Only visible to admins */}
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/admin")}
                  isActive={isActive("/admin")}
                  className="text-indigo-600"
                >
                  <ShieldCheck size={20} />
                  <span>Admin Panel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
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
    </>
  );
};

export default SidebarNavigation;
