
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ShieldAlert,
  Activity,
  Database,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AdminNavigationItemProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const adminNavItems: AdminNavigationItemProps[] = [
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

interface AdminNavigationProps {
  currentPath: string;
}

const AdminNavigation = ({ currentPath }: AdminNavigationProps) => {
  const [isAdminExpanded, setIsAdminExpanded] = useState(
    currentPath.startsWith("/admin")
  );

  return (
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
  );
};

export default AdminNavigation;
