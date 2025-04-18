
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DEFAULT_GRID_CONFIG, DEFAULT_GUIDE_CONFIG } from './EnterpriseGrid';
import { EnterpriseGridConfig } from '../types/canvas-types';
import { 
  Grid, 
  Ruler, 
  Eye, 
  Magnet, 
  LineChart, 
  Columns, 
  Download, 
  Upload, 
  RefreshCcw
} from 'lucide-react';

interface EnterpriseGridControlsProps {
  config: EnterpriseGridConfig;
  onUpdate: (config: Partial<EnterpriseGridConfig>) => void;
}

const EnterpriseGridControls: React.FC<EnterpriseGridControlsProps> = ({
  config,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [exportedConfig, setExportedConfig] = useState("");
  const [importConfig, setImportConfig] = useState("");
  
  const handleToggleVisible = () => {
    onUpdate({ visible: !config.visible });
  };
  
  const handleToggleSnapToGrid = () => {
    onUpdate({ snapToGrid: !config.snapToGrid });
  };
  
  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size)) {
      onUpdate({ size });
    }
  };
  
  const handleGridTypeChange = (type: EnterpriseGridConfig['type']) => {
    onUpdate({ type });
  };
  
  const handleExportConfig = () => {
    setExportedConfig(JSON.stringify(config, null, 2));
  };
  
  const handleImportConfig = () => {
    try {
      const parsedConfig = JSON.parse(importConfig);
      onUpdate(parsedConfig);
    } catch (error) {
      console.error("Invalid JSON configuration:", error);
    }
  };
  
  const handleResetToDefault = () => {
    onUpdate(DEFAULT_GRID_CONFIG);
  };
  
  return (
    <div className="enterprise-grid-controls p-4 space-y-4">
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="responsive">Responsive</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="grid-visible">Grid Visible</Label>
            <Switch 
              id="grid-visible" 
              checked={config.visible}
              onCheckedChange={handleToggleVisible}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="snap-to-grid">Snap to Grid</Label>
            <Switch 
              id="snap-to-grid" 
              checked={config.snapToGrid}
              onCheckedChange={handleToggleSnapToGrid}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grid-size">Grid Size</Label>
            <Input 
              id="grid-size" 
              type="number" 
              value={config.size}
              onChange={handleGridSizeChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Grid Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={config.type === 'lines' ? 'default' : 'outline'}
                onClick={() => handleGridTypeChange('lines')}
                className="flex flex-col items-center py-2"
                size="sm"
              >
                <LineChart className="h-4 w-4 mb-1" />
                Lines
              </Button>
              <Button 
                variant={config.type === 'dots' ? 'default' : 'outline'}
                onClick={() => handleGridTypeChange('dots')}
                className="flex flex-col items-center py-2"
                size="sm"
              >
                <Grid className="h-4 w-4 mb-1" />
                Dots
              </Button>
              <Button 
                variant={config.type === 'columns' ? 'default' : 'outline'}
                onClick={() => handleGridTypeChange('columns')}
                className="flex flex-col items-center py-2"
                size="sm"
              >
                <Columns className="h-4 w-4 mb-1" />
                Columns
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Additional tabs content would go here */}
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportConfig}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Configuration
            </Button>
            
            {exportedConfig && (
              <textarea 
                className="w-full h-24 p-2 text-xs border rounded"
                value={exportedConfig}
                readOnly
              />
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="import-config">Import Configuration</Label>
            <textarea 
              id="import-config"
              className="w-full h-24 p-2 text-xs border rounded"
              value={importConfig}
              onChange={(e) => setImportConfig(e.target.value)}
              placeholder="Paste configuration JSON here"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImportConfig}
              className="flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Configuration
            </Button>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleResetToDefault}
            className="flex items-center"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseGridControls;
