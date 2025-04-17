
import React, { useState } from 'react';
import { 
  EnterpriseGridConfig, 
  GridBreakpoint,
  GridGuideConfig 
} from '../types/canvas-types';
import { DEFAULT_GRID_CONFIG, DEFAULT_GUIDE_CONFIG } from './EnterpriseGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, GridIcon, Columns, Rows, Maximize2, CheckSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface EnterpriseGridControlsProps {
  config: EnterpriseGridConfig;
  onChange: (config: Partial<EnterpriseGridConfig>) => void;
  guideConfig?: GridGuideConfig;
  onGuideConfigChange?: (config: Partial<GridGuideConfig>) => void;
  canvasWidth?: number;
  className?: string;
}

const EnterpriseGridControls: React.FC<EnterpriseGridControlsProps> = ({
  config,
  onChange,
  guideConfig = DEFAULT_GUIDE_CONFIG,
  onGuideConfigChange,
  canvasWidth,
  className
}) => {
  const [activeTab, setActiveTab] = useState('general');
  
  // Merge with defaults
  const gridConfig = { ...DEFAULT_GRID_CONFIG, ...config };
  const guides = { ...DEFAULT_GUIDE_CONFIG, ...guideConfig };
  
  // Get current active breakpoint
  const activeBreakpoint = gridConfig.responsive && canvasWidth 
    ? gridConfig.breakpoints.find(bp => bp.name === gridConfig.currentBreakpoint) 
    : null;

  // Toggle grid visibility
  const handleToggleVisibility = () => {
    onChange({ visible: !gridConfig.visible });
  };

  // Toggle snap to grid
  const handleToggleSnapToGrid = () => {
    onChange({ snapToGrid: !gridConfig.snapToGrid });
  };

  // Change grid type
  const handleGridTypeChange = (value: 'lines' | 'dots' | 'columns' | 'custom') => {
    onChange({ type: value });
  };

  // Change grid size
  const handleGridSizeChange = (value: number[]) => {
    onChange({ size: value[0] });
  };

  // Change grid color
  const handleColorChange = (value: string) => {
    onChange({ color: value });
  };

  // Change columns count
  const handleColumnsChange = (value: string) => {
    onChange({ columns: parseInt(value, 10) || 12 });
  };

  // Change gutter width
  const handleGutterWidthChange = (value: string) => {
    onChange({ gutterWidth: parseInt(value, 10) || 20 });
  };

  // Change margin width
  const handleMarginWidthChange = (value: string) => {
    onChange({ marginWidth: parseInt(value, 10) || 40 });
  };

  // Toggle responsive mode
  const handleToggleResponsive = () => {
    onChange({ responsive: !gridConfig.responsive });
  };

  // Change current breakpoint
  const handleBreakpointChange = (value: string) => {
    onChange({ currentBreakpoint: value });
  };

  // Update a breakpoint
  const handleBreakpointUpdate = (index: number, updates: Partial<GridBreakpoint>) => {
    const updatedBreakpoints = [...gridConfig.breakpoints];
    updatedBreakpoints[index] = { ...updatedBreakpoints[index], ...updates };
    onChange({ breakpoints: updatedBreakpoints });
  };

  // Toggle guides
  const handleToggleGuides = () => {
    if (onGuideConfigChange) {
      onGuideConfigChange({
        showVerticalGuides: !guides.showVerticalGuides,
        showHorizontalGuides: !guides.showHorizontalGuides
      });
    }
  };

  // Toggle snap to guides
  const handleToggleSnapToGuides = () => {
    if (onGuideConfigChange) {
      onGuideConfigChange({ snapToGuides: !guides.snapToGuides });
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GridIcon className="h-4 w-4" />
            Enterprise Grid System
          </div>
          
          {gridConfig.responsive && activeBreakpoint && (
            <Badge variant="secondary" className="font-normal">
              {activeBreakpoint.name}: {activeBreakpoint.columns} columns
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="columns">Columns</TabsTrigger>
            <TabsTrigger value="responsive">Responsive</TabsTrigger>
          </TabsList>
          
          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="grid-visibility" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Show Grid
              </Label>
              <Switch
                id="grid-visibility"
                checked={gridConfig.visible}
                onCheckedChange={handleToggleVisibility}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="snap-to-grid" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Snap to Grid
              </Label>
              <Switch
                id="snap-to-grid"
                checked={gridConfig.snapToGrid}
                onCheckedChange={handleToggleSnapToGrid}
              />
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-3">
              <Label htmlFor="grid-type">Grid Type</Label>
              <Select 
                value={gridConfig.type} 
                onValueChange={(value: any) => handleGridTypeChange(value)}
              >
                <SelectTrigger id="grid-type">
                  <SelectValue placeholder="Select grid type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lines">Lines</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="columns">Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="grid-size">Grid Size: {gridConfig.size}px</Label>
              </div>
              <Slider
                id="grid-size"
                min={5}
                max={50}
                step={5}
                value={[gridConfig.size]}
                onValueChange={handleGridSizeChange}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="grid-color">Grid Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="grid-color"
                  value={gridConfig.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 p-1 border rounded"
                />
                <Input
                  value={gridConfig.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="snap-threshold">Snap Threshold: {gridConfig.snapThreshold}px</Label>
              </div>
              <Slider
                id="snap-threshold"
                min={1}
                max={20}
                step={1}
                value={[gridConfig.snapThreshold]}
                onValueChange={(value) => onChange({ snapThreshold: value[0] })}
              />
            </div>
          </TabsContent>
          
          {/* Columns Tab */}
          <TabsContent value="columns" className="space-y-4">
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="column-count" className="text-xs">Columns</Label>
                  <Input
                    id="column-count"
                    type="number"
                    min={1}
                    max={24}
                    value={gridConfig.columns}
                    onChange={(e) => handleColumnsChange(e.target.value)}
                    className="h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gutter-width" className="text-xs">Gutter (px)</Label>
                  <Input
                    id="gutter-width"
                    type="number"
                    min={0}
                    max={100}
                    value={gridConfig.gutterWidth}
                    onChange={(e) => handleGutterWidthChange(e.target.value)}
                    className="h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="margin-width" className="text-xs">Margin (px)</Label>
                  <Input
                    id="margin-width"
                    type="number"
                    min={0}
                    max={200}
                    value={gridConfig.marginWidth}
                    onChange={(e) => handleMarginWidthChange(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              
              <div className="rounded-md border px-4 py-3 bg-muted/40">
                <div className="text-sm font-medium mb-2">Column Layout Preview</div>
                <div className="w-full h-12 bg-muted relative rounded overflow-hidden">
                  <div 
                    className="absolute h-full bg-primary/20 border-l border-r border-primary/30" 
                    style={{ 
                      left: `${(gridConfig.marginWidth / (canvasWidth || 600)) * 100}%`, 
                      width: `${((canvasWidth || 600) - (gridConfig.marginWidth * 2)) / (canvasWidth || 600) * 100}%` 
                    }}
                  ></div>
                  
                  {Array.from({ length: gridConfig.columns }).map((_, i) => {
                    const colWidth = ((canvasWidth || 600) - (gridConfig.marginWidth * 2) - ((gridConfig.columns - 1) * gridConfig.gutterWidth)) / gridConfig.columns;
                    const left = gridConfig.marginWidth + (i * (colWidth + gridConfig.gutterWidth));
                    const width = colWidth;
                    
                    return (
                      <div 
                        key={i} 
                        className="absolute h-full bg-primary/40" 
                        style={{ 
                          left: `${(left / (canvasWidth || 600)) * 100}%`, 
                          width: `${(width / (canvasWidth || 600)) * 100}%` 
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Responsive Tab */}
          <TabsContent value="responsive" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="responsive-grid" className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4" />
                Responsive Grid
              </Label>
              <Switch
                id="responsive-grid"
                checked={gridConfig.responsive}
                onCheckedChange={handleToggleResponsive}
              />
            </div>
            
            {gridConfig.responsive && (
              <>
                <Separator className="my-2" />
                
                <div className="space-y-3">
                  <Label htmlFor="current-breakpoint">Current Breakpoint</Label>
                  <Select 
                    value={gridConfig.currentBreakpoint} 
                    onValueChange={handleBreakpointChange}
                  >
                    <SelectTrigger id="current-breakpoint">
                      <SelectValue placeholder="Select breakpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      {gridConfig.breakpoints.map((bp) => (
                        <SelectItem key={bp.name} value={bp.name}>
                          {bp.name} ({bp.width}px)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Breakpoint Configuration</Label>
                  <div className="space-y-4">
                    {gridConfig.breakpoints.map((breakpoint, index) => (
                      <div key={breakpoint.name} className="rounded border p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{breakpoint.name}</div>
                          <Badge variant="outline">{breakpoint.width}px</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor={`bp-columns-${breakpoint.name}`} className="text-xs">
                              Columns
                            </Label>
                            <Input
                              id={`bp-columns-${breakpoint.name}`}
                              type="number"
                              min={1}
                              max={24}
                              value={breakpoint.columns}
                              onChange={(e) => handleBreakpointUpdate(index, { columns: parseInt(e.target.value, 10) || 12 })}
                              className="h-8 text-xs"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`bp-gutter-${breakpoint.name}`} className="text-xs">
                              Gutter (px)
                            </Label>
                            <Input
                              id={`bp-gutter-${breakpoint.name}`}
                              type="number"
                              min={0}
                              max={100}
                              value={breakpoint.gutterWidth}
                              onChange={(e) => handleBreakpointUpdate(index, { gutterWidth: parseInt(e.target.value, 10) || 20 })}
                              className="h-8 text-xs"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`bp-margin-${breakpoint.name}`} className="text-xs">
                              Margin (px)
                            </Label>
                            <Input
                              id={`bp-margin-${breakpoint.name}`}
                              type="number"
                              min={0}
                              max={200}
                              value={breakpoint.marginWidth}
                              onChange={(e) => handleBreakpointUpdate(index, { marginWidth: parseInt(e.target.value, 10) || 40 })}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnterpriseGridControls;
