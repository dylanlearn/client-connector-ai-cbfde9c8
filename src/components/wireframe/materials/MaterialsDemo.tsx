
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialType, SurfaceTreatment } from '../fidelity/FidelityLevels';
import MaterialRenderer from './MaterialRenderer';
import { useFidelity } from '../fidelity/FidelityContext';

const MaterialsDemo = () => {
  const { settings } = useFidelity();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('matte');
  const [selectedSurface, setSelectedSurface] = useState<SurfaceTreatment>('smooth');
  const [color, setColor] = useState('#4a90e2');
  const [intensity, setIntensity] = useState(1.0);
  const [darkMode, setDarkMode] = useState(false);

  const materialTypes: MaterialType[] = ['basic', 'flat', 'matte', 'glossy', 'metallic', 'glass', 'textured'];
  const surfaceTypes: SurfaceTreatment[] = ['smooth', 'rough', 'bumpy', 'engraved', 'embossed'];

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Material System</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-md text-sm"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
            <MaterialRenderer
              material={selectedMaterial}
              surface={selectedSurface}
              color={color}
              intensity={intensity}
              width="100%"
              height="100%"
              isContainer={true}
              darkMode={darkMode}
              textureUrl={selectedMaterial === 'textured' ? 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29uY3JldGUlMjB0ZXh0dXJlfGVufDB8fDB8fHww' : undefined}
            >
              <div className="flex flex-col h-full justify-center items-center">
                <div className="text-2xl font-bold mb-4">Material Preview</div>
                <div className="text-sm opacity-70">Fidelity Level: {settings.fidelityLevel}</div>
                <div className="text-sm opacity-70">Material: {selectedMaterial}</div>
                <div className="text-sm opacity-70">Surface: {selectedSurface}</div>
              </div>
            </MaterialRenderer>
          </div>
        </div>

        <div>
          <Tabs defaultValue="material">
            <TabsList className="mb-4">
              <TabsTrigger value="material">Material</TabsTrigger>
              <TabsTrigger value="surface">Surface</TabsTrigger>
              <TabsTrigger value="color">Color</TabsTrigger>
            </TabsList>

            <TabsContent value="material" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {materialTypes.map(material => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`p-3 rounded-md text-sm ${
                      selectedMaterial === material 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {material.charAt(0).toUpperCase() + material.slice(1)}
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="surface" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {surfaceTypes.map(surface => (
                  <button
                    key={surface}
                    onClick={() => setSelectedSurface(surface)}
                    className={`p-3 rounded-md text-sm ${
                      selectedSurface === surface 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {surface.charAt(0).toUpperCase() + surface.slice(1)}
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="color" className="space-y-4">
              <Card className="p-4">
                <HexColorPicker color={color} onChange={setColor} className="w-full mb-4" />
              </Card>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="intensity">Material Intensity</Label>
                  <span className="text-sm">{intensity.toFixed(2)}</span>
                </div>
                <Slider
                  id="intensity"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[intensity]}
                  onValueChange={(values) => setIntensity(values[0])}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {['matte', 'glossy', 'metallic'].map((material) => (
          <MaterialRenderer
            key={material}
            material={material as MaterialType}
            surface="smooth"
            color={color}
            height={120}
            darkMode={darkMode}
          >
            <div className="flex justify-center items-center h-full">
              <span className="text-lg font-medium capitalize">{material}</span>
            </div>
          </MaterialRenderer>
        ))}
      </div>
    </div>
  );
};

export default MaterialsDemo;
