
import { useAdminStatus } from "@/hooks/use-admin-status";
import MainNavigation, { mainNavItems } from "./navigation/MainNavigation";
import AdminNavigation from "./navigation/AdminNavigation";
import SettingsNavigation, { settingsNavItems } from "./navigation/SettingsNavigation";

interface SidebarNavigationProps {
  currentPath: string;
}

export const SidebarNavigation = ({ currentPath }: SidebarNavigationProps) => {
  const { isAdmin } = useAdminStatus();

  return (
    <nav className="mt-4 px-2">
      <MainNavigation items={mainNavItems} />
      
      {/* Admin section */}
      {isAdmin && (
        <ul className="mt-4 space-y-1">
          <AdminNavigation currentPath={currentPath} />
        </ul>
      )}
      
      {/* Settings */}
      <div className="mt-4">
        <SettingsNavigation items={settingsNavItems} />
      </div>
    </nav>
  );
};
