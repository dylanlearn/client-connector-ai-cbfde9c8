
import { ReactNode, memo } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar/AppSidebar";
import FormResumeHandler from "../shared/FormResumeHandler";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  /**
   * Whether to show the FormResumeHandler component
   * @default true
   */
  showFormResumeHandler?: boolean;
}

/**
 * Base application layout component
 * Memoized to prevent unnecessary re-renders when children update
 */
const Layout = memo(({ 
  children, 
  className = "",
  showFormResumeHandler = true
}: LayoutProps) => {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";

  return (
    <SidebarProvider>
      <div className={`min-h-screen w-full flex flex-col md:flex-row ${className}`}>
        {!isIndexPage && <AppSidebar />}
        <main className={`flex-1 transition-all duration-300 ${!isIndexPage ? "ml-0 md:ml-64 pt-16 md:pt-0" : ""}`}>
          {showFormResumeHandler && !isIndexPage && <FormResumeHandler />}
          <div className="container mx-auto px-4 py-6 md:py-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
});

Layout.displayName = "Layout";

export default Layout;
