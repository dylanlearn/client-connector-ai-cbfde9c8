
import React, { useState } from 'react';
import { useFidelity } from './FidelityContext';
import { FidelityLevel, FIDELITY_PRESETS } from './FidelityLevels';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import AnimationPreviewFrame from '../animation/AnimationPreviewFrame';
import { ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

const FidelityDemo: React.FC = () => {
  const { currentLevel, setLevel, settings, updateSettings, isTransitioning } = useFidelity();
  const [showDetailControls, setShowDetailControls] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { toast } = useToast();

  const handleLevelChange = (level: FidelityLevel) => {
    setLevel(level);
    toast({
      title: `Switched to ${level} fidelity`,
      description: `Rendering with ${FIDELITY_PRESETS[level].renderQuality * 100}% quality`
    });
  };

  const toggleDetailControls = () => {
    setShowDetailControls(!showDetailControls);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    // Add a small delay before starting playback again
    setTimeout(() => setIsPlaying(true), 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fidelity Control Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Object.keys(FIDELITY_PRESETS).map((level) => (
                  <Button
                    key={level}
                    variant={currentLevel === level ? "default" : "outline"}
                    onClick={() => handleLevelChange(level as FidelityLevel)}
                    disabled={isTransitioning}
                    className="flex-grow"
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleDetailControls}
                className="w-full flex justify-between items-center mt-2"
              >
                {showDetailControls ? "Hide" : "Show"} Detailed Controls
                <ChevronRight className={`h-4 w-4 transition-transform ${showDetailControls ? 'rotate-90' : ''}`} />
              </Button>

              {showDetailControls && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="detail-level" className="text-sm font-medium">Detail Level</label>
                      <span className="text-xs text-muted-foreground">{Math.round(settings.detailLevel * 100)}%</span>
                    </div>
                    <Slider 
                      id="detail-level"
                      min={0} 
                      max={1} 
                      step={0.01} 
                      value={[settings.detailLevel]} 
                      onValueChange={(value) => updateSettings({ detailLevel: value[0] })} 
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="render-quality" className="text-sm font-medium">Render Quality</label>
                      <span className="text-xs text-muted-foreground">{Math.round(settings.renderQuality * 100)}%</span>
                    </div>
                    <Slider 
                      id="render-quality"
                      min={0} 
                      max={1} 
                      step={0.01} 
                      value={[settings.renderQuality]} 
                      onValueChange={(value) => updateSettings({ renderQuality: value[0] })} 
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="shadow-intensity" className="text-sm font-medium">Shadow Intensity</label>
                      <span className="text-xs text-muted-foreground">{Math.round(settings.shadowIntensity * 100)}%</span>
                    </div>
                    <Slider 
                      id="shadow-intensity"
                      min={0} 
                      max={1} 
                      step={0.01} 
                      value={[settings.shadowIntensity]} 
                      onValueChange={(value) => updateSettings({ shadowIntensity: value[0] })} 
                      disabled={!settings.showShadows}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={togglePlayback}>
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="ghost" onClick={resetAnimation}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Animation Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimationPreviewFrame 
              fidelityLevel={currentLevel}
              isPlaying={isPlaying}
              onTransitionEnd={() => console.log('Transition complete')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FidelityDemo;
