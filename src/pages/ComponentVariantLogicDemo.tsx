
import React, { useState } from 'react';
import { ComponentDefinitionDemo } from '@/components/ComponentDefinitionDemo';
import { ComponentProfilerDemo } from '@/components/ComponentProfilerDemo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ComponentVariantLogicDemo = () => {
  const [activeTab, setActiveTab] = useState('definitions');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Component Systems</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="definitions">Component Definitions</TabsTrigger>
          <TabsTrigger value="profiler">Performance Profiler</TabsTrigger>
        </TabsList>
        
        <TabsContent value="definitions" className="pt-4">
          <ComponentDefinitionDemo />
        </TabsContent>
        
        <TabsContent value="profiler" className="pt-4">
          <ComponentProfilerDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentVariantLogicDemo;
