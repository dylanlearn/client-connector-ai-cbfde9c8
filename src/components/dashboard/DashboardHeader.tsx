
import { HeaderNavLinks } from "./header/HeaderNavLinks";
import { PlanBadge } from "./header/PlanBadge";
import { UserMenu } from "./header/UserMenu";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Header component for the dashboard layout
 * Provides navigation, user menu, and subscription status
 */
const DashboardHeader = () => {
  const { status } = useSubscription();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Determine if the user is on a pro plan
  const isPro = status === 'sync-pro';

  return (
    <header className="sticky top-0 z-30 border-b bg-white dark:bg-gray-800 flex items-center justify-between px-4 md:px-6 h-16">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="hidden md:inline">DezignSync</span>
        </Link>
        
        <HeaderNavLinks />
      </div>
      
      <div className="flex items-center gap-4">
        <PlanBadge isPro={isPro} />
        <UserMenu />
      </div>
      
      {/* Mobile navigation overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 w-64 h-full p-4" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4 p-2">
              <Link 
                to="/dashboard" 
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/projects" 
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/website-analyzer" 
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Website Analyzer
              </Link>
              <Link 
                to="/ai-suggestions" 
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Assistant
              </Link>
              <Link 
                to="/settings" 
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
