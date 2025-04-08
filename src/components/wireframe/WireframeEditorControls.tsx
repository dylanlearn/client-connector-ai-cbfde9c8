
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Sun, 
  Moon, 
  Grid, 
  Save,
  Download,
  Copy,
  Eye,
  FileText
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { PDFExportDialog } from '@/components/export/PDFExportDialog';

interface WireframeEditorControlsProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
  showGrid: boolean;
  onShowGridToggle: () => void;
  highlightSections: boolean;
  onHighlightSectionsToggle: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onCopyJson?: () => void;
}

const WireframeEditorControls: React.FC<WireframeEditorControlsProps> = ({
  darkMode,
  onDarkModeToggle,
  deviceType,
  onDeviceChange,
  showGrid,
  onShowGridToggle,
  highlightSections,
  onHighlightSectionsToggle,
  onSave,
  onExport,
  onCopyJson
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 border rounded-md bg-background">
      <div className="flex items-center gap-2">
        <Tabs 
          value={deviceType} 
          onValueChange={(v) => onDeviceChange(v as 'desktop' | 'tablet' | 'mobile')}
          className="w-auto"
        >
          <TabsList className="h-8">
            <TabsTrigger value="desktop" className="h-7 px-2">
              <Monitor className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2 text-xs">Desktop</span>
            </TabsTrigger>
            <TabsTrigger value="tablet" className="h-7 px-2">
              <Tablet className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2 text-xs">Tablet</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="h-7 px-2">
              <Smartphone className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2 text-xs">Mobile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-1">
          <Toggle 
            pressed={darkMode}
            onPressedChange={onDarkModeToggle}
            size="sm" 
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Toggle>
          
          <Toggle 
            pressed={showGrid}
            onPressedChange={onShowGridToggle}
            size="sm" 
            aria-label="Toggle grid"
          >
            <Grid className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            pressed={highlightSections}
            onPressedChange={onHighlightSectionsToggle}
            size="sm" 
            aria-label="Highlight sections"
          >
            <Eye className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onSave && (
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={onSave} 
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        )}
        
        {onCopyJson && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onCopyJson} 
            className="h-8"
          >
            <Copy className="h-4 w-4 mr-1" /> Copy JSON
          </Button>
        )}
        
        <PDFExportDialog 
          contentId="wireframe-canvas"
          filename="wireframe-design"
          trigger={
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8"
            >
              <FileText className="h-4 w-4 mr-1" /> Export PDF
            </Button>
          }
        />
        
        {onExport && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onExport} 
            className="h-8"
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        )}
      </div>
    </div>
  );
};

export default WireframeEditorControls;
