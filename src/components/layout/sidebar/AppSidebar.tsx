
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
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="py-4 h-full overflow-y-auto">
          <SidebarNavigation currentPath={location.pathname} />
        </div>
      </aside>

      {/* Mobile sidebar toggle - positioned below the header */}
      <button
        className="fixed top-20 left-4 z-40 md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden mt-16" 
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AppSidebar;
