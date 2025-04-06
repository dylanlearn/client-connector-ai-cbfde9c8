
import MainNavigation, { mainNavItems } from "./navigation/MainNavigation";
import AdminNavigation from "./navigation/AdminNavigation";
import SettingsNavigation, { settingsNavItems } from "./navigation/SettingsNavigation";
import PermissionGate from "@/components/auth/PermissionGate";
import { Permission } from "@/utils/authorization/auth-service";

interface SidebarNavigationProps {
  currentPath: string;
}

export const SidebarNavigation = ({ currentPath }: SidebarNavigationProps) => {
  return (
    <nav className="mt-4 px-2">
      <MainNavigation items={mainNavItems} />
      
      {/* Admin section - only visible to admins */}
      <PermissionGate permission={Permission.VIEW_ADMIN_PANEL}>
        <ul className="mt-4 space-y-1">
          <AdminNavigation currentPath={currentPath} />
        </ul>
      </PermissionGate>
      
      {/* Settings */}
      <div className="mt-4">
        <SettingsNavigation items={settingsNavItems} />
      </div>
    </nav>
  );
};
