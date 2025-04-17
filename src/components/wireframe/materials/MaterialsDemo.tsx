
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  MaterialType,
  SurfaceTreatment,
  MATERIAL_DEFINITIONS,
  SURFACE_TREATMENTS
} from '../fidelity/FidelityLevels';
import MaterialRenderer from './MaterialRenderer';
import MaterialControls from '../controls/MaterialControls';
import { HexColorPicker } from 'react-colorful';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Paintbrush2, Layers, Cpu } from 'lucide-react';
import { useFidelity } from '../fidelity/FidelityContext';
import FidelityControls from '../controls/FidelityControls';

const MaterialsDemo: React.FC = () => {
  const { settings } = useFidelity();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(settings.defaultMaterial);
  const [selectedSurface, setSelectedSurface] = useState<SurfaceTreatment>(settings.surfaceTreatment);
  const [color, setColor] = useState<string>('#4a90e2');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [reflectionIntensity, setReflectionIntensity] = useState(0.5);
  const [shadowIntensity, setShadowIntensity] = useState(0.5);
  const [darkMode, setDarkMode] = useState(false);

  // Sample content for demo boxes
  const content = [
    { title: "Header", content: "Welcome to Materials", type: "header" },
    { title: "Card", content: "This is a card with material styling applied", type: "card" },
    { title: "Button", content: "Click Me", type: "button" },
    { title: "Container", content: "Content container with children", type: "container" }
  ];

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Material System Demo</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Material Preview</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Header example */}
                <div className="col-span-2">
                  <MaterialRenderer
                    material={selectedMaterial}
                    surface={selectedSurface}
                    color={color}
                    intensity={reflectionIntensity}
                    height="100px"
                    isContainer={true}
                    darkMode={darkMode}
                    className="flex items-center justify-center"
                  >
                    <h2 className="text-2xl font-bold">Material Showcase</h2>
                  </MaterialRenderer>
                </div>
                
                {/* Button example */}
                <MaterialRenderer
                  material={selectedMaterial}
                  surface={selectedSurface}
                  color={color}
                  intensity={reflectionIntensity}
                  height="60px"
                  darkMode={darkMode}
                  className="flex items-center justify-center cursor-pointer hover:brightness-105 active:brightness-95"
                >
                  <div className="text-center font-medium">Interactive Button</div>
                </MaterialRenderer>
                
                {/* Card example */}
                <MaterialRenderer
                  material={selectedMaterial}
                  surface={selectedSurface}
                  color={color}
                  intensity={reflectionIntensity}
                  height="150px"
                  isContainer={true}
                  darkMode={darkMode}
                >
                  <h4 className="text-lg font-medium mb-2">Card Title</h4>
                  <p className="text-sm">
                    This is a content card with the selected material and surface treatment applied.
                  </p>
                </MaterialRenderer>
                
                {/* Container example */}
                <div className="col-span-2">
                  <MaterialRenderer
                    material={selectedMaterial}
                    surface={selectedSurface}
                    color={color}
                    intensity={reflectionIntensity}
                    height="auto"
                    isContainer={true}
                    darkMode={darkMode}
                  >
                    <div className="grid grid-cols-3 gap-3">
                      <MaterialRenderer
                        material="flat"
                        surface="smooth"
                        color="#e74c3c"
                        height="80px"
                        className="flex items-center justify-center"
                        darkMode={darkMode}
                      >
                        <div className="text-center font-medium">Item 1</div>
                      </MaterialRenderer>
                      <MaterialRenderer
                        material="matte"
                        surface="smooth"
                        color="#2ecc71"
                        height="80px"
                        className="flex items-center justify-center"
                        darkMode={darkMode}
                      >
                        <div className="text-center font-medium">Item 2</div>
                      </MaterialRenderer>
                      <MaterialRenderer
                        material="glossy"
                        surface="smooth"
                        color="#9b59b6"
                        height="80px"
                        className="flex items-center justify-center"
                        darkMode={darkMode}
                      >
                        <div className="text-center font-medium">Item 3</div>
                      </MaterialRenderer>
                    </div>
                  </MaterialRenderer>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Current Material Properties</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Material: </span>
                    <span className="font-medium">{MATERIAL_DEFINITIONS[selectedMaterial].name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Surface: </span>
                    <span className="font-medium">{SURFACE_TREATMENTS[selectedSurface].name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reflectivity: </span>
                    <span className="font-medium">{MATERIAL_DEFINITIONS[selectedMaterial].reflectivity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Roughness: </span>
                    <span className="font-medium">{MATERIAL_DEFINITIONS[selectedMaterial].roughness}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Performance Cost: </span>
                    <span className="font-medium">
                      {MATERIAL_DEFINITIONS[selectedMaterial].performanceCost + 
                       SURFACE_TREATMENTS[selectedSurface].performanceImpact}/20
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <Tabs defaultValue="material">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="material">
                    <Paintbrush2 className="h-4 w-4 mr-2" />
                    Material
                  </TabsTrigger>
                  <TabsTrigger value="color">
                    <div className="h-4 w-4 rounded-full mr-2" style={{ background: color }} />
                    Color
                  </TabsTrigger>
                  <TabsTrigger value="fidelity">
                    <Layers className="h-4 w-4 mr-2" />
                    Fidelity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="material" className="space-y-4">
                  <MaterialControls 
                    onMaterialChange={setSelectedMaterial}
                    onSurfaceChange={setSelectedSurface}
                    onReflectionChange={setReflectionIntensity}
                    onShadowIntensityChange={setShadowIntensity}
                  />
                </TabsContent>
                
                <TabsContent value="color">
                  <div className="space-y-4">
                    <div>
                      <Label>Selected Color</Label>
                      <div className="flex items-center mt-1 mb-4">
                        <div 
                          className="h-10 w-10 rounded-md mr-2 border" 
                          style={{ background: color }}
                        />
                        <Input 
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <HexColorPicker color={color} onChange={setColor} />
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Presets</h4>
                      <div className="grid grid-cols-6 gap-2">
                        {['#4a90e2', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#34495e',
                          '#16a085', '#d35400', '#8e44ad', '#2c3e50', '#3498db', '#e67e22'].map(presetColor => (
                          <button
                            key={presetColor}
                            className="h-8 w-full rounded-md hover:ring-2 hover:ring-offset-2 hover:ring-primary"
                            style={{ background: presetColor }}
                            onClick={() => setColor(presetColor)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="fidelity">
                  <div className="space-y-4">
                    <FidelityControls />
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Performance Optimization</h4>
                      <p className="text-xs text-muted-foreground">
                        The material system automatically optimizes rendering based on fidelity settings.
                        Higher fidelity enables more effects but requires more processing power.
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">
                          Current performance cost: {
                            MATERIAL_DEFINITIONS[selectedMaterial].performanceCost + 
                            SURFACE_TREATMENTS[selectedSurface].performanceImpact
                          }/20
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsDemo;
