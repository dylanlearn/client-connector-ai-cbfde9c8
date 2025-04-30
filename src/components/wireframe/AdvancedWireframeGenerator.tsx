
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AdvancedWireframeGeneratorProps {
  viewMode?: 'edit' | 'preview';
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  viewMode = 'edit'
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="p-4 text-center">
          <p>Advanced Wireframe Generator - Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedWireframeGenerator;
