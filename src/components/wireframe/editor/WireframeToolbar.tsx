
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, Download, Code, Eye, PenTool, PanelLeft, PanelRight, Smartphone, Tablet, Monitor 
} from 'lucide-react';
import { useWireframeStore } from '@/stores/wireframe-store';

interface WireframeToolbarProps {
  viewMode: 'edit' | 'preview' | 'code';
  onViewModeChange: (mode: 'edit' | 'preview' | 'code') => void;
  onSave: () => void;
  onExport: (format: string) => void;
  isSaving: boolean;
  showSidebar: boolean;
  toggleSidebar: () => void;
}

const WireframeToolbar: React.FC<WireframeToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onSave,
  onExport,
  isSaving,
  showSidebar,
  toggleSidebar
}) => {
  const { activeDevice, setActiveDevice } = useWireframeStore();
  
  return (
    <div className="p-2 border-b flex items-center justify-between bg-muted/30">
      <div className="flex items-center space-x-2">
        <Tabs value={viewMode} onValueChange={(value) => onViewModeChange(value as any)}>
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <PenTool className="h-4 w-4" />
              <span>Edit</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span>Code</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center space-x-1">
          <Button
            variant={activeDevice === 'desktop' ? 'default' : 'outline'}
            size="sm"
            className="gap-1"
            onClick={() => setActiveDevice('desktop')}
          >
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Desktop</span>
          </Button>
          <Button
            variant={activeDevice === 'tablet' ? 'default' : 'outline'}
            size="sm"
            className="gap-1"
            onClick={() => setActiveDevice('tablet')}
          >
            <Tablet className="h-4 w-4" />
            <span className="hidden sm:inline">Tablet</span>
          </Button>
          <Button
            variant={activeDevice === 'mobile' ? 'default' : 'outline'}
            size="sm"
            className="gap-1"
            onClick={() => setActiveDevice('mobile')}
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Mobile</span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={toggleSidebar}>
          {showSidebar ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSave} 
          disabled={isSaving}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </Button>
        
        <Select onValueChange={onExport} defaultValue="">
          <SelectTrigger className="w-[140px] h-9">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <SelectValue placeholder="Export" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html">Export HTML</SelectItem>
            <SelectItem value="react">Export React</SelectItem>
            <SelectItem value="image">Export as Image</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default WireframeToolbar;
