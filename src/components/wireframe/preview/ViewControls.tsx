
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download } from 'lucide-react';

interface ViewControlsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onExport: () => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({ 
  darkMode, 
  onToggleDarkMode, 
  onExport 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onToggleDarkMode}
        className="flex items-center gap-1"
      >
        {darkMode ? (
          <>
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Light</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Dark</span>
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExport}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
    </div>
  );
};

export default ViewControls;
