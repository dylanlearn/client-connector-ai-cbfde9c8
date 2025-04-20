
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeviceType } from './preview/DeviceInfo';
import DevicePreviewSystem from './preview/DevicePreviewSystem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TypographyManager } from './typography/TypographyManager';

interface DevicePreviewDemoProps {
  showTypographyControls?: boolean;
}

const DevicePreviewDemo: React.FC<DevicePreviewDemoProps> = ({
  showTypographyControls = true
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [typographyConfig, setTypographyConfig] = useState({
    headingFont: 'Inter',
    bodyFont: 'Inter',
    scaleRatio: 1.25,
    lineHeights: {
      heading: 1.1,
      body: 1.5
    }
  });
  
  // Sample content for the device preview
  const SampleContent = () => (
    <div style={{ 
      fontFamily: typographyConfig.bodyFont,
      lineHeight: typographyConfig.lineHeights.body
    }}>
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <h1 style={{ 
            fontFamily: typographyConfig.headingFont,
            lineHeight: typographyConfig.lineHeights.heading
          }} className="text-2xl font-bold">
            Device Preview System
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 style={{ 
            fontFamily: typographyConfig.headingFont,
            lineHeight: typographyConfig.lineHeights.heading
          }} className="text-xl font-bold">
            Accurate Device Emulation
          </h2>
          <p>This preview system accurately emulates different devices and screen sizes.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video bg-muted rounded-md flex items-center justify-center">
              Item {i + 1}
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <h3 style={{ 
            fontFamily: typographyConfig.headingFont,
            lineHeight: typographyConfig.lineHeights.heading
          }} className="text-lg font-bold">
            Responsive Testing
          </h3>
          <p>Test your design across different devices to ensure optimal user experience.</p>
          <ul className="list-disc list-inside">
            <li>Desktop layouts</li>
            <li>Tablet views</li>
            <li>Mobile experiences</li>
            <li>Different orientations</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-muted p-4 mt-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2023 Device Preview System
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Device Preview System</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Device Preview</TabsTrigger>
            {showTypographyControls && (
              <TabsTrigger value="typography">Typography Controls</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="preview" className="min-h-[600px]">
            <DevicePreviewSystem initialDevice="desktop" className="h-[600px]">
              <SampleContent />
            </DevicePreviewSystem>
          </TabsContent>
          
          {showTypographyControls && (
            <TabsContent value="typography">
              <TypographyManager
                initialConfig={typographyConfig}
                onChange={(config) => setTypographyConfig(config)}
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DevicePreviewDemo;
