import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFidelity } from './FidelityContext';
import FidelityControls from '../controls/FidelityControls';
import MaterialRenderer from '../materials/MaterialRenderer';
import { MaterialType, SurfaceTreatment } from './FidelityLevels';

const FidelityDemo: React.FC = () => {
  const { currentLevel, settings } = useFidelity();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedColor, setSelectedColor] = useState('#4a90e2');
  
  const materials: MaterialType[] = ['basic', 'flat', 'glass', 'metal', 'plastic', 'textured'];
  const surfaces: SurfaceTreatment[] = ['matte', 'glossy', 'frosted', 'textured'];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Fidelity Preview</h2>
          <p className="text-muted-foreground mb-6">
            Current level: <span className="font-medium capitalize">{currentLevel}</span>
          </p>
          
          <FidelityControls showDetailControls={true} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Rendered Example</h2>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                <MaterialRenderer 
                  material={settings.defaultMaterial}
                  surface={settings.surfaceTreatment}
                  color={selectedColor}
                  isContainer={true}
                  className="w-full h-full flex flex-col justify-center items-center p-6"
                >
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-medium">Sample Content</h3>
                    <p>This text demonstrates the current fidelity settings</p>
                    <Button>Interactive Button</Button>
                  </div>
                </MaterialRenderer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Current Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Render Quality:</span> {Math.round(settings.renderQuality * 100)}%</p>
                  <p><span className="font-medium">Detail Level:</span> {Math.round(settings.detailLevel * 100)}%</p>
                  <p><span className="font-medium">Shadows:</span> {settings.showShadows ? 'On' : 'Off'}</p>
                  <p><span className="font-medium">Shadow Intensity:</span> {Math.round(settings.shadowIntensity * 100)}%</p>
                </div>
                <div>
                  <p><span className="font-medium">Material:</span> {settings.defaultMaterial}</p>
                  <p><span className="font-medium">Surface:</span> {settings.surfaceTreatment}</p>
                  <p><span className="font-medium">Color Depth:</span> {settings.colorDepth}</p>
                  <p><span className="font-medium">Animations:</span> {settings.showAnimations ? 'On' : 'Off'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="materials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {materials.map((material) => (
              <Card key={material} className="overflow-hidden">
                <CardContent className="p-0">
                  <MaterialRenderer 
                    material={material}
                    surface="glossy"
                    color={selectedColor}
                    className="aspect-video flex items-center justify-center"
                  >
                    <span className="capitalize">{material}</span>
                  </MaterialRenderer>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Surface Treatments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {surfaces.map((surface) => (
                <Card key={surface} className="overflow-hidden">
                  <CardContent className="p-0">
                    <MaterialRenderer 
                      material={settings.defaultMaterial}
                      surface={surface}
                      color={selectedColor}
                      className="h-28 flex items-center justify-center"
                    >
                      <span className="capitalize">{surface}</span>
                    </MaterialRenderer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Export Options</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Resolution: {settings.exportResolution} DPI</p>
                  <p className="text-sm text-muted-foreground mt-1">Higher fidelity levels allow for higher export resolution</p>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm">Export as PNG</Button>
                  <Button size="sm" variant="outline">Export as SVG</Button>
                  <Button size="sm" variant="outline">Export as PDF</Button>
                  <Button size="sm" variant="outline">Export Code</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Performance Monitoring</h3>
              <div>
                <p><span className="font-medium">Performance Mode:</span> {settings.performanceMode ? 'Enabled' : 'Disabled'}</p>
                <p><span className="font-medium">Max Elements Per View:</span> {settings.maxElementsPerView}</p>
                <p><span className="font-medium">Anti-aliasing:</span> {settings.antiAliasing ? 'On' : 'Off'}</p>
              </div>
              
              <div className="mt-4">
                <div className="bg-gray-100 dark:bg-gray-800 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full" 
                    style={{ 
                      width: `${(1 - Number(settings.performanceMode)) * 100}%`,
                      transition: 'width 0.5s ease-out'
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Current performance impact</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FidelityDemo;
