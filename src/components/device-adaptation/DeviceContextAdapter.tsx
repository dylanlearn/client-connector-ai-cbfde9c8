
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeviceContextAdaptation, DeviceContext } from '@/hooks/use-device-context-adaptation';
import { AlertMessage } from '@/components/ui/alert-message';

export interface CulturalContext {
  id: string;
  name: string;
  region: string;
  language?: string;
  reading_direction?: string;
  color_preferences?: Record<string, any>;
  layout_preferences?: Record<string, any>;
  typography_adjustments?: Record<string, any>;
}

export interface DeviceContextAdapterProps {
  className?: string;
  onDeviceChange?: (deviceContext: DeviceContext) => void;
  onCultureChange?: (culturalContext: CulturalContext) => void;
}

export function DeviceContextAdapter({ 
  className, 
  onDeviceChange,
  onCultureChange 
}: DeviceContextAdapterProps) {
  const { deviceContexts, currentDevice, setDevice, isLoading, error } = useDeviceContextAdaptation();
  const [activeTab, setActiveTab] = useState('device');
  const [culturalContexts] = useState<CulturalContext[]>([
    {
      id: '1',
      name: 'North American',
      region: 'North America',
      reading_direction: 'ltr',
      language: 'en'
    },
    {
      id: '2',
      name: 'East Asian',
      region: 'East Asia',
      reading_direction: 'ttb',
      language: 'zh'
    },
    {
      id: '3',
      name: 'Middle Eastern',
      region: 'Middle East',
      reading_direction: 'rtl',
      language: 'ar'
    },
    {
      id: '4',
      name: 'European',
      region: 'Europe',
      reading_direction: 'ltr',
      language: 'en'
    },
    {
      id: '5',
      name: 'South Asian',
      region: 'South Asia',
      reading_direction: 'ltr',
      language: 'hi'
    }
  ]);
  const [selectedCulture, setSelectedCulture] = useState<CulturalContext>(culturalContexts[0]);

  const handleDeviceChange = (value: string) => {
    const success = setDevice(value);
    if (success && currentDevice && onDeviceChange) {
      onDeviceChange(currentDevice);
    }
  };

  const handleCultureChange = (value: string) => {
    const culture = culturalContexts.find(c => c.id === value);
    if (culture) {
      setSelectedCulture(culture);
      if (onCultureChange) {
        onCultureChange(culture);
      }
    }
  };

  if (error) {
    return <AlertMessage type="error">Error loading device contexts: {error.message}</AlertMessage>;
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Context Adaptation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="device" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="device">Device Context</TabsTrigger>
            <TabsTrigger value="cultural">Cultural Context</TabsTrigger>
          </TabsList>
          <TabsContent value="device" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="device-type">Device Type</Label>
              <Select 
                disabled={isLoading} 
                onValueChange={handleDeviceChange}
                value={currentDevice?.name}
              >
                <SelectTrigger id="device-type">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  {deviceContexts.map((device) => (
                    <SelectItem key={device.id} value={device.name}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {currentDevice && (
              <div className="rounded-md bg-slate-50 p-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Device Properties</h4>
                <div className="text-xs text-slate-600">
                  <p>Category: {currentDevice.category}</p>
                  {currentDevice.screen_size_class && <p>Screen Size: {currentDevice.screen_size_class}</p>}
                  {currentDevice.orientation && <p>Orientation: {currentDevice.orientation}</p>}
                  {currentDevice.input_methods && <p>Input Methods: {currentDevice.input_methods.join(', ')}</p>}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cultural" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="culture-type">Cultural Region</Label>
              <Select 
                onValueChange={handleCultureChange}
                value={selectedCulture.id}
              >
                <SelectTrigger id="culture-type">
                  <SelectValue placeholder="Select cultural context" />
                </SelectTrigger>
                <SelectContent>
                  {culturalContexts.map((culture) => (
                    <SelectItem key={culture.id} value={culture.id}>
                      {culture.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCulture && (
              <div className="rounded-md bg-slate-50 p-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Cultural Properties</h4>
                <div className="text-xs text-slate-600">
                  <p>Region: {selectedCulture.region}</p>
                  {selectedCulture.language && <p>Language: {selectedCulture.language}</p>}
                  {selectedCulture.reading_direction && (
                    <p>Reading Direction: {
                      selectedCulture.reading_direction === 'ltr' 
                        ? 'Left to Right' 
                        : selectedCulture.reading_direction === 'rtl' 
                          ? 'Right to Left' 
                          : 'Top to Bottom'
                    }</p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
