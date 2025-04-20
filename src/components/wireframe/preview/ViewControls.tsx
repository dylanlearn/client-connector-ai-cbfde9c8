
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Moon, 
  Download, 
  Link, 
  Copy, 
  Share2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';

interface ViewControlsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onExport?: () => void;
  exportOptions?: string[];
  onShare?: () => void;
  onCopyLink?: () => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({
  darkMode,
  onToggleDarkMode,
  onExport,
  exportOptions = ['PDF', 'PNG', 'HTML'],
  onShare,
  onCopyLink
}) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={darkMode}
            onPressedChange={onToggleDarkMode}
            size="sm"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          {darkMode ? 'Light mode' : 'Dark mode'}
        </TooltipContent>
      </Tooltip>
      
      {onExport && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Export options</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Export options</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {exportOptions.map((option) => (
              <DropdownMenuItem key={option} onClick={() => onExport()}>
                Export as {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {(onShare || onCopyLink) && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Share preview</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onCopyLink && (
              <DropdownMenuItem onClick={onCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
            )}
            {onShare && (
              <DropdownMenuItem onClick={onShare}>
                <Link className="h-4 w-4 mr-2" />
                Create shareable link
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ViewControls;
