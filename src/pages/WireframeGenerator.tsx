
import React from 'react';
import { AdvancedWireframeGenerator, WireframeVisualizer, WireframeDataVisualizer } from '@/components/wireframe';

const WireframeGeneratorPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Wireframe Generator</h1>
      <AdvancedWireframeGenerator />
    </div>
  );
};

export default WireframeGeneratorPage;
