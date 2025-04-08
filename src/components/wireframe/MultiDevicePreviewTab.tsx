
import React, { useState } from 'react';
import ResponsivePreview from './ResponsivePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Tablet, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWireframeStore } from '@/stores/wireframe-store';

interface MultiDevicePreviewTabProps {
  onSectionClick?: (sectionId: string) => void;
}

const MultiDevicePreviewTab: React.FC<MultiDevicePreviewTabProps> = ({ 
  onSectionClick 
}) => {
  const [isRotated, setIsRotated] = useState(false);
  const { activeDevice, setActiveDevice } = useWireframeStore();

  const handleRotateDevice = () => {
    setIsRotated(!isRotated);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Multi-Device Preview</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRotateDevice}
            disabled={activeDevice === 'desktop'}
            className="gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Rotate
          </Button>
        </div>
      </div>

      <ResponsivePreview onSectionClick={onSectionClick} />
      
      <div className="p-4 bg-muted/30 rounded-md border">
        <h4 className="text-sm font-medium mb-2">Responsive Design Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Test your design across different devices to ensure optimal user experience</li>
          <li>Consider how layouts will stack on smaller screens</li>
          <li>Optimize text size and spacing for readability on mobile</li>
          <li>Ensure interactive elements are sized appropriately for touch targets</li>
        </ul>
      </div>
    </div>
  );
};

export default MultiDevicePreviewTab;
