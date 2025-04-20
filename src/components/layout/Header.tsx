
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm fixed top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">Design System</Link>
        
        <nav className="flex items-center gap-6">
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
            to="/projects" 
            className={`text-sm font-medium ${isActive('/projects')}`}
          >
            Projects
          </Link>
          <Link 
            to="/wireframes" 
            className={`text-sm font-medium ${isActive('/wireframes')}`}
          >
            Wireframes
          </Link>
          <Link 
            to="/settings" 
            className={`text-sm font-medium ${isActive('/settings')}`}
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
