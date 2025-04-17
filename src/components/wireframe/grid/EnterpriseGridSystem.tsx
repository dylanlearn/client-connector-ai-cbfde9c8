
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Grid3x3, Grid, Save, Download, Upload, Copy, Trash, Plus, Eye, EyeOff, Ruler } from 'lucide-react';
import { 
  EnterpriseGridConfig, 
  GridBreakpoint,
  GridPreset,
  SnapGuideType
} from '../types/canvas-types';

// Default enterprise grid config
export const DEFAULT_ENTERPRISE_GRID_CONFIG: EnterpriseGridConfig = {
  visible: true,
  type: 'lines',
  size: 10,
  snapToGrid: true,
  snapThreshold: 5,
  color: '#e0e0e0',
  showGuides: true,
  showRulers: true,
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  responsive: true,
  breakpoints: [
    { name: 'xs', width: 480, columns: 4, gutterWidth: 16, marginWidth: 16, color: '#ff9eb1' },
    { name: 'sm', width: 640, columns: 6, gutterWidth: 16, marginWidth: 24, color: '#ffb992' },
    { name: 'md', width: 768, columns: 8, gutterWidth: 24, marginWidth: 24, color: '#ffde82' },
    { name: 'lg', width: 1024, columns: 12, gutterWidth: 24, marginWidth: 32, color: '#b8e986' },
    { name: 'xl', width: 1280, columns: 12, gutterWidth: 32, marginWidth: 40, color: '#93ddfd' },
    { name: '2xl', width: 1536, columns: 12, gutterWidth: 32, marginWidth: 48, color: '#d8b5ff' }
  ],
  currentBreakpoint: 'lg',
  opacity: 0.5,
  showNumbers: true,
  highlightEvery: 5
};

// Default grid presets
export const DEFAULT_GRID_PRESETS: GridPreset[] = [
  {
    id: 'material-design',
    name: 'Material Design',
    category: 'Design Systems',
    description: 'Google Material Design 8pt grid system',
    config: {
      ...DEFAULT_ENTERPRISE_GRID_CONFIG,
      size: 8,
      columns: 12,
      gutterWidth: 16,
      marginWidth: 24
    },
    tags: ['material', '8pt', 'google'],
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    isSystem: true,
    isDefault: true
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap Grid',
    category: 'Design Systems',
    description: 'Bootstrap 12-column grid system',
    config: {
      ...DEFAULT_ENTERPRISE_GRID_CONFIG,
      columns: 12,
      gutterWidth: 30,
      marginWidth: 15
    },
    tags: ['bootstrap', 'responsive', 'columns'],
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    isSystem: true
  },
  {
    id: 'pixel-perfect',
    name: 'Pixel Perfect',
    category: 'Design',
    description: 'Fine 1px grid for precise positioning',
    config: {
      ...DEFAULT_ENTERPRISE_GRID_CONFIG,
      size: 1,
      type: 'dots',
      highlightEvery: 10
    },
    tags: ['pixel', 'precise', 'detailed'],
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    isSystem: true
  }
];

interface EnterpriseGridSystemProps {
  /**
   * The fabric.js canvas instance
   */
  canvas: fabric.Canvas | null;
  /**
   * Initial grid configuration
   */
  initialConfig?: Partial<EnterpriseGridConfig>;
  /**
   * Canvas width
   */
  width: number;
  /**
   * Canvas height
   */
  height: number;
  /**
   * Callback when grid configuration changes
   */
  onConfigChange?: (config: EnterpriseGridConfig) => void;
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Enterprise-grade grid system component for wireframe editor
 */
export const EnterpriseGridSystem: React.FC<EnterpriseGridSystemProps> = ({
  canvas,
  initialConfig,
  width,
  height,
  onConfigChange,
  className
}) => {
  const { toast } = useToast();
  const gridRef = useRef<SVGSVGElement>(null);
  const [config, setConfig] = useState<EnterpriseGridConfig>({
    ...DEFAULT_ENTERPRISE_GRID_CONFIG,
    ...initialConfig
  });
  
  // Grid preset management state
  const [presets, setPresets] = useState<GridPreset[]>(DEFAULT_GRID_PRESETS);
  const [showPresetDialog, setShowPresetDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState('Custom');

  // Computed values based on config
  const computedLineColor = useMemo(() => {
    if (config.responsive) {
      const activeBreakpoint = config.breakpoints.find(bp => bp.name === config.currentBreakpoint);
      return activeBreakpoint?.color || config.color;
    }
    return config.color;
  }, [config.responsive, config.breakpoints, config.currentBreakpoint, config.color]);

  /**
   * Apply grid configuration changes
   */
  const updateConfig = useCallback((updates: Partial<EnterpriseGridConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      // Notify parent component of changes if callback provided
      if (onConfigChange) {
        onConfigChange(newConfig);
      }
      
      return newConfig;
    });
  }, [onConfigChange]);

