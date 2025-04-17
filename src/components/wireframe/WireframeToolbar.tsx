
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Eye, 
  Code, 
  PencilRuler, 
  Download, 
  SidebarOpen, 
  SidebarClose 
} from 'lucide-react';

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
  return (
    <div className="flex items-center justify-between p-2 border-b bg-muted/20">
      <Tabs value={viewMode} onValueChange={(v) => onViewModeChange(v as any)}>
        <TabsList>
          <TabsTrigger value="edit" className="flex items-center gap-1">
            <PencilRuler className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSave()}
          disabled={isSaving}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('html')}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-2"
        >
          {showSidebar ? (
            <SidebarClose className="h-4 w-4" />
          ) : (
            <SidebarOpen className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default WireframeToolbar;
