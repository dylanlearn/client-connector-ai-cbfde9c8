
import { ReactNode, memo } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import FormResumeHandler from "../shared/FormResumeHandler";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
};

// Use memo to prevent unnecessary re-renders
export default memo(Layout);
