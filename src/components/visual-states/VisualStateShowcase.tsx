
import React, { useState } from 'react';
import { VisualStateProvider } from '@/contexts/VisualStateContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

import StatefulComponent from './StatefulComponent';
import StateTransitionPreview from './StateTransitionPreview';
import StateControls from './StateControls';
import { stylePresets, PresetStyleDemo } from './PresetStateStyles';

/**
 * A comprehensive showcase for the Visual States Management System
 * Demonstrates different components and their states
 */
export function VisualStateShowcase() {
  const [customStyles, setCustomStyles] = useState({
    defaultStyles: 'bg-gray-100 text-gray-800 py-2 px-4 rounded',
    hoverStyles: 'bg-gray-200 text-gray-900',
    activeStyles: 'bg-gray-300 text-gray-900',
    focusStyles: 'ring-2 ring-offset-2 ring-gray-400',
    disabledStyles: 'bg-gray-100 text-gray-400 opacity-70',
  });

  return (
    <VisualStateProvider>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold">Visual States Management System</h1>
        <p className="text-muted-foreground">
          Visualize and manage component states with transitions and animations.
        </p>

        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="presets">Preset Components</TabsTrigger>
            <TabsTrigger value="transitions">Transition Showcase</TabsTrigger>
            <TabsTrigger value="custom">Custom Component</TabsTrigger>
          </TabsList>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-6">
            <h2 className="text-2xl font-semibold mt-4">Component Presets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stylePresets.map(preset => (
                <Card key={preset.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{preset.name}</CardTitle>
                    <CardDescription>
                      Showcases {preset.name.toLowerCase()} in different states
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <StatefulComponent
                      forceState="default"
                      defaultStyles={preset.defaultStyles}
                    >
                      <PresetStyleDemo presetId={preset.id} />
                    </StatefulComponent>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Hover</Label>
                        <StatefulComponent
                          forceState="hover"
                          defaultStyles={preset.defaultStyles}
                          hoverStyles={preset.hoverStyles}
                        >
                          <PresetStyleDemo presetId={preset.id} />
                        </StatefulComponent>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Active</Label>
                        <StatefulComponent
                          forceState="active"
                          defaultStyles={preset.defaultStyles}
                          activeStyles={preset.activeStyles}
                        >
                          <PresetStyleDemo presetId={preset.id} />
                        </StatefulComponent>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Focus</Label>
                        <StatefulComponent
                          forceState="focus"
                          defaultStyles={preset.defaultStyles}
                          focusStyles={preset.focusStyles}
                        >
                          <PresetStyleDemo presetId={preset.id} />
                        </StatefulComponent>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Disabled</Label>
                        <StatefulComponent
                          forceState="disabled"
                          defaultStyles={preset.defaultStyles}
                          disabledStyles={preset.disabledStyles}
                        >
                          <PresetStyleDemo presetId={preset.id} />
                        </StatefulComponent>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transition Preview Tab */}
          <TabsContent value="transitions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <StateTransitionPreview autoPlay>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <StatefulComponent
                      defaultStyles="bg-blue-600 text-white py-3 px-6 rounded-lg shadow transition-all"
                      hoverStyles="bg-blue-700 shadow-lg scale-105"
                      activeStyles="bg-blue-800 shadow-inner scale-95"
                      focusStyles="ring-4 ring-blue-300 ring-opacity-50"
                      disabledStyles="bg-blue-400 opacity-60"
                    >
                      <button className="w-full h-full">Primary Button</button>
                    </StatefulComponent>
                    
                    <StatefulComponent
                      defaultStyles="border border-gray-300 rounded-lg p-4 bg-white shadow-sm transition-all"
                      hoverStyles="border-gray-400 shadow-md"
                      activeStyles="border-blue-500 bg-blue-50 shadow-inner"
                      focusStyles="ring-2 ring-blue-400"
                      disabledStyles="bg-gray-50 opacity-70"
                    >
                      <div className="w-full h-full">
                        <h3 className="font-medium">Card Title</h3>
                        <p className="text-sm text-gray-500">Card description text</p>
                      </div>
                    </StatefulComponent>
                  </div>
                </StateTransitionPreview>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transition Controls</CardTitle>
                  <CardDescription>
                    Customize the transition timing and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StateControls />
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <h3 className="text-xl font-semibold">Interactive Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Interactive button examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Button States</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">Default Button</Button>
                  <Button className="w-full" disabled>Disabled Button</Button>
                  <Button className="w-full" variant="outline">Outline Button</Button>
                  <Button className="w-full" variant="ghost">Ghost Button</Button>
                </CardContent>
              </Card>
              
              {/* Interactive input examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Input States</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-input">Default</Label>
                    <Input id="default-input" placeholder="Default input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hover-input">Hover</Label>
                    <Input 
                      id="hover-input" 
                      placeholder="Hover input" 
                      className="hover:border-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="focus-input">Focus (click me)</Label>
                    <Input id="focus-input" placeholder="Focus input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled-input">Disabled</Label>
                    <Input 
                      id="disabled-input" 
                      placeholder="Disabled input" 
                      disabled 
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Interactive card examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md hover:border-gray-300 active:bg-gray-100 transition-all cursor-pointer">
                      <h4 className="font-medium">Hover & Click Me</h4>
                      <p className="text-sm text-gray-500">This card has hover and active states</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                      <h4 className="font-medium">Focus Inside</h4>
                      <Input placeholder="Click here for focus" className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Custom Component Tab */}
          <TabsContent value="custom" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Component</CardTitle>
                    <CardDescription>
                      Preview your custom styled component with different states
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StateTransitionPreview>
                      <StatefulComponent
                        defaultStyles={customStyles.defaultStyles}
                        hoverStyles={customStyles.hoverStyles}
                        activeStyles={customStyles.activeStyles}
                        focusStyles={customStyles.focusStyles}
                        disabledStyles={customStyles.disabledStyles}
                      >
                        <button className="w-full h-full">Custom Component</button>
                      </StatefulComponent>
                    </StateTransitionPreview>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Style Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-style">Default Style</Label>
                    <Input
                      id="default-style"
                      value={customStyles.defaultStyles}
                      onChange={(e) => setCustomStyles({...customStyles, defaultStyles: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hover-style">Hover Style</Label>
                    <Input
                      id="hover-style"
                      value={customStyles.hoverStyles}
                      onChange={(e) => setCustomStyles({...customStyles, hoverStyles: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="active-style">Active Style</Label>
                    <Input
                      id="active-style"
                      value={customStyles.activeStyles}
                      onChange={(e) => setCustomStyles({...customStyles, activeStyles: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="focus-style">Focus Style</Label>
                    <Input
                      id="focus-style"
                      value={customStyles.focusStyles}
                      onChange={(e) => setCustomStyles({...customStyles, focusStyles: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled-style">Disabled Style</Label>
                    <Input
                      id="disabled-style"
                      value={customStyles.disabledStyles}
                      onChange={(e) => setCustomStyles({...customStyles, disabledStyles: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VisualStateProvider>
  );
}

export default VisualStateShowcase;
