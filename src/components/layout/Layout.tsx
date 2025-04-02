
import { ReactNode, memo } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import FormResumeHandler from "../shared/FormResumeHandler";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Base application layout component
 * Memoized to prevent unnecessary re-renders when children update
 */
const Layout = memo(({ children }: LayoutProps) => {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        {!isIndexPage && <FormResumeHandler />}
        {children}
      </div>
    </SidebarProvider>
  );
});

Layout.displayName = "Layout";

export default Layout;
