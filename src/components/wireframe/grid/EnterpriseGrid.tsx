
import React, { useState } from 'react';
import { EnterpriseGridConfig } from '@/components/wireframe/types/canvas-types';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Grid, 
  Ruler, 
  Eye, 
  EyeOff, 
  Settings, 
  Download, 
  Upload,
  Columns
} from 'lucide-react';

interface EnterpriseGridProps {
  config: EnterpriseGridConfig;
  onChange: (config: Partial<EnterpriseGridConfig>) => void;
  width: number;
  height: number;
}

const EnterpriseGrid: React.FC<EnterpriseGridProps> = ({ config, onChange, width, height }) => {
  // Initialize with complete config including required opacity and showNumbers properties
  const defaultConfig: EnterpriseGridConfig = {
    visible: true,
    type: "lines",
    size: 20,
    snapToGrid: true,
    snapThreshold: 5,
    color: "#e0e0e0",
    showGuides: true,
    showRulers: false,
    columns: 12,
    gutterWidth: 20,
    marginWidth: 40,
    responsive: true,
    breakpoints: [
      { name: "sm", width: 640, columns: 6, gutterWidth: 10, marginWidth: 20 },
      { name: "md", width: 768, columns: 8, gutterWidth: 15, marginWidth: 30 },
      { name: "lg", width: 1024, columns: 12, gutterWidth: 20, marginWidth: 40 }
    ],
    currentBreakpoint: "lg",
    // Add the missing required properties for EnterpriseGridConfig
    opacity: 0.5,
    showNumbers: false
  };
  
  // Merge with the incoming config
  const mergedConfig = { ...defaultConfig, ...config };
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const handleVisibilityToggle = () => {
    onChange({ visible: !mergedConfig.visible });
  };
  
  const handleSnapToggle = () => {
    onChange({ snapToGrid: !mergedConfig.snapToGrid });
  };
  
  const handleTypeChange = (type: EnterpriseGridConfig['type']) => {
    onChange({ type });
  };
  
  const handleSizeChange = (value: number[]) => {
    onChange({ size: value[0] });
  };
  
  const handleOpacityChange = (value: number[]) => {
    onChange({ opacity: value[0] / 100 });
  };
  
  const handleExportConfig = () => {
    const configJson = JSON.stringify(mergedConfig, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `grid-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        onChange(importedConfig);
      } catch (error) {
        console.error('Error importing grid config:', error);
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="enterprise-grid-container">
      <div className="grid-controls flex items-center gap-2 p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleVisibilityToggle}
          title={mergedConfig.visible ? "Hide Grid" : "Show Grid"}
        >
          {mergedConfig.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="ml-2 hidden md:inline">{mergedConfig.visible ? "Hide" : "Show"}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSnapToggle}
          title={mergedConfig.snapToGrid ? "Disable Snap" : "Enable Snap"}
          className={mergedConfig.snapToGrid ? "bg-muted" : ""}
        >
          <Grid size={16} />
          <span className="ml-2 hidden md:inline">{mergedConfig.snapToGrid ? "Snap On" : "Snap Off"}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          title="Grid Settings"
        >
          <Settings size={16} />
          <span className="ml-2 hidden md:inline">Settings</span>
        </Button>
        
        <div className="flex-grow"></div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportConfig}
          title="Export Grid Configuration"
        >
          <Download size={16} />
        </Button>
        
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            title="Import Grid Configuration"
            onClick={() => document.getElementById('grid-config-import')?.click()}
          >
            <Upload size={16} />
          </Button>
          <input
            id="grid-config-import"
            type="file"
            accept=".json"
            onChange={handleImportConfig}
            className="hidden"
          />
        </div>
      </div>
      
      {isSettingsOpen && (
        <div className="grid-settings bg-background shadow-lg p-4 rounded-lg border mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Grid Type</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={mergedConfig.type === 'lines' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleTypeChange('lines')}
                >
                  <Grid size={16} className="mr-2" />
                  Lines
                </Button>
                <Button 
                  variant={mergedConfig.type === 'dots' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleTypeChange('dots')}
                >
                  <Grid size={16} className="mr-2" />
                  Dots
                </Button>
                <Button 
                  variant={mergedConfig.type === 'columns' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleTypeChange('columns')}
                >
                  <Columns size={16} className="mr-2" />
                  Columns
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Grid Size: {mergedConfig.size}px</h3>
              <Slider
                value={[mergedConfig.size]}
                min={5}
                max={50}
                step={1}
                onValueChange={handleSizeChange}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Opacity: {Math.round(mergedConfig.opacity * 100)}%</h3>
              <Slider
                value={[Math.round(mergedConfig.opacity * 100)]}
                min={10}
                max={100}
                step={5}
                onValueChange={handleOpacityChange}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Show Numbers</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-numbers"
                  checked={mergedConfig.showNumbers}
                  onCheckedChange={(checked) => onChange({ showNumbers: checked })}
                />
                <Label htmlFor="show-numbers">
                  {mergedConfig.showNumbers ? 'On' : 'Off'}
                </Label>
              </div>
            </div>
            
            {mergedConfig.type === 'columns' && (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-2">Columns: {mergedConfig.columns}</h3>
                  <Slider
                    value={[mergedConfig.columns]}
                    min={1}
                    max={24}
                    step={1}
                    onValueChange={(value) => onChange({ columns: value[0] })}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Gutter Width: {mergedConfig.gutterWidth}px</h3>
                  <Slider
                    value={[mergedConfig.gutterWidth]}
                    min={0}
                    max={50}
                    step={2}
                    onValueChange={(value) => onChange({ gutterWidth: value[0] })}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseGrid;
