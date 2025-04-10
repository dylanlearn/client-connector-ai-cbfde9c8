
import React, { useEffect, useState } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import EnhancedWireframeCanvas from './enhanced-wireframe/EnhancedWireframeCanvas';
import { useWireframeStore } from '@/stores/wireframe-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { WireframeCanvasConfig } from './utils/types';

interface AIWireframeRendererProps {
  wireframe: WireframeData | null;
  onSectionClick?: (sectionId: string, section: any) => void;
  className?: string;
}

const AIWireframeRenderer: React.FC<AIWireframeRendererProps> = ({
  wireframe,
  onSectionClick,
  className
}) => {
  const { darkMode, activeDevice } = useWireframeStore();
  const [activeTab, setActiveTab] = useState<string>('desktop');
  
  // Map store activeDevice to tab value if present
  useEffect(() => {
    if (activeDevice) {
      setActiveTab(activeDevice);
    }
  }, [activeDevice]);
  
  // Canvas configurations for different device types
  const deviceConfigs: Record<string, Partial<WireframeCanvasConfig>> = {
    desktop: {
      width: 1200,
      height: 800,
      zoom: 1
    },
    tablet: {
      width: 768,
      height: 1024,
      zoom: 0.9
    },
    mobile: {
      width: 375,
      height: 667,
      zoom: 0.8
    }
  };
  
  if (!wireframe) {
    return (
      <Card className={className}>
        <CardContent className="p-6 flex justify-center items-center h-[600px] text-muted-foreground">
          <p>No wireframe data available to render</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="tablet">Tablet</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="desktop" className="mt-0 flex justify-center">
            <EnhancedWireframeCanvas
              wireframe={wireframe}
              darkMode={darkMode}
              deviceType="desktop"
              canvasConfig={deviceConfigs.desktop}
              onSectionClick={onSectionClick}
              showControls={true}
              className="mx-auto"
            />
          </TabsContent>
          
          <TabsContent value="tablet" className="mt-0 flex justify-center">
            <EnhancedWireframeCanvas
              wireframe={wireframe}
              darkMode={darkMode}
              deviceType="tablet"
              canvasConfig={deviceConfigs.tablet}
              onSectionClick={onSectionClick}
              showControls={true}
              className="mx-auto"
            />
          </TabsContent>
          
          <TabsContent value="mobile" className="mt-0 flex justify-center">
            <EnhancedWireframeCanvas
              wireframe={wireframe}
              darkMode={darkMode}
              deviceType="mobile"
              canvasConfig={deviceConfigs.mobile}
              onSectionClick={onSectionClick}
              showControls={true}
              className="mx-auto"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIWireframeRenderer;
