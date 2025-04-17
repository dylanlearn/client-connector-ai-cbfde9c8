
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useFidelity } from '../fidelity/FidelityContext';
import { MaterialType, SurfaceTreatment } from '../fidelity/FidelityLevels';
import { TransitionPreviewFrame } from '../animation/TransitionPreviewFrame';
import { generateMaterialStyles } from '../fidelity/FidelityLevels';
import { Play, Pause, RotateCcw, Settings, Palette } from 'lucide-react';

const materials: MaterialType[] = ['basic', 'flat', 'matte', 'glossy', 'metallic', 'glass', 'textured'];
const surfaces: SurfaceTreatment[] = ['smooth', 'rough', 'bumpy', 'engraved', 'embossed'];
const colors = [
  { name: 'Blue', value: '#4a90e2' },
  { name: 'Green', value: '#43c59e' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Orange', value: '#e67e22' },
  { name: 'Pink', value: '#e84393' },
];

const MaterialsDemo: React.FC = () => {
  const { settings } = useFidelity();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('matte');
  const [selectedSurface, setSelectedSurface] = useState<SurfaceTreatment>('smooth');
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [intensity, setIntensity] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');

  const handleMaterialChange = (material: MaterialType) => {
    setSelectedMaterial(material);
  };

  const handleSurfaceChange = (surface: SurfaceTreatment) => {
    setSelectedSurface(surface);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const materialStyle = generateMaterialStyles(selectedMaterial, selectedSurface, selectedColor, intensity);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Material Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="materials">
                <Palette className="h-4 w-4 mr-2" />
                Materials
              </TabsTrigger>
              <TabsTrigger value="surfaces">
                <Settings className="h-4 w-4 mr-2" />
                Surfaces
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="materials" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {materials.map((material) => (
                  <Button
                    key={material}
                    variant={selectedMaterial === material ? "default" : "outline"}
                    onClick={() => handleMaterialChange(material)}
                    className="capitalize"
                  >
                    {material}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <label htmlFor="intensity" className="text-sm font-medium">Material Intensity</label>
                  <span className="text-xs text-muted-foreground">{Math.round(intensity * 100)}%</span>
                </div>
                <Slider
                  id="intensity"
                  min={0.1}
                  max={1.0}
                  step={0.01}
                  value={[intensity]}
                  onValueChange={(value) => setIntensity(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Material Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.value ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorChange(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="surfaces" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {surfaces.map((surface) => (
                  <Button
                    key={surface}
                    variant={selectedSurface === surface ? "default" : "outline"}
                    onClick={() => handleSurfaceChange(surface)}
                    className="capitalize"
                  >
                    {surface}
                  </Button>
                ))}
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex items-center p-3 rounded-md border bg-muted/50">
                  <div className="text-sm">
                    <p className="font-medium">Surface Treatment Effects</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      The {selectedSurface} treatment affects texture, reflectivity, and shadow details.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={togglePlayback}>
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="ghost" onClick={resetAnimation}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Material Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <TransitionPreviewFrame
            materialStyle={materialStyle}
            materialType={selectedMaterial}
            surfaceTreatment={selectedSurface}
            isPlaying={isPlaying}
            settings={settings}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsDemo;
