
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Users,
  FileText,
  Palette,
  BarChart3,
  BrainCircuit,
  MessageSquareText,
  Globe,
  Layout
} from "lucide-react";

export const mainNavItems = [
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
    title: "Wireframe Generator",
    href: "/wireframe-generator",
    icon: <Layout className="h-5 w-5" />,
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

// Define the interface for navigation items
export interface NavigationItemProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  items: NavigationItemProps[];
}

const MainNavigation = ({ items }: NavigationProps) => {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
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
  );
};

export default MainNavigation;
