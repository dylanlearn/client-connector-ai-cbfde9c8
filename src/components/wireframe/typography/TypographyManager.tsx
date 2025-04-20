
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TypographyControls } from './TypographyControls';
import { TypographyPreview } from './TypographyPreview';
import { TextScaleVisualizer } from './TextScaleVisualizer';
import { LineHeightVisualizer } from './LineHeightVisualizer';
import { useToast } from '@/hooks/use-toast';

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  scaleRatio: number;
  lineHeights: {
    heading: number;
    body: number;
  };
}

export interface TypographyManagerProps {
  initialConfig?: Partial<TypographyConfig>;
  onChange?: (config: TypographyConfig) => void;
  className?: string;
}

/**
 * Typography Manager - Main component for managing typography settings
 */
export const TypographyManager: React.FC<TypographyManagerProps> = ({
  initialConfig,
  onChange,
  className
}) => {
  const { toast } = useToast();
  // Set up state with default or initial config
  const [config, setConfig] = useState<TypographyConfig>({
    headingFont: initialConfig?.headingFont || 'Inter',
    bodyFont: initialConfig?.bodyFont || 'Inter',
    scaleRatio: initialConfig?.scaleRatio || 1.25,
    lineHeights: {
      heading: initialConfig?.lineHeights?.heading || 1.1,
      body: initialConfig?.lineHeights?.body || 1.5
    }
  });
  
  // Handle font changes
  const handleFontChange = (type: 'heading' | 'body', font: string) => {
    const newConfig = {
      ...config,
      [type === 'heading' ? 'headingFont' : 'bodyFont']: font
    };
    
    setConfig(newConfig);
    
    if (onChange) {
      onChange(newConfig);
    }
    
    toast({
      title: `${type === 'heading' ? 'Heading' : 'Body'} font updated`,
      description: `Changed to ${font}`,
      duration: 2000,
    });
  };
  
  // Handle scale ratio change
  const handleScaleChange = (value: number) => {
    const newConfig = {
      ...config,
      scaleRatio: value
    };
    
    setConfig(newConfig);
    
    if (onChange) {
      onChange(newConfig);
    }
    
    toast({
      title: 'Type scale updated',
      description: `Scale ratio set to ${value}`,
      duration: 2000,
    });
  };
  
  // Handle line height changes
  const handleLineHeightChange = (type: 'heading' | 'body', value: number) => {
    const newConfig = {
      ...config,
      lineHeights: {
        ...config.lineHeights,
        [type]: value
      }
    };
    
    setConfig(newConfig);
    
    if (onChange) {
      onChange(newConfig);
    }
    
    toast({
      title: `${type === 'heading' ? 'Heading' : 'Body'} line height updated`,
      description: `Line height set to ${value}x`,
      duration: 2000,
    });
  };
  
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Typography System</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="scale">Scale</TabsTrigger>
              <TabsTrigger value="lineHeight">Line Height</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview">
              <TypographyPreview
                headingFont={config.headingFont}
                bodyFont={config.bodyFont}
                scaleRatio={config.scaleRatio}
                lineHeights={config.lineHeights}
              />
            </TabsContent>
            
            <TabsContent value="controls">
              <TypographyControls
                headingFont={config.headingFont}
                bodyFont={config.bodyFont}
                scaleRatio={config.scaleRatio}
                lineHeights={config.lineHeights}
                onFontChange={handleFontChange}
                onScaleChange={handleScaleChange}
                onLineHeightChange={handleLineHeightChange}
              />
            </TabsContent>
            
            <TabsContent value="scale">
              <TextScaleVisualizer
                headingFont={config.headingFont}
                bodyFont={config.bodyFont}
                scaleRatio={config.scaleRatio}
              />
            </TabsContent>
            
            <TabsContent value="lineHeight">
              <LineHeightVisualizer
                headingFont={config.headingFont}
                bodyFont={config.bodyFont}
                lineHeights={config.lineHeights}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
