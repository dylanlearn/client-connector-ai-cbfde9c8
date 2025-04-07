
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  FolderKanban,
  Settings,
  Users,
  FileText,
  BarChart3,
  Layout,
  Wand2,
  Microscope,
  FileInput
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MainNavigationItemProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const mainNavItems: MainNavigationItemProps[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: <FolderKanban className="h-5 w-5" />,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Design Picker",
    href: "/design-picker",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: "Wireframe Generator",
    href: "/wireframe-generator",
    icon: <Layout className="h-5 w-5" />,
  },
  {
    title: "Website Analyzer",
    href: "/website-analyzer",
    icon: <Microscope className="h-5 w-5" />,
  },
  {
    title: "AI Suggestions",
    href: "/ai-suggestions",
    icon: <Wand2 className="h-5 w-5" />,
  },
  {
    title: "Feedback Analysis",
    href: "/feedback-analysis",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Intake Form",
    href: "/intake-form",
    icon: <FileInput className="h-5 w-5" />,
  },
];

interface MainNavigationProps {
  items: MainNavigationItemProps[];
}

export default function MainNavigation({ items }: MainNavigationProps) {
  return (
    <nav className="grid items-start px-2 text-sm font-medium">
      <div className="pb-4">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
          Main
        </h2>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
