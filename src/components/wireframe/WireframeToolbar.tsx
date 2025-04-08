
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useWireframeStore } from '@/stores/wireframe-store';
import { 
  Save, 
  Download, 
  Copy, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Sun, 
  Moon,
  EyeIcon,
  Grid3X3,
  PanelLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface WireframeToolbarProps {
  onSave: () => Promise<any>;
}

const WireframeToolbar: React.FC<WireframeToolbarProps> = ({ onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { 
    wireframe, 
    updateWireframe,
    activeDevice, 
    setActiveDevice,
    darkMode,
    toggleDarkMode,
    showGrid,
    toggleShowGrid,
    highlightSections,
    toggleHighlightSections
  } = useWireframeStore();
  
  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateWireframe({ title: e.target.value });
  };
  
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(wireframe, null, 2));
    toast.success("Wireframe JSON copied to clipboard");
  };
  
  return (
    <div className="wireframe-toolbar p-4 border rounded-md bg-background shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="wireframe-title" className="mb-2 block text-sm">Wireframe Title</Label>
          <Input 
            id="wireframe-title"
            value={wireframe?.title || ''}
            onChange={handleTitleChange}
            placeholder="Enter wireframe title"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="default" onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Wireframe'}
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid gap-2">
              <Button variant="ghost" className="justify-start" onClick={handleCopyJson}>
                <Copy className="h-4 w-4 mr-2" />
                Copy as JSON
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {activeDevice === 'desktop' && <Monitor className="h-4 w-4 mr-2" />}
              {activeDevice === 'tablet' && <Tablet className="h-4 w-4 mr-2" />}
              {activeDevice === 'mobile' && <Smartphone className="h-4 w-4 mr-2" />}
              {activeDevice}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setActiveDevice('desktop')}>
              <Monitor className="h-4 w-4 mr-2" /> Desktop
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveDevice('tablet')}>
              <Tablet className="h-4 w-4 mr-2" /> Tablet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveDevice('mobile')}>
              <Smartphone className="h-4 w-4 mr-2" /> Mobile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleShowGrid}
          title={showGrid ? "Hide Grid" : "Show Grid"}
          className={showGrid ? "bg-muted" : ""}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleHighlightSections}
          title={highlightSections ? "Hide Section Outlines" : "Show Section Outlines"}
          className={highlightSections ? "bg-muted" : ""}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WireframeToolbar;
