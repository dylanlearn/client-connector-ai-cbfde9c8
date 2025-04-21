
import React from 'react';
import ResponsiveWireframeDemo from '@/components/wireframe-demo/ResponsiveWireframeDemo';
import { WireframeProvider } from '@/contexts/WireframeContext';

export function ResponsiveWireframeEnhancements() {
  return (
    <WireframeProvider>
      <ResponsiveWireframeDemo />
    </WireframeProvider>
  );
}

export default ResponsiveWireframeEnhancements;
