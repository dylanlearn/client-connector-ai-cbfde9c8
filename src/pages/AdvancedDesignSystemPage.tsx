
import React, { useState } from 'react';
import { CulturalDesignAdapter } from '@/components/cultural-adaptation/CulturalDesignAdapter';
import { DeviceContextAdapter, CulturalContext } from '@/components/device-adaptation/DeviceContextAdapter';
import { ContextComponentSelector } from '@/components/context-aware/ContextComponentSelector';
import { ContentHierarchyVisualizer } from '@/components/content-hierarchy/ContentHierarchyVisualizer';
import { useDeviceContextAdaptation, DeviceContext } from '@/hooks/use-device-context-adaptation';
import { useContextComponentSelection } from '@/hooks/use-context-component-selection';
import { AlertMessage } from '@/components/ui/alert-message';

export default function AdvancedDesignSystemPage() {
  const [selectedDeviceContext, setSelectedDeviceContext] = useState<DeviceContext | null>(null);
  const [selectedCultureContext, setSelectedCultureContext] = useState<CulturalContext | null>(null);
  const [currentContext, setCurrentContext] = useState<string>('product-page');
  const { recommendations, guidelines, isLoading, error } = useContextComponentSelection(currentContext);

  // Example content hierarchy data
  const contentHierarchyData = {
    nodes: [
      { id: '1', label: 'Home Page', type: 'page', priority: 3 },
      { id: '2', label: 'Product Section', type: 'section', parent: '1', priority: 2 },
      { id: '3', label: 'Feature List', type: 'component', parent: '2', priority: 1 },
      { id: '4', label: 'Product Image', type: 'component', parent: '2', priority: 3 },
      { id: '5', label: 'Call to Action', type: 'component', parent: '2', priority: 3 },
      { id: '6', label: 'About Page', type: 'page', priority: 2 },
      { id: '7', label: 'Company Info', type: 'section', parent: '6', priority: 2 },
      { id: '8', label: 'Team Section', type: 'section', parent: '6', priority: 1 },
    ],
    edges: [
      { from: '1', to: '2', label: 'contains' },
      { from: '2', to: '3', label: 'contains' },
      { from: '2', to: '4', label: 'contains' },
      { from: '2', to: '5', label: 'contains' },
      { from: '6', to: '7', label: 'contains' },
      { from: '6', to: '8', label: 'contains' },
      { from: '3', to: '5', label: 'leads to' },
    ]
  };

  const contextOptions = [
    { value: 'homepage', label: 'Homepage' },
    { value: 'product-page', label: 'Product Page' },
    { value: 'blog', label: 'Blog' },
    { value: 'checkout', label: 'Checkout' },
    { value: 'contact', label: 'Contact Page' },
  ];

  const handleDeviceChange = (deviceContext: DeviceContext) => {
    setSelectedDeviceContext(deviceContext);
    console.log('Device changed:', deviceContext);
  };

  const handleCultureChange = (culturalContext: CulturalContext) => {
    setSelectedCultureContext(culturalContext);
    console.log('Culture changed:', culturalContext);
  };

  const handleContextChange = (context: string) => {
    setCurrentContext(context);
  };

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Advanced Design System</h1>
        <p className="text-muted-foreground mb-6">
          Explore content hierarchies, context-aware components, device adaptations, and cultural design variations
        </p>
      </div>
      
      {error && <AlertMessage type="error">{error.message}</AlertMessage>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Hierarchy Visualization */}
        <ContentHierarchyVisualizer data={contentHierarchyData} className="col-span-2" />
        
        {/* Device & Cultural Context Adapters */}
        <DeviceContextAdapter 
          onDeviceChange={handleDeviceChange} 
          onCultureChange={handleCultureChange}
        />
        
        {/* Cultural Design Adapter */}
        <CulturalDesignAdapter culturalContext={selectedCultureContext} />
        
        {/* Context-Aware Component Selector */}
        <ContextComponentSelector 
          className="col-span-2"
          context={currentContext}
          onContextChange={handleContextChange}
          contextOptions={contextOptions}
          recommendations={recommendations}
          guidelines={guidelines}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
