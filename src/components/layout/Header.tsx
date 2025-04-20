
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm fixed top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">Design System</Link>
        
        <nav className="hidden md:flex items-center gap-4">
          <Link 
            to="/" 
            className={`text-sm font-medium ${isActive('/')}`}
          >
            Responsive System
          </Link>
          <Link 
            to="/visual-states" 
            className={`text-sm font-medium ${isActive('/visual-states')}`}
          >
            Visual States
          </Link>
          <Link 
            to="/wireframe-generator" 
            className={`text-sm font-medium ${isActive('/wireframe-generator')}`}
          >
            Wireframe Generator
          </Link>
          <Link 
            to="/ai-suggestions" 
            className={`text-sm font-medium ${isActive('/ai-suggestions')}`}
          >
            AI Suggestions
          </Link>
          <Link 
            to="/design-process" 
            className={`text-sm font-medium ${isActive('/design-process')}`}
          >
            Design Process
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link 
              to="/dashboard" 
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
