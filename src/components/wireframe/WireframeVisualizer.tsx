
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';
import { WireframeSection } from '@/types/wireframe';
import { Button } from '@/components/ui/button';
import { Laptop, Smartphone } from 'lucide-react';

export interface WireframeVisualizerProps {
  wireframeData?: any;
  wireframe?: any; // Add wireframe as optional prop for backward compatibility
  title?: string;
  description?: string;
  preview?: boolean;
  onSelect?: (id: string) => void;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframeData,
  wireframe, // Accept wireframe prop
  title,
  description,
  preview = false,
  onSelect
}) => {
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Use wireframe data from either wireframeData or wireframe prop
  const data = wireframe || wireframeData;
  
  // Extract sections from data
  const sections: WireframeSection[] = data?.sections || [];
  
  if (!data || sections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || 'Wireframe Preview'}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No wireframe data available to display</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={onSelect ? "cursor-pointer hover:border-primary" : ""} onClick={() => onSelect && onSelect(data.id)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title || data.title || 'Wireframe Preview'}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={devicePreview === 'desktop' ? 'default' : 'outline'} 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setDevicePreview('desktop');
              }}
            >
              <Laptop className="h-4 w-4" />
            </Button>
            <Button 
              variant={devicePreview === 'tablet' ? 'default' : 'outline'} 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setDevicePreview('tablet');
              }}
            >
              <Smartphone className="h-4 w-4 rotate-90" />
            </Button>
            <Button 
              variant={devicePreview === 'mobile' ? 'default' : 'outline'} 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setDevicePreview('mobile');
              }}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {description || data.description ? (
          <p className="text-sm text-muted-foreground mt-1">
            {description || data.description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <div className="relative border-t" style={{ 
          height: '600px',
          width: devicePreview === 'desktop' ? '100%' : devicePreview === 'tablet' ? '768px' : '375px',
          margin: devicePreview !== 'desktop' ? '0 auto' : undefined,
          overflow: 'auto'
        }}>
          <WireframeCanvasEnhanced 
            sections={sections}
            width={devicePreview === 'desktop' ? 1200 : devicePreview === 'tablet' ? 768 : 375}
            height={2000}
            editable={false}
            showGrid={false}
            snapToGrid={false}
            deviceType={devicePreview}
            responsiveMode={devicePreview !== 'desktop'}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WireframeVisualizer;
