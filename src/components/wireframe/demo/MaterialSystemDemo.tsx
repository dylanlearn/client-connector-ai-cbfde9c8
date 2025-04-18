
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Heart, Star, Bookmark } from 'lucide-react';
import MaterialRenderer from '../materials/MaterialRenderer';
import MaterialSwatch from '../materials/MaterialSwatch';
import { MaterialType, SurfaceTreatment } from '../fidelity/FidelityLevels';

// Material and surface presets
const materialPresets: MaterialType[] = ['basic', 'flat', 'glass', 'metal', 'plastic', 'textured'];
const surfacePresets: SurfaceTreatment[] = ['matte', 'glossy', 'frosted', 'textured'];

// Material library with predefined colors
const materialLibrary = [
  { name: "Ocean Glass", material: "glass", surface: "glossy", color: "#3498db" },
  { name: "Ruby Metal", material: "metal", surface: "glossy", color: "#e74c3c" },
  { name: "Emerald Plastic", material: "plastic", surface: "matte", color: "#2ecc71" },
  { name: "Amber Flat", material: "flat", surface: "matte", color: "#f39c12" },
  { name: "Sapphire Textured", material: "textured", surface: "textured", color: "#1abc9c" },
  { name: "Amethyst Glass", material: "glass", surface: "frosted", color: "#9b59b6" },
  { name: "Slate Metal", material: "metal", surface: "matte", color: "#34495e" },
  { name: "Coral Plastic", material: "plastic", surface: "glossy", color: "#e67e22" },
  { name: "Cloud Flat", material: "flat", surface: "frosted", color: "#ecf0f1" }
] as const;

// Example UI component with material preview
const PreviewCard: React.FC<{
  material: MaterialType;
  surface: SurfaceTreatment;
  color: string;
  intensity: number;
}> = ({ material, surface, color, intensity }) => {
  return (
    <MaterialRenderer
      material={material}
      surface={surface}
      color={color}
      intensity={intensity}
      isContainer
      className="rounded-lg p-6"
    >
      <h3 className="text-lg font-medium mb-3">Material Preview</h3>
      <p className="text-sm mb-4">This card demonstrates the selected material properties.</p>
      
      <div className="flex gap-2 mb-4">
        <Badge variant="secondary">{material}</Badge>
        <Badge variant="outline">{surface}</Badge>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="outline">Secondary</Button>
      </div>
      
      <div className="flex gap-4 mt-4">
        <Heart className="w-5 h-5" />
        <Star className="w-5 h-5" />
        <Bookmark className="w-5 h-5" />
        <Check className="w-5 h-5" />
      </div>
    </MaterialRenderer>
  );
};

const MaterialSystemDemo: React.FC = () => {
  // State for material properties
  const [material, setMaterial] = useState<MaterialType>('glass');
  const [surface, setSurface] = useState<SurfaceTreatment>('glossy');
  const [color, setColor] = useState('#4a90e2');
  const [intensity, setIntensity] = useState(0.8);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  
  // Handle preset selection
  const selectPreset = (index: number) => {
    const preset = materialLibrary[index];
    setMaterial(preset.material);
    setSurface(preset.surface as SurfaceTreatment);
    setColor(preset.color);
    setSelectedPreset(index);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Material Properties</h2>
          
          <Tabs defaultValue="basic" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-3">
                <Label>Material Type</Label>
                <div className="flex flex-wrap gap-2">
                  {materialPresets.map(mat => (
                    <Button
                      key={mat}
                      variant={material === mat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMaterial(mat)}
                      className="capitalize"
                    >
                      {mat}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Surface Treatment</Label>
                <div className="flex flex-wrap gap-2">
                  {surfacePresets.map(surf => (
                    <Button
                      key={surf}
                      variant={surface === surf ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSurface(surf)}
                      className="capitalize"
                    >
                      {surf}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-10 rounded border"
                  />
                  <input 
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="intensity">Material Intensity</Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(intensity * 100)}%
                  </span>
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
              
              <div className="space-y-1">
                <Label>Performance Impact</Label>
                <div className="text-sm text-muted-foreground">
                  {material === 'glass' ? 'High' : material === 'metal' || material === 'textured' ? 'Medium' : 'Low'}
                </div>
                <div className="bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ 
                      width: material === 'glass' ? '80%' : 
                             material === 'metal' || material === 'textured' ? '50%' : '20%' 
                    }}
                  ></div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {materialLibrary.map((preset, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer hover:bg-accent transition-colors ${selectedPreset === index ? 'border-primary' : ''}`}
                    onClick={() => selectPreset(index)}
                  >
                    <CardContent className="p-3">
                      <MaterialSwatch 
                        material={preset.material}
                        surface={preset.surface as SurfaceTreatment}
                        color={preset.color}
                        size="md"
                        selected={selectedPreset === index}
                      />
                      <p className="text-xs mt-2 text-center">{preset.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <div className="border rounded-lg overflow-hidden">
            <PreviewCard 
              material={material}
              surface={surface}
              color={color}
              intensity={intensity}
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Material Configuration</h3>
            <Card>
              <CardContent className="p-4 text-sm">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="font-medium">Type:</div>
                  <div className="capitalize">{material}</div>
                  
                  <div className="font-medium">Surface:</div>
                  <div className="capitalize">{surface}</div>
                  
                  <div className="font-medium">Color:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    {color}
                  </div>
                  
                  <div className="font-medium">Intensity:</div>
                  <div>{Math.round(intensity * 100)}%</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialSystemDemo;
