
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { user, signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'bg-gray-100 text-blue-600' 
      : 'text-gray-600 hover:text-blue-500';
  };

  const handleSignOut = async () => {
    try {
      await signOut?.();
      navigate("/login");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm fixed top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">DezignSync</Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className={`text-sm font-medium ${isActive('/')}`}>Home</Link>
          <Link to="/wireframe-enhancements" className={`text-sm font-medium ${isActive('/wireframe-enhancements')}`}>Wireframe Demo</Link>
          <Link to="/wireframe-dashboard" className={`text-sm font-medium ${isActive('/wireframe-dashboard')}`}>Wireframe Dashboard</Link>
          <Link to="/responsive-system" className={`text-sm font-medium ${isActive('/responsive-system')}`}>Responsive System</Link>
          <Link to="/visual-states" className={`text-sm font-medium ${isActive('/visual-states')}`}>Visual States</Link>
        </nav>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Dashboard
              </Link>
              <Link to="/settings" className="text-sm font-medium bg-gray-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100">
                Settings
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
