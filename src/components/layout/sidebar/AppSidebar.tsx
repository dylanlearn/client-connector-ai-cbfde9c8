
import { useLocation } from "react-router-dom";
import { memo } from "react";
import {
  Sidebar,
  SidebarHeader as SidebarHeaderWrapper,
  SidebarContent,
  SidebarFooter as SidebarFooterWrapper
} from "@/components/ui/sidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

/**
 * Main application sidebar component
 * Memoized to prevent unnecessary re-renders during page navigation
 */
const AppSidebar = memo(() => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar>
      <SidebarHeaderWrapper className="px-2 py-4">
        <SidebarHeader />
      </SidebarHeaderWrapper>
      
      <SidebarContent>
        <SidebarNavigation currentPath={currentPath} />
      </SidebarContent>
      
      <SidebarFooterWrapper>
        <SidebarFooter currentPath={currentPath} />
      </SidebarFooterWrapper>
    </Sidebar>
  );
});

AppSidebar.displayName = "AppSidebar";

export default AppSidebar;
