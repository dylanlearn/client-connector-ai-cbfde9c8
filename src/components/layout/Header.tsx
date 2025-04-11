
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Wand2, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Function to determine if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full border-b bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* Logo and main navigation */}
          <Link to="/" className="font-semibold">
            Design AI
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActiveLink("/dashboard") ? "text-primary" : "text-gray-700 dark:text-gray-300"
              )}
            >
              Dashboard
            </Link>
            <Link 
              to="/projects" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActiveLink("/projects") ? "text-primary" : "text-gray-700 dark:text-gray-300"
              )}
            >
              Projects
            </Link>
            <Link 
              to="/ai-suggestions" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActiveLink("/ai-suggestions") ? "text-primary" : "text-gray-700 dark:text-gray-300"
              )}
            >
              AI Suggestions
            </Link>
            <Link 
              to="/design-process" 
              className={cn(
                "text-sm font-medium flex items-center gap-1 transition-colors hover:text-blue-800",
                isActiveLink("/design-process") ? "text-blue-800" : "text-blue-600"
              )}
            >
              <Wand2 className="h-3 w-3" />
              Client Design Process
            </Link>
            <Link 
              to="/design-picker" 
              className={cn(
                "text-sm font-medium flex items-center gap-1 transition-colors hover:text-purple-800",
                isActiveLink("/design-picker") ? "text-purple-800" : "text-purple-600"
              )}
            >
              <Palette className="h-3 w-3" />
              Design Picker
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/intake-form" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Intake Form
            </Link>
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden"
            onClick={() => document.documentElement.classList.toggle('sidebar-open')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation drawer */}
      <div className="md:hidden fixed inset-0 bg-black/50 z-40 translate-x-full transition-transform sidebar-open:translate-x-0">
        <div className="w-64 h-full bg-white dark:bg-gray-800 ml-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold">Menu</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => document.documentElement.classList.remove('sidebar-open')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          
          <nav className="flex flex-col gap-4">
            <Link 
              to="/dashboard" 
              className="text-sm font-medium py-2"
              onClick={() => document.documentElement.classList.remove('sidebar-open')}
            >
              Dashboard
            </Link>
            <Link 
              to="/projects" 
              className="text-sm font-medium py-2"
              onClick={() => document.documentElement.classList.remove('sidebar-open')}
            >
              Projects
            </Link>
            <Link 
              to="/ai-suggestions" 
              className="text-sm font-medium py-2"
              onClick={() => document.documentElement.classList.remove('sidebar-open')}
            >
              AI Suggestions
            </Link>
            <Link 
              to="/design-process" 
              className="text-sm font-medium py-2 flex items-center gap-1 text-blue-600"
              onClick={() => document.documentElement.classList.remove('sidebar-open')}
            >
              <Wand2 className="h-3 w-3" />
              Client Design Process
            </Link>
            <Link 
              to="/design-picker" 
              className="text-sm font-medium py-2 flex items-center gap-1 text-purple-600"
              onClick={() => document.documentElement.classList.remove('sidebar-open')}
            >
              <Palette className="h-3 w-3" />
              Design Picker
            </Link>
            <Link 
              to="/intake-form" 
              className="text-sm font-medium py-2 flex items-center gap-1"
              onClick={() => document.documentElement.classList.remove('sidebar-open')}
            >
              <FileText className="h-4 w-4" />
              Intake Form
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
