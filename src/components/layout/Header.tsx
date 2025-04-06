
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Wand2, Palette } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* Logo and main navigation */}
          <Link to="/" className="font-semibold">
            Design AI
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/projects" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Projects
            </Link>
            <Link to="/ai-suggestions" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              AI Suggestions
            </Link>
            <Link 
              to="/design-process" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Wand2 className="h-3 w-3" />
              Client Design Process
            </Link>
            <Link 
              to="/design-picker" 
              className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
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
        </div>
      </div>
    </header>
  );
};

export default Header;
