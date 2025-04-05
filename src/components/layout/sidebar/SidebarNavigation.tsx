
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Home,
  LayoutDashboard,
  ListTodo,
  Palette,
  Settings,
  Users,
  MessageSquareText,
  BrainCircuit,
  Globe,
  ShieldAlert,
  Activity,
  Database,
  AlertTriangle
} from "lucide-react";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SidebarNavigationProps {
  currentPath: string;
}

export const SidebarNavigation = ({ currentPath }: SidebarNavigationProps) => {
  const { isAdmin } = useAdminStatus();
  const [isAdminExpanded, setIsAdminExpanded] = useState(
    currentPath.startsWith("/admin")
  );
  
  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: <ListTodo className="h-5 w-5" />,
    },
    {
      title: "Clients",
      href: "/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Intake Form",
      href: "/intake-form",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Design Picker",
      href: "/design-picker",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "AI Suggestions",
      href: "/ai-suggestions",
      icon: <BrainCircuit className="h-5 w-5" />,
    },
    {
      title: "Feedback Analysis",
      href: "/feedback-analysis",
      icon: <MessageSquareText className="h-5 w-5" />,
    },
    {
      title: "Website Analyzer",
      href: "/website-analyzer",
      icon: <Globe className="h-5 w-5" />,
    }
  ];
  
  // Updated admin routes to match App.tsx
  const adminNavItems = [
    {
      title: "Admin Panel",
      href: "/admin",
      icon: <ShieldAlert className="h-5 w-5" />,
    },
    {
      title: "Analytics & Monitoring",
      href: "/admin/analytics",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: "Database Audit",
      href: "/admin/supabase-audit",
      icon: <Database className="h-5 w-5" />,
    },
    {
      title: "System Health",
      href: "/admin/audit-and-monitoring",
      icon: <AlertTriangle className="h-5 w-5" />,
    }
  ];
  
  const settingsNavItems = [
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="mt-4 px-2">
      <ul className="space-y-1">
        {mainNavItems.map((item) => (
          <li key={item.href}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </NavLink>
          </li>
        ))}
        
        {/* Admin section */}
        {isAdmin && (
          <li>
            <Collapsible
              open={isAdminExpanded}
              onOpenChange={setIsAdminExpanded}
              className="w-full"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <div className="flex items-center">
                  <ShieldAlert className="h-5 w-5" />
                  <span className="ml-3">Admin</span>
                </div>
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", {
                    "transform rotate-180": isAdminExpanded,
                  })}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-1 space-y-1 pl-8">
                  {adminNavItems.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive || 
                            (item.href.includes("?tab=") && 
                             currentPath === item.href.split("?")[0])
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`
                        }
                      >
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </li>
        )}
        
        {/* Settings */}
        {settingsNavItems.map((item) => (
          <li key={item.href}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
