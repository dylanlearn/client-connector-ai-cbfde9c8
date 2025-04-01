
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarHeader as SidebarHeaderWrapper,
  SidebarContent,
  SidebarFooter as SidebarFooterWrapper
} from "@/components/ui/sidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

const AppSidebar = () => {
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
};

export default AppSidebar;
