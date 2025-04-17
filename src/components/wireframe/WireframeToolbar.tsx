
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider"
import { useWireframe } from '@/contexts/WireframeContext';
import { useWireframeStore } from '@/stores/wireframe-store';
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Settings, 
  Save, 
  Download, 
  Upload,
  GridIcon,
  Ruler,
  Magnet,
  Eye,
  EyeOff,
  Columns,
  Rows,
  Dot,
  Layout,
  SliderHorizontal,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface WireframeToolbarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onGridTypeChange?: (type: 'lines' | 'dots' | 'columns') => void;
  enterpriseGrid?: boolean;
  gridConfig?: any;
  onUpdateGridConfig?: (config: any) => void;
}

const WireframeToolbar: React.FC<WireframeToolbarProps> = ({ 
  onZoomIn, 
  onZoomOut, 
  onResetZoom,
  onExport,
  onImport,
  onGridTypeChange,
  enterpriseGrid = true,
  gridConfig,
  onUpdateGridConfig
}) => {
  const { zoomLevel, setZoomLevel, gridSize, setGridSize, toggleGrid, toggleSnapToGrid, showGrid, snapToGrid } = useWireframe();
  const { darkMode, showGrid: showGridStore, highlightSections, toggleDarkMode, toggleShowGrid, toggleHighlightSections } = useWireframeStore();
  const [gridSettingsOpen, setGridSettingsOpen] = useState(false);

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0] / 100);
  };

  const handleGridSizeChange = (value: number[]) => {
    setGridSize(value[0]);
    
    // Update enterprise grid config if available
    if (enterpriseGrid && onUpdateGridConfig && gridConfig) {
      onUpdateGridConfig({ ...gridConfig, size: value[0] });
    }
  };
  
  const handleGridOpacityChange = (value: number[]) => {
    if (enterpriseGrid && onUpdateGridConfig && gridConfig) {
      onUpdateGridConfig({ ...gridConfig, opacity: value[0] / 100 });
    }
  };
  
  const handleGridTypeChange = (type: 'lines' | 'dots' | 'columns') => {
    if (onGridTypeChange) {
      onGridTypeChange(type);
    }
    
    // Update enterprise grid config if available
    if (enterpriseGrid && onUpdateGridConfig && gridConfig) {
      onUpdateGridConfig({ ...gridConfig, type });
    }
  };
  
  const handleColumnsChange = (value: number[]) => {
    if (enterpriseGrid && onUpdateGridConfig && gridConfig) {
      onUpdateGridConfig({ ...gridConfig, columns: value[0] });
    }
  };
  
  const handleGutterWidthChange = (value: number[]) => {
    if (enterpriseGrid && onUpdateGridConfig && gridConfig) {
      onUpdateGridConfig({ ...gridConfig, gutterWidth: value[0] });
    }
  };
  
  const handleMarginWidthChange = (value: number[]) => {
    if (enterpriseGrid && onUpdateGridConfig && gridConfig) {
      onUpdateGridConfig({ ...gridConfig, marginWidth: value[0] });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-2 gap-2 bg-secondary/30 text-secondary-foreground border-b">
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="icon" onClick={onZoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onZoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onResetZoom} title="Reset Zoom">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 bg-background rounded-md px-2 py-1 text-xs">
          {(zoomLevel * 100).toFixed(0)}%
          <Slider
            defaultValue={[zoomLevel * 100]}
            max={200}
            min={25}
            step={5}
            onValueChange={handleZoomChange}
            className="w-[80px] inline-block"
          />
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {/* Grid Controls */}
        <Popover open={gridSettingsOpen} onOpenChange={setGridSettingsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" title="Grid Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0">
            <div className="p-2 border-b">
              <h4 className="font-medium text-sm">Grid Settings</h4>
            </div>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                {enterpriseGrid && <TabsTrigger value="columns">Columns</TabsTrigger>}
              </TabsList>
              <TabsContent value="basic" className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Grid</span>
                    <Toggle 
                      pressed={showGridStore} 
                      onPressedChange={toggleShowGrid}
                      aria-label="Toggle grid visibility"
                      size="sm"
                    >
                      {showGridStore ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Toggle>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Snap to Grid</span>
                    <Toggle 
                      pressed={snapToGrid} 
                      onPressedChange={toggleSnapToGrid}
                      aria-label="Toggle snap to grid"
                      size="sm"
                    >
                      <Magnet className="h-4 w-4" />
                    </Toggle>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Grid Size</span>
                      <span className="text-xs text-muted-foreground">{gridSize}px</span>
                    </div>
                    <Slider
                      defaultValue={[gridSize]}
                      value={[gridSize]}
                      max={50}
                      min={2}
                      step={1}
                      onValueChange={handleGridSizeChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm">Grid Type</span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <Button
                        variant={gridConfig?.type === 'lines' ? "default" : "outline"}
                        className="h-8"
                        onClick={() => handleGridTypeChange('lines')}
                      >
                        <GridIcon className="h-3 w-3 mr-1" /> Lines
                      </Button>
                      <Button
                        variant={gridConfig?.type === 'dots' ? "default" : "outline"}
                        className="h-8"
                        onClick={() => handleGridTypeChange('dots')}
                      >
                        <Dot className="h-3 w-3 mr-1" /> Dots
                      </Button>
                      <Button
                        variant={gridConfig?.type === 'columns' ? "default" : "outline"}
                        className="h-8"
                        onClick={() => handleGridTypeChange('columns')}
                      >
                        <Columns className="h-3 w-3 mr-1" /> Columns
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Grid Opacity</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((gridConfig?.opacity || 0.5) * 100)}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[Math.round((gridConfig?.opacity || 0.5) * 100)]}
                      max={100}
                      min={10}
                      step={5}
                      onValueChange={handleGridOpacityChange}
                      className="w-full"
                    />
                  </div>
                  
                  {enterpriseGrid && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Numbers</span>
                        <Toggle 
                          pressed={gridConfig?.showNumbers || false}
                          onPressedChange={(showNumbers) => 
                            onUpdateGridConfig?.({ ...gridConfig, showNumbers })
                          }
                          aria-label="Toggle grid numbers"
                          size="sm"
                        >
                          <SliderHorizontal className="h-4 w-4" />
                        </Toggle>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show Rulers</span>
                        <Toggle 
                          pressed={gridConfig?.showRulers || false}
                          onPressedChange={(showRulers) => 
                            onUpdateGridConfig?.({ ...gridConfig, showRulers })
                          }
                          aria-label="Toggle rulers"
                          size="sm"
                        >
                          <Ruler className="h-4 w-4" />
                        </Toggle>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Responsive</span>
                        <Toggle 
                          pressed={gridConfig?.responsive || false}
                          onPressedChange={(responsive) => 
                            onUpdateGridConfig?.({ ...gridConfig, responsive })
                          }
                          aria-label="Toggle responsive grid"
                          size="sm"
                        >
                          <Layout className="h-4 w-4" />
                        </Toggle>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              
              {enterpriseGrid && (
                <TabsContent value="columns" className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Columns</span>
                        <span className="text-xs text-muted-foreground">
                          {gridConfig?.columns || 12}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[gridConfig?.columns || 12]}
                        max={24}
                        min={1}
                        step={1}
                        onValueChange={handleColumnsChange}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Gutter Width</span>
                        <span className="text-xs text-muted-foreground">
                          {gridConfig?.gutterWidth || 20}px
                        </span>
                      </div>
                      <Slider
                        defaultValue={[gridConfig?.gutterWidth || 20]}
                        max={100}
                        min={0}
                        step={2}
                        onValueChange={handleGutterWidthChange}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Margin Width</span>
                        <span className="text-xs text-muted-foreground">
                          {gridConfig?.marginWidth || 40}px
                        </span>
                      </div>
                      <Slider
                        defaultValue={[gridConfig?.marginWidth || 40]}
                        max={200}
                        min={0}
                        step={4}
                        onValueChange={handleMarginWidthChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </PopoverContent>
        </Popover>

        <Toggle 
          pressed={showGridStore} 
          onPressedChange={toggleShowGrid}
          title="Toggle Grid"
          variant="outline"
          size="icon"
          aria-label="Toggle grid visibility"
        >
          <Grid className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={snapToGrid} 
          onPressedChange={toggleSnapToGrid}
          title="Snap to Grid"
          variant="outline"
          size="icon"
          aria-label="Toggle snap to grid"
        >
          <Magnet className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={darkMode} 
          onPressedChange={toggleDarkMode}
          title="Dark Mode"
          variant="outline"
          size="icon"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </Toggle>
        
        <Toggle 
          pressed={highlightSections} 
          onPressedChange={toggleHighlightSections}
          title="Highlight Sections"
          variant="outline"
          size="icon"
          aria-label="Toggle section highlighting"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Toggle>

        {onExport && (
          <Button 
            variant="outline" 
            size="icon" 
            title="Export" 
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        
        {onImport && (
          <Button 
            variant="outline" 
            size="icon" 
            title="Import" 
            onClick={onImport}
          >
            <Upload className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WireframeToolbar;