  /**
   * Toggle grid visibility
   */
  const toggleGridVisibility = useCallback(() => {
    updateConfig({ visible: !config.visible });
    
    toast({
      title: config.visible ? "Grid Hidden" : "Grid Visible",
      description: config.visible ? "Grid is now hidden" : "Grid is now visible",
    });
  }, [config.visible, updateConfig, toast]);

  /**
   * Toggle snap to grid
   */
  const toggleSnapToGrid = useCallback(() => {
    updateConfig({ snapToGrid: !config.snapToGrid });
    
    toast({
      title: config.snapToGrid ? "Snap to Grid Disabled" : "Snap to Grid Enabled",
      description: config.snapToGrid 
        ? "Objects will move freely" 
        : "Objects will snap to grid points"
    });
  }, [config.snapToGrid, updateConfig, toast]);

  /**
   * Apply a grid preset
   */
  const applyPreset = useCallback((preset: GridPreset) => {
    updateConfig({
      ...preset.config,
      presetName: preset.name,
      presetCategory: preset.category
    });
    
    toast({
      title: "Grid Preset Applied",
      description: `Applied ${preset.name} grid preset`
    });
  }, [updateConfig, toast]);

  /**
   * Save current grid configuration as a preset
   */
  const saveAsPreset = useCallback(() => {
    if (!newPresetName.trim()) {
      toast({
        title: "Error",
        description: "Preset name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newPreset: GridPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName,
      category: newPresetCategory || 'Custom',
      description: `Custom grid preset (${config.type})`,
      config: { ...config },
      tags: [config.type, `${config.size}px`, `${config.columns}-columns`],
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
    
    setPresets(prev => [...prev, newPreset]);
    setShowPresetDialog(false);
    setNewPresetName('');
    
    // Save presets to localStorage for persistence
    try {
      localStorage.setItem('grid-presets', JSON.stringify([...presets, newPreset]));
    } catch (error) {
      console.error('Failed to save grid presets to localStorage', error);
    }
    
    toast({
      title: "Grid Preset Saved",
      description: `Saved "${newPresetName}" to your presets`
    });
  }, [newPresetName, newPresetCategory, config, presets, toast]);

  /**
   * Delete a grid preset
   */
  const deletePreset = useCallback((presetId: string) => {
    const presetToDelete = presets.find(p => p.id === presetId);
    
    // Prevent deleting system presets
    if (presetToDelete?.isSystem) {
      toast({
        title: "Cannot Delete System Preset",
        description: "System presets cannot be deleted",
        variant: "destructive"
      });
      return;
    }
    
    setPresets(prev => prev.filter(p => p.id !== presetId));
    
    // Update localStorage
    try {
      localStorage.setItem('grid-presets', JSON.stringify(
        presets.filter(p => p.id !== presetId)
      ));
    } catch (error) {
      console.error('Failed to update grid presets in localStorage', error);
    }
    
    toast({
      title: "Grid Preset Deleted",
      description: `Deleted "${presetToDelete?.name || 'preset'}" from your presets`
    });
  }, [presets, toast]);

  /**
   * Export grid configuration to JSON
   */
  const exportGridConfig = useCallback(() => {
    try {
      const dataStr = JSON.stringify(config, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = `grid-config-${config.type}-${new Date().getTime()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
      
      toast({
        title: "Grid Configuration Exported",
        description: `Exported to ${exportName}`
      });
    } catch (error) {
      console.error('Failed to export grid configuration', error);
      toast({
        title: "Export Failed",
        description: "Failed to export grid configuration",
        variant: "destructive"
      });
    }
  }, [config, toast]);

  /**
   * Import grid configuration from JSON file
   */
  const importGridConfig = useCallback(() => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement)?.files?.[0];
        
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedConfig = JSON.parse(event.target?.result as string);
            updateConfig(importedConfig);
            
            toast({
              title: "Grid Configuration Imported",
              description: "Successfully imported grid configuration"
            });
          } catch (parseError) {
            console.error('Failed to parse imported JSON', parseError);
            toast({
              title: "Import Failed",
              description: "Invalid JSON format",
              variant: "destructive"
            });
          }
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    } catch (error) {
      console.error('Failed to import grid configuration', error);
      toast({
        title: "Import Failed",
        description: "Failed to import grid configuration",
        variant: "destructive"
      });
    }
  }, [updateConfig, toast]);

  /**
   * Set the active breakpoint
   */
  const setBreakpoint = useCallback((breakpointName: string) => {
    const breakpoint = config.breakpoints.find(bp => bp.name === breakpointName);
    
    if (breakpoint) {
      updateConfig({ 
        currentBreakpoint: breakpointName,
        columns: breakpoint.columns,
        gutterWidth: breakpoint.gutterWidth,
        marginWidth: breakpoint.marginWidth
      });
      
      toast({
        title: "Breakpoint Changed",
        description: `Switched to ${breakpointName} breakpoint (${breakpoint.width}px)`
      });
    }
  }, [config.breakpoints, updateConfig, toast]);

  // Load saved presets from localStorage on component mount
  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem('grid-presets');
      
      if (savedPresets) {
        const parsedPresets = JSON.parse(savedPresets);
        // Merge system presets with saved presets, preventing duplicates
        const systemPresets = DEFAULT_GRID_PRESETS.filter(p => p.isSystem);
        const customPresets = parsedPresets.filter((p: GridPreset) => !p.isSystem);
        
        setPresets([...systemPresets, ...customPresets]);
      }
    } catch (error) {
      console.error('Failed to load grid presets from localStorage', error);
    }
  }, []);

  /**
   * Render the actual grid based on current configuration
   */
  const renderGridLines = useMemo(() => {
    if (!config.visible) return null;
    
    const lines = [];
    
    if (config.type === 'lines') {
      // Vertical lines
      for (let x = 0; x <= width; x += config.size) {
        const isHighlighted = config.highlightEvery && x % (config.size * config.highlightEvery) === 0;
        
        lines.push(
          <line
            key={`v-${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke={computedLineColor}
            strokeWidth={isHighlighted ? 1 : 0.5}
            strokeDasharray={config.dashPattern?.join(' ')}
            opacity={config.opacity}
          />
        );
        
        // Render grid numbers if enabled
        if (config.showNumbers && isHighlighted && x > 0) {
          lines.push(
            <text
              key={`vt-${x}`}
              x={x + 2}
              y={15}
              fontSize="10"
              fill={computedLineColor}
              opacity={0.8}
            >
              {x}
            </text>
          );
        }
      }
      
      // Horizontal lines
      for (let y = 0; y <= height; y += config.size) {
        const isHighlighted = config.highlightEvery && y % (config.size * config.highlightEvery) === 0;
        
        lines.push(
          <line
            key={`h-${y}`}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={computedLineColor}
            strokeWidth={isHighlighted ? 1 : 0.5}
            strokeDasharray={config.dashPattern?.join(' ')}
            opacity={config.opacity}
          />
        );
        
        // Render grid numbers if enabled
        if (config.showNumbers && isHighlighted && y > 0) {
          lines.push(
            <text
              key={`ht-${y}`}
              x={2}
              y={y - 2}
              fontSize="10"
              fill={computedLineColor}
              opacity={0.8}
            >
              {y}
            </text>
          );
        }
      }
    } else if (config.type === 'dots') {
      // Render grid as dots
      for (let x = config.size; x < width; x += config.size) {
        for (let y = config.size; y < height; y += config.size) {
          const isHighlighted = config.highlightEvery && 
            (x % (config.size * config.highlightEvery) === 0 || 
             y % (config.size * config.highlightEvery) === 0);
          
          lines.push(
            <circle
              key={`d-${x}-${y}`}
              cx={x}
              cy={y}
              r={isHighlighted ? 1.5 : 0.75}
              fill={computedLineColor}
              opacity={config.opacity}
            />
          );
        }
      }
    } else if (config.type === 'columns') {
      // Render column-based grid
      const columnWidth = (width - config.marginWidth * 2 - (config.columns - 1) * config.gutterWidth) / config.columns;
      let currentX = config.marginWidth;
      
      // Left margin
      lines.push(
        <rect
          key="margin-left"
          x={0}
          y={0}
          width={config.marginWidth}
          height={height}
          fill={computedLineColor}
          opacity={0.1}
        />
      );
      
      // Right margin
      lines.push(
        <rect
          key="margin-right"
          x={width - config.marginWidth}
          y={0}
          width={config.marginWidth}
          height={height}
          fill={computedLineColor}
          opacity={0.1}
        />
      );
      
      // Columns and gutters
      for (let i = 0; i < config.columns; i++) {
        // Column
        lines.push(
          <rect
            key={`col-${i}`}
            x={currentX}
            y={0}
            width={columnWidth}
            height={height}
            fill={computedLineColor}
            opacity={0.2}
          />
        );
        
        // Column number
        if (config.showNumbers) {
          lines.push(
            <text
              key={`col-num-${i}`}
              x={currentX + columnWidth / 2}
              y={15}
              fontSize="10"
              textAnchor="middle"
              fill={computedLineColor}
              opacity={0.8}
            >
              {i + 1}
            </text>
          );
        }
        
        currentX += columnWidth;
        
        // Gutter (except after the last column)
        if (i < config.columns - 1) {
          lines.push(
            <rect
              key={`gutter-${i}`}
              x={currentX}
              y={0}
              width={config.gutterWidth}
              height={height}
              fill={computedLineColor}
              opacity={0.1}
            />
          );
          
          currentX += config.gutterWidth;
        }
      }
      
      // Responsive breakpoints indicator
      if (config.responsive) {
        config.breakpoints.forEach((bp, index) => {
          lines.push(
            <line
              key={`bp-${bp.name}`}
              x1={bp.width}
              y1={0}
              x2={bp.width}
              y2={height}
              stroke={bp.color || computedLineColor}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              opacity={0.8}
            />
          );
          
          lines.push(
            <text
              key={`bp-text-${bp.name}`}
              x={bp.width - 5}
              y={25}
              fontSize="10"
              textAnchor="end"
              fill={bp.color || computedLineColor}
              opacity={1}
            >
              {bp.name} ({bp.width}px)
            </text>
          );
        });
      }
    }
    
    return lines;
  }, [
    config.visible, config.type, config.size, config.columns, 
    config.gutterWidth, config.marginWidth, config.opacity,
    config.showNumbers, config.highlightEvery, config.dashPattern,
    config.responsive, config.breakpoints, computedLineColor,
    width, height
  ]);

  // Apply grid to canvas when configuration changes
  useEffect(() => {
    if (!canvas) return;
    
    // Update canvas grid settings in Fabric.js
    if (config.snapToGrid) {
      // Set up grid snapping on the canvas
      canvas.on('object:moving', (e) => {
        if (!config.snapToGrid || !e.target) return;
        
        const target = e.target;
        const gridSize = config.size;
        const threshold = config.snapThreshold;
        
        // Calculate snap points - adjust for zoom level
        const snapX = Math.round(target.left! / gridSize) * gridSize;
        const snapY = Math.round(target.top! / gridSize) * gridSize;
        
        // Check if we're within threshold
        if (Math.abs(target.left! - snapX) <= threshold) {
          target.set({ left: snapX });
        }
        
        if (Math.abs(target.top! - snapY) <= threshold) {
          target.set({ top: snapY });
        }
      });
    } else {
      // Remove grid snapping event handler
      canvas.off('object:moving');
    }
    
    // Note: The actual grid visualization is handled by SVG overlay
    // and not by Fabric.js itself for better performance
    
    return () => {
      // Clean up event handlers when component unmounts
      canvas.off('object:moving');
    };
  }, [canvas, config.snapToGrid, config.size, config.snapThreshold]);

  // Load presets from localStorage on component mount
  useEffect(() => {
    const loadGridPresetsFromStorage = () => {
      try {
        const storedPresets = localStorage.getItem('enterprise-grid-presets');
        if (storedPresets) {
          const parsedPresets = JSON.parse(storedPresets);
          // Merge with default presets, giving priority to user presets
          const mergedPresets = [
            ...DEFAULT_GRID_PRESETS.filter(dp => 
              !parsedPresets.some((pp: GridPreset) => pp.id === dp.id)
            ),
            ...parsedPresets
          ];
          setPresets(mergedPresets);
        }
      } catch (error) {
        console.error('Failed to load grid presets from storage:', error);
      }
    };
    
    loadGridPresetsFromStorage();
  }, []);

  if (!config.visible) {
    return (
      <div className={cn("absolute top-4 right-4 z-50", className)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleGridVisibility}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show Grid</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <>
      {/* SVG Grid Overlay - Highly performant even on large canvases */}
      <svg 
        ref={gridRef}
        className={cn(
          "absolute top-0 left-0 w-full h-full pointer-events-none z-0",
          className
        )}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderGridLines}
      </svg>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleGridVisibility}
                className="bg-background/80 backdrop-blur-sm"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hide Grid</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={config.snapToGrid ? "default" : "outline"}
                size="icon" 
                onClick={toggleSnapToGrid}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Ruler className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{config.snapToGrid ? "Disable" : "Enable"} Snap to Grid</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Grid Presets</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenuContent className="w-56">
            {presets.map((preset) => (
              <DropdownMenuItem 
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="flex justify-between items-center"
              >
                <span>{preset.name}</span>
                {!preset.isSystem && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuItem onClick={() => setShowPresetDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Save Current as Preset...</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={exportGridConfig}>
              <Download className="mr-2 h-4 w-4" />
              <span>Export Grid Configuration</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={importGridConfig}>
              <Upload className="mr-2 h-4 w-4" />
              <span>Import Grid Configuration</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Responsive breakpoint controls (when in column mode) */}
      {config.type === 'columns' && config.responsive && (
        <div className="absolute bottom-4 left-4 z-50 flex flex-wrap gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-md">
          {config.breakpoints.map((breakpoint) => (
            <Button
              key={breakpoint.name}
              variant={breakpoint.name === config.currentBreakpoint ? "default" : "outline"}
              size="sm"
              onClick={() => setBreakpoint(breakpoint.name)}
              style={{ 
                borderColor: breakpoint.color,
                backgroundColor: breakpoint.name === config.currentBreakpoint ? breakpoint.color : undefined,
                color: breakpoint.name === config.currentBreakpoint ? '#ffffff' : breakpoint.color 
              }}
            >
              {breakpoint.name} ({breakpoint.width}px)
            </Button>
          ))}
        </div>
      )}
      
      {/* Save Preset Dialog */}
      <Dialog open={showPresetDialog} onOpenChange={setShowPresetDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Grid Preset</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="preset-name" className="text-right">
                Name
              </Label>
              <Input
                id="preset-name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="preset-category" className="text-right">
                Category
              </Label>
              <Input
                id="preset-category"
                value={newPresetCategory}
                onChange={(e) => setNewPresetCategory(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPresetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveAsPreset}>
              <Save className="mr-2 h-4 w-4" />
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnterpriseGridSystem;
