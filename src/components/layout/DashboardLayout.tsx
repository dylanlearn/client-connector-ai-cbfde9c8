
import { memo } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AppSidebar from "./sidebar/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard-specific layout component with sidebar and header
 * Memoized to prevent unnecessary re-renders when children update
 */
const DashboardLayout = memo(({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        
        <SidebarInset>
          <div className="flex flex-col w-full">
            <DashboardHeader />
            <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
});

DashboardLayout.displayName = "DashboardLayout";

export default DashboardLayout;
