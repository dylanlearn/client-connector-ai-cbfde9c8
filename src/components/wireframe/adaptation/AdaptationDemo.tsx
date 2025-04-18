
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Smartphone, Tablet, Monitor } from 'lucide-react';

const AdaptationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [darkMode, setDarkMode] = useState(false);
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>('default');
  
  // Component that adapts to the context
  const AdaptiveComponent = () => {
    const isDarkMode = darkMode;
    const isMobile = deviceType === 'mobile';
    const isTablet = deviceType === 'tablet';
    const isDesktop = deviceType === 'desktop';
    const spacing = density === 'compact' ? 'space-y-2' : 
                   density === 'comfortable' ? 'space-y-6' : 'space-y-4';
    
    return (
      <Card className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Adaptive Panel {isMobile && '(Mobile)'}</span>
            {!isMobile && (
              <Badge variant={isDarkMode ? 'outline' : 'default'}>
                {deviceType}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={spacing}>
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
            <Button className="flex-1">Primary</Button>
            {!isMobile && <Button variant="outline" className="flex-1">Secondary</Button>}
            {isDesktop && <Button variant="secondary" className="flex-1">Tertiary</Button>}
          </div>
          
          <div className={`grid ${isDesktop ? 'grid-cols-3' : isTablet ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
            {[1, 2, 3].map((item) => (
              <Card key={item} className={`${!isDesktop && item === 3 ? 'hidden' : ''}`}>
                <CardContent className="p-3">
                  <div className="text-xs">Item {item}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'justify-end space-x-2'}`}>
            {isMobile ? (
              <Button size="sm" className="w-full">Save</Button>
            ) : (
              <>
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Context Adaptation Demo</h2>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant={deviceType === 'desktop' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setDeviceType('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={deviceType === 'tablet' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setDeviceType('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              variant={deviceType === 'mobile' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setDeviceType('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode">Dark</Label>
            <Switch 
              id="dark-mode" 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
          </div>
          
          <Select value={density} onValueChange={(value: 'compact' | 'default' | 'comfortable') => setDensity(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Density" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="rules">Adaptation Rules</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <div className={`
            border rounded-lg p-4
            ${deviceType === 'mobile' ? 'max-w-[375px]' : 
              deviceType === 'tablet' ? 'max-w-[768px]' : 'w-full'}
            mx-auto
          `}>
            <AdaptiveComponent />
          </div>
        </TabsContent>
        
        <TabsContent value="rules">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Active Adaptation Rules</h3>
              
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-2 h-4 w-4" />
                    <div className="font-medium">Layout adaptation</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Changes from horizontal to vertical layout on mobile devices
                  </p>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-2 h-4 w-4" />
                    <div className="font-medium">Content adaptation</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shows fewer items on smaller screens
                  </p>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-2 h-4 w-4" />
                    <div className="font-medium">Theme adaptation</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adjusts colors and contrasts for dark mode
                  </p>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-2 h-4 w-4" />
                    <div className="font-medium">Density adaptation</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adjusts spacing based on density setting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="presets">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:border-primary">
              <CardHeader>
                <CardTitle className="text-base">Mobile Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>• Vertical stacking</p>
                  <p>• Simplified navigation</p>
                  <p>• Touch-friendly targets</p>
                </div>
                <Button className="w-full mt-4" onClick={() => {
                  setDeviceType('mobile');
                  setDensity('compact');
                }}>Apply</Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:border-primary">
              <CardHeader>
                <CardTitle className="text-base">Dark Mode Desktop</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>• Dark theme</p>
                  <p>• Desktop layout</p>
                  <p>• Full functionality</p>
                </div>
                <Button className="w-full mt-4" onClick={() => {
                  setDeviceType('desktop');
                  setDarkMode(true);
                  setDensity('default');
                }}>Apply</Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:border-primary">
              <CardHeader>
                <CardTitle className="text-base">Tablet Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>• Tablet layout</p>
                  <p>• Comfortable spacing</p>
                  <p>• Light theme</p>
                </div>
                <Button className="w-full mt-4" onClick={() => {
                  setDeviceType('tablet');
                  setDarkMode(false);
                  setDensity('comfortable');
                }}>Apply</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Device</div>
              <div>{deviceType}</div>
            </div>
            <div>
              <div className="font-medium">Theme</div>
              <div>{darkMode ? 'Dark' : 'Light'}</div>
            </div>
            <div>
              <div className="font-medium">Density</div>
              <div className="capitalize">{density}</div>
            </div>
            <div>
              <div className="font-medium">Rules Applied</div>
              <div>4</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptationDemo;
