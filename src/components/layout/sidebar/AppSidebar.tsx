
import { SidebarNavigation } from "./SidebarNavigation";
import { useLocation } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStatus } from "@/hooks/use-admin-status";

const AppSidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { profile, user } = useAuth();
  const { isAdmin } = useAdminStatus();

  // Enhanced admin status logging for debugging
  useEffect(() => {
    console.log("AppSidebar - Admin status:", {
      "profile?.role": profile?.role, 
      "isAdmin from hook": isAdmin,
      "user email": user?.email,
      "isInAdminList": user?.email && ['dylanmohseni0@gmail.com', 'admin@example.com'].includes(user.email),
      "current path": location.pathname
    });
  }, [profile, isAdmin, location.pathname, user]);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-xl">DezignSync</span>
          </div>
        </div>
        <div className="py-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarNavigation currentPath={location.pathname} />
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AppSidebar;
