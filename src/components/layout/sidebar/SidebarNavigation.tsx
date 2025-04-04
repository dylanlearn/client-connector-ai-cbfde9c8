
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
  ShieldAlert
} from "lucide-react";
import { useAdminStatus } from "@/hooks/use-admin-status";

interface SidebarNavigationProps {
  currentPath: string;
}

export const SidebarNavigation = ({ currentPath }: SidebarNavigationProps) => {
  const { isAdmin } = useAdminStatus();
  
  const navItems = [
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
      href: "/client-hub",
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
    },
    // Show Admin Analytics only to admin users
    ...(isAdmin ? [
      {
        title: "Admin Analytics",
        href: "/admin-analytics",
        icon: <ShieldAlert className="h-5 w-5" />,
      }
    ] : []),
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="mt-4 px-2">
      <ul className="space-y-1">
        {navItems.map((item) => (
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
