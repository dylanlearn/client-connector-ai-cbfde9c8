
import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";

interface SettingsNavigationItemProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const settingsNavItems: SettingsNavigationItemProps[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SettingsNavigationProps {
  items: SettingsNavigationItemProps[];
}

const SettingsNavigation = ({ items }: SettingsNavigationProps) => {
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

export default SettingsNavigation;
