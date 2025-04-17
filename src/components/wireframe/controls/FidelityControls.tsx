
import React from 'react';
import { FidelityLevel, FIDELITY_PRESETS } from '../fidelity/FidelityLevels';
import { useFidelity } from '../fidelity/FidelityContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Zap, ZapOff } from 'lucide-react';

interface FidelityControlsProps {
  className?: string;
  showDetailedControls?: boolean;
}

const FidelityControls: React.FC<FidelityControlsProps> = ({
  className,
  showDetailedControls = true
}) => {
  const { 
    currentLevel, 
    settings, 
    setFidelityLevel, 
    updateSettings,
    isTransitioning
  } = useFidelity();
  
  // Simple level selection tabs
  const renderLevelSelector = () => (
    <Tabs 
      value={currentLevel} 
      onValueChange={(value) => setFidelityLevel(value as FidelityLevel)}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="wireframe" disabled={isTransitioning}>Wireframe</TabsTrigger>
        <TabsTrigger value="low" disabled={isTransitioning}>Low</TabsTrigger>
        <TabsTrigger value="medium" disabled={isTransitioning}>Medium</TabsTrigger>
        <TabsTrigger value="high" disabled={isTransitioning}>High</TabsTrigger>
      </TabsList>
    </Tabs>
  );
  
  // Detailed settings controls
  const renderDetailedControls = () => (
    <Card className="mt-4">
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Detail Level</label>
            <span className="text-xs text-muted-foreground">
              {Math.round(settings.detailLevel * 100)}%
            </span>
          </div>
          <Slider
            value={[settings.detailLevel * 100]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => updateSettings({ detailLevel: value[0] / 100 })}
            disabled={isTransitioning}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Render Quality</label>
            <span className="text-xs text-muted-foreground">
              {Math.round(settings.renderQuality * 100)}%
            </span>
          </div>
          <Slider
            value={[settings.renderQuality * 100]}
            min={60}
            max={100}
            step={5}
            onValueChange={(value) => updateSettings({ renderQuality: value[0] / 100 })}
            disabled={isTransitioning}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Shadows</label>
            <Switch 
              checked={settings.showShadows} 
              onCheckedChange={(checked) => updateSettings({ showShadows: checked })}
              disabled={isTransitioning}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Gradients</label>
            <Switch 
              checked={settings.showGradients} 
              onCheckedChange={(checked) => updateSettings({ showGradients: checked })}
              disabled={isTransitioning}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Textures</label>
            <Switch 
              checked={settings.showTextures} 
              onCheckedChange={(checked) => updateSettings({ showTextures: checked })}
              disabled={isTransitioning}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Animations</label>
            <Switch 
              checked={settings.showAnimations} 
              onCheckedChange={(checked) => updateSettings({ showAnimations: checked })}
              disabled={isTransitioning}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Color Depth</label>
          <div className="flex space-x-2 mt-1">
            <Button 
              size="sm" 
              variant={settings.colorDepth === 'grayscale' ? 'default' : 'outline'}
              onClick={() => updateSettings({ colorDepth: 'grayscale' })}
              disabled={isTransitioning}
              className="flex-1"
            >
              Grayscale
            </Button>
            <Button 
              size="sm" 
              variant={settings.colorDepth === 'limited' ? 'default' : 'outline'}
              onClick={() => updateSettings({ colorDepth: 'limited' })}
              disabled={isTransitioning}
              className="flex-1"
            >
              Limited
            </Button>
            <Button 
              size="sm" 
              variant={settings.colorDepth === 'full' ? 'default' : 'outline'}
              onClick={() => updateSettings({ colorDepth: 'full' })}
              disabled={isTransitioning}
              className="flex-1"
            >
              Full
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  // Performance indicator
  const renderPerformanceIndicator = () => {
    const performance = currentLevel === 'wireframe' ? 'Excellent' :
                      currentLevel === 'low' ? 'Very Good' :
                      currentLevel === 'medium' ? 'Good' : 'Moderate';
    
    return (
      <div className="flex items-center text-xs text-muted-foreground mt-2">
        <span className="mr-1">Performance:</span>
        <span className={cn(
          "font-medium",
          currentLevel === 'wireframe' && "text-green-500",
          currentLevel === 'low' && "text-green-400",
          currentLevel === 'medium' && "text-yellow-500",
          currentLevel === 'high' && "text-orange-500"
        )}>
          {performance}
        </span>
        {currentLevel === 'high' ? <ZapOff className="h-3 w-3 ml-1" /> : <Zap className="h-3 w-3 ml-1" />}
      </div>
    );
  };
  
  // Quick info about what each fidelity level means
  const renderFidelityInfo = () => {
    const messages = {
      wireframe: "Basic outlines and structure. Best performance.",
      low: "Simple shapes and limited colors. Very good performance.",
      medium: "More details and full colors. Good performance.",
      high: "Full details, textures and effects. May impact performance."
    };
    
    return (
      <p className="text-xs text-muted-foreground mt-1">
        {messages[currentLevel]}
      </p>
    );
  };
  
  // Reset button
  const resetToDefaults = () => {
    setFidelityLevel(currentLevel); // This resets to default settings for the current level
  };
  
  return (
    <div className={cn("fidelity-controls", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Fidelity Level</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetToDefaults}
          className="text-xs h-7"
          disabled={isTransitioning}
        >
          Reset
        </Button>
      </div>
      
      {renderLevelSelector()}
      {renderFidelityInfo()}
      {renderPerformanceIndicator()}
      
      {showDetailedControls && renderDetailedControls()}
      
      {isTransitioning && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-md">
          <div className="text-sm animate-pulse">Transitioning...</div>
        </div>
      )}
    </div>
  );
};

export default FidelityControls;
