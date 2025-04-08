
import React from 'react';
import { 
  Layers, Move, Grid, Trash, Undo, Redo, Save, Sun, Moon,
  Smartphone, Tablet, Monitor, Eye, EyeOff 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeExportMenu } from './export/WireframeExportMenu';

interface WireframeToolbarProps {
  onSave?: () => Promise<void>;
}

const WireframeToolbar: React.FC<WireframeToolbarProps> = ({ onSave }) => {
  const { 
    activeDevice, 
    setActiveDevice,
    toggleShowGrid,
    showGrid,
    darkMode,
    toggleDarkMode,
    undo,
    redo,
    history,
    wireframe,
    hideAllSections,
    showAllSections,
    hiddenSections
  } = useWireframeStore();

  // Calculate if all sections are currently hidden
  const allSectionsHidden = wireframe.sections && 
    wireframe.sections.length > 0 && 
    hiddenSections.length === wireframe.sections.length;

  // Calculate if any sections are currently hidden
  const anySectionsHidden = hiddenSections.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-card rounded-lg shadow-sm border">
      {/* Device Selection */}
      <div className="flex items-center mr-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={activeDevice === 'desktop' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setActiveDevice('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Desktop View</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={activeDevice === 'tablet' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setActiveDevice('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tablet View</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={activeDevice === 'mobile' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setActiveDevice('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mobile View</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Display Options */}
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showGrid ? 'default' : 'ghost'}
              size="icon"
              onClick={toggleShowGrid}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Grid</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={darkMode ? 'default' : 'ghost'}
              size="icon"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{darkMode ? 'Light Mode' : 'Dark Mode'}</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={allSectionsHidden ? showAllSections : hideAllSections}
              disabled={!wireframe.sections || wireframe.sections.length === 0}
            >
              {allSectionsHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {allSectionsHidden ? 'Show All Sections' : 'Hide All Sections'}
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />
      
      {/* History */}
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={history.past.length === 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={history.future.length === 0}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex-1"></div>

      {/* Export Menu */}
      <WireframeExportMenu wireframeData={wireframe} buttonSize="sm" />
      
      {/* Save */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="ml-2"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </TooltipTrigger>
        <TooltipContent>Save Wireframe</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default WireframeToolbar;
