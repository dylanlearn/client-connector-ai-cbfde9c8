
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import TransitionPreviewFrame from '../animation/TransitionPreviewFrame';
import MaterialControls from '../controls/MaterialControls';
import { MaterialType, SurfaceTreatment } from '../fidelity/FidelityLevels';
import './materials.css';

const MaterialsDemo: React.FC = () => {
  // Material state
  const [material, setMaterial] = useState<MaterialType>('matte' as MaterialType);
  const [surface, setSurface] = useState<SurfaceTreatment>('smooth' as SurfaceTreatment);
  const [color, setColor] = useState<string>('#4a90e2');
  const [intensity, setIntensity] = useState<number>(0.8);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleMaterialChange = (settings: {
    material: MaterialType;
    surface: SurfaceTreatment;
    color: string;
    intensity: number;
  }) => {
    setMaterial(settings.material);
    setSurface(settings.surface);
    setColor(settings.color);
    setIntensity(settings.intensity);
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <MaterialControls
                initialMaterial={material}
                initialSurface={surface}
                initialColor={color}
                initialIntensity={intensity}
                onChange={handleMaterialChange}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={togglePlayback}>
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause Animation" : "Play Animation"}
              </Button>
              <Button variant="ghost" onClick={resetAnimation}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Material Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <TransitionPreviewFrame
              material={material}
              surfaceTreatment={surface}
              color={color}
              intensity={intensity}
              isPlaying={isPlaying}
              onTransitionEnd={() => console.log('Material transition complete')}
            />
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              The preview shows how the material would appear with applied effects and animations.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MaterialsDemo;
