
import React, { ReactNode, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items for both desktop sidebar and mobile menu
  const navItems = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Projects", path: "/projects" },
    { title: "Templates", path: "/templates" },
    { title: "Clients", path: "/clients" },
    { title: "Intake Form", path: "/intake-form" },
    { title: "Design Picker", path: "/design-picker" },
    { title: "Analytics", path: "/analytics" },
    { title: "AI Suggestions", path: "/ai-suggestions" },
    { title: "Feedback Analysis", path: "/feedback-analysis" },
    { title: "Website Analyzer", path: "/website-analyzer" },
    { title: "Settings", path: "/settings" },
  ];

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
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="flex items-center p-2 rounded-lg text-gray-900 hover:bg-gray-100"
                  >
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
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
          <button 
            onClick={toggleMobileMenu} 
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-20">
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform ease-in-out duration-300">
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold">Menu</span>
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className="block p-2 rounded-lg text-gray-900 hover:bg-gray-100"
                      onClick={toggleMobileMenu}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <button 
                onClick={handleSignOut}
                className="w-full text-center p-2 rounded-lg text-gray-900 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
