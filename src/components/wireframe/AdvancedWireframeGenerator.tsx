
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import WireframeDataVisualizer from './WireframeDataVisualizer';
import { WireframeData } from '@/types/wireframe';

interface AdvancedWireframeGeneratorProps {
  initialData?: WireframeData;
  projectId?: string;
  onWireframeGenerated?: () => void;
  onWireframeSaved?: () => void;
  darkMode?: boolean;
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  initialData,
  projectId,
  onWireframeGenerated,
  onWireframeSaved,
  darkMode = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Wireframe Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This component is currently under development.</p>
        {initialData && (
          <WireframeDataVisualizer 
            wireframeData={initialData}
            viewMode="preview"  // Added required viewMode prop
            darkMode={darkMode}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedWireframeGenerator;
