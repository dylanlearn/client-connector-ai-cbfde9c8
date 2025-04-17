
import React from 'react';
import { fabric } from 'fabric';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedCanvasEngine from './canvas/EnhancedCanvasEngine';
import EnhancedLayerManager from './EnhancedLayerManager';
import { useGridActions } from '@/hooks/fabric/use-grid-actions';
import { WireframeCanvasConfig } from './utils/types';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface WireframeEditorWithGridProps {
  width?: number;
  height?: number;
  className?: string;
  onSectionClick?: (id: string, section: any) => void;
}

const WireframeEditorWithGrid: React.FC<WireframeEditorWithGridProps> = ({
  width = 1200,
  height = 800,
  className,
  onSectionClick
}) => {
  const [canvasInstance, setCanvasInstance] = useState<fabric.Canvas | null>(null);
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    width,
    height,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
    gridType: 'lines',
    snapTolerance: 5,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    gridColor: '#e0e0e0',
    // New smart guide settings
    guideColor: 'rgba(0, 120, 255, 0.8)',
    showEdgeGuides: true,
    showCenterGuides: true, 
    showDistanceIndicators: true,
    magneticStrength: 7 // 0-10 scale
  });
  
  const gridActions = useGridActions(
    (updates) => setCanvasConfig(prev => ({ ...prev, ...updates })),
    canvasConfig
  );

  return (
    <div className={className}>
      <Tabs defaultValue="canvas">
        <TabsList>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="grid">Grid Settings</TabsTrigger>
          <TabsTrigger value="guides">Smart Guides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="canvas" className="flex gap-4">
          <Card className="flex-1">
            <CardContent className="p-0">
              <EnhancedCanvasEngine
                width={width}
                height={height}
                canvasConfig={canvasConfig}
                onCanvasReady={setCanvasInstance}
              />
            </CardContent>
          </Card>
          
          {canvasInstance && (
            <EnhancedLayerManager 
              canvas={canvasInstance}
              className="w-[300px] shrink-0"
              maxHeight={600}
            />
          )}
        </TabsContent>
        
        <TabsContent value="grid" className="flex gap-4">
          <Card className="p-4 space-y-4">
            <h3 className="text-lg font-medium">Grid Configuration</h3>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={canvasConfig.showGrid} 
                  onChange={gridActions.toggleGrid} 
                />
                Show Grid
              </label>
              
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={canvasConfig.snapToGrid} 
                  onChange={gridActions.toggleSnapToGrid} 
                />
                Snap to Grid
              </label>
            </div>
            
            <div>
              <label htmlFor="grid-size" className="block mb-1">
                Grid Size: {canvasConfig.gridSize}px
              </label>
              <input
                id="grid-size"
                type="range"
                min="5"
                max="50"
                value={canvasConfig.gridSize}
                onChange={(e) => gridActions.setGridSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Grid Type</label>
              <select 
                value={canvasConfig.gridType} 
                onChange={(e) => gridActions.setGridType(e.target.value as 'lines' | 'dots' | 'columns')}
                className="w-full p-2 border rounded"
              >
                <option value="lines">Lines</option>
                <option value="dots">Dots</option>
                <option value="columns">Columns</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="grid-color" className="block mb-1">
                Grid Color
              </label>
              <input
                id="grid-color"
                type="color"
                value={canvasConfig.gridColor}
                onChange={(e) => gridActions.setGridColor(e.target.value)}
                className="w-full"
              />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides" className="flex gap-4">
          <Card className="p-4 space-y-4 w-full">
            <h3 className="text-lg font-medium">Smart Guides Configuration</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="smart-guides"
                  checked={canvasConfig.showSmartGuides}
                  onCheckedChange={(checked) => 
                    setCanvasConfig(prev => ({ ...prev, showSmartGuides: checked }))
                  }
                />
                <Label htmlFor="smart-guides">Enable Smart Guides</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edge-guides" 
                  checked={!!canvasConfig.showEdgeGuides}
                  onCheckedChange={(checked) => 
                    setCanvasConfig(prev => ({ ...prev, showEdgeGuides: checked }))
                  }
                  disabled={!canvasConfig.showSmartGuides}
                />
                <Label htmlFor="edge-guides">Edge Alignment</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="center-guides"
                  checked={!!canvasConfig.showCenterGuides}
                  onCheckedChange={(checked) => 
                    setCanvasConfig(prev => ({ ...prev, showCenterGuides: checked }))
                  }
                  disabled={!canvasConfig.showSmartGuides}
                />
                <Label htmlFor="center-guides">Center Alignment</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="distance-indicators"
                  checked={!!canvasConfig.showDistanceIndicators}
                  onCheckedChange={(checked) => 
                    setCanvasConfig(prev => ({ ...prev, showDistanceIndicators: checked }))
                  }
                  disabled={!canvasConfig.showSmartGuides}
                />
                <Label htmlFor="distance-indicators">Distance Indicators</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="snap-tolerance" className="block">
                  Snap Tolerance: {canvasConfig.snapTolerance}px
                </Label>
                <Slider
                  id="snap-tolerance"
                  min={1}
                  max={20}
                  step={1}
                  value={[canvasConfig.snapTolerance]}
                  onValueChange={([value]) => 
                    setCanvasConfig(prev => ({ ...prev, snapTolerance: value }))
                  }
                  disabled={!canvasConfig.showSmartGuides}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="magnetic-strength" className="block">
                  Magnetic Strength: {canvasConfig.magneticStrength || 5}
                </Label>
                <Slider
                  id="magnetic-strength"
                  min={1}
                  max={10}
                  step={1}
                  value={[canvasConfig.magneticStrength || 5]}
                  onValueChange={([value]) => 
                    setCanvasConfig(prev => ({ ...prev, magneticStrength: value }))
                  }
                  disabled={!canvasConfig.showSmartGuides}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guide-color" className="block">
                  Guide Color
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    id="guide-color"
                    type="color"
                    value={canvasConfig.guideColor || 'rgba(0, 120, 255, 0.8)'}
                    onChange={(e) => 
                      setCanvasConfig(prev => ({ ...prev, guideColor: e.target.value }))
                    }
                    disabled={!canvasConfig.showSmartGuides}
                    className="h-8 w-12"
                  />
                  <span>{canvasConfig.guideColor || 'rgba(0, 120, 255, 0.8)'}</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WireframeEditorWithGrid;
