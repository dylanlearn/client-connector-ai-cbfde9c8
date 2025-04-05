
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 p-4 border-b">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-xl">DezignSync</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/dashboard" 
                  className="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100"
                >
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a 
                  href="/projects" 
                  className="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100"
                >
                  <span>Projects</span>
                </a>
              </li>
              <li>
                <a 
                  href="/templates" 
                  className="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100"
                >
                  <span>Templates</span>
                </a>
              </li>
              <li>
                <a 
                  href="/settings" 
                  className="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100"
                >
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
          
          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {user?.email || "User"}
                </p>
              </div>
              <button 
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-xl">DezignSync</span>
          </div>
          {/* Mobile menu button */}
          <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
