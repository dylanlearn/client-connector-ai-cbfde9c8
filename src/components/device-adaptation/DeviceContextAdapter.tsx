
import React, { useState, useEffect } from 'react';
import { useDeviceContextAdaptation, DeviceContext } from '@/hooks/use-device-context-adaptation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Smartphone, Tablet, Monitor, Tv, Watch } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';
import { Badge } from '@/components/ui/badge';

interface DeviceContextAdapterProps {
  initialDevice?: string;
  wireframeId?: string;
  onDeviceChange?: (deviceContext: DeviceContext) => void;
  className?: string;
}

const DeviceContextAdapter: React.FC<DeviceContextAdapterProps> = ({ 
  initialDevice = 'Desktop',
  wireframeId,
  onDeviceChange,
  className
}) => {
  const { 
    deviceContexts, 
    currentDevice, 
    adaptations,
    isLoading, 
    error, 
    setDevice 
  } = useDeviceContextAdaptation(initialDevice);
  
  const [activeTab, setActiveTab] = useState<string>('device-info');
  
  useEffect(() => {
    if (currentDevice && onDeviceChange) {
      onDeviceChange(currentDevice);
    }
  }, [currentDevice, onDeviceChange]);
  
  const handleDeviceChange = (deviceName: string) => {
    setDevice(deviceName);
  };
  
  const getDeviceIcon = (deviceCategory: string) => {
    switch (deviceCategory.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'entertainment':
        return <Tv className="h-5 w-5" />;
      case 'wearable':
        return <Watch className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  if (error) {
    return <AlertMessage type="error">Failed to load device contexts: {error.message}</AlertMessage>;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Device Context Adaptation</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2">Device Selection</h3>
              <div className="flex flex-wrap gap-2">
                {deviceContexts.map(device => (
                  <Button
                    key={device.id}
                    variant={currentDevice?.id === device.id ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleDeviceChange(device.name)}
                  >
                    {getDeviceIcon(device.category)}
                    {device.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {currentDevice && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="device-info">Device Info</TabsTrigger>
                  <TabsTrigger value="adaptations">Adaptations</TabsTrigger>
                  <TabsTrigger value="constraints">Constraints</TabsTrigger>
                </TabsList>
                
                <TabsContent value="device-info" className="pt-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Screen Size</h4>
                      <Badge variant="secondary">{currentDevice.screen_size_class || 'Unknown'}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Input Methods</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentDevice.input_methods?.map(method => (
                          <Badge key={method} variant="outline">{method}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Orientation</h4>
                      <p>{currentDevice.orientation || 'Flexible'}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="adaptations" className="pt-4">
                  {adaptations.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No specific adaptations for this device.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {adaptations.map(adaptation => (
                        <div key={adaptation.id} className="border rounded p-3">
                          <h4 className="font-medium">{adaptation.component_type}</h4>
                          <p className="text-sm text-muted-foreground mb-2">Priority: {adaptation.priority}</p>
                          <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(adaptation.adaptation_rules, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="constraints" className="pt-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Capabilities</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(currentDevice.capabilities, null, 2)}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Constraints</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(currentDevice.constraints, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceContextAdapter;
