
import React from 'react';
import { fabric } from 'fabric';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedCanvasEngine from './canvas/EnhancedCanvasEngine';
import EnhancedLayerManager from './EnhancedLayerManager';
import { useGridActions } from '@/hooks/fabric/use-grid-actions';
import { WireframeCanvasConfig } from './utils/types';
import { useState } from 'react';

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
    gridColor: '#e0e0e0'
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
      </Tabs>
    </div>
  );
};

export default WireframeEditorWithGrid;
