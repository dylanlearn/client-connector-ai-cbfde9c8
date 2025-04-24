
import React from 'react';
import { InteractionDefinition } from './interaction-system/InteractionDefinition';
import { ComponentContract } from './contract-system/ComponentContract';
import { toast } from 'sonner';

export const ComponentDefinitionDemo = () => {
  const handleInteractionChange = (definition: any) => {
    console.log('Interaction definition updated:', definition);
    toast.success('Interaction definition updated');
  };

  const handleContractChange = (contract: any) => {
    console.log('Component contract updated:', contract);
    toast.success('Component contract updated');
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Component Definition System</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Interaction Definition</h2>
          <InteractionDefinition onInteractionChange={handleInteractionChange} />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Component Contract</h2>
          <ComponentContract onContractChange={handleContractChange} />
        </div>
      </div>
    </div>
  );
};

export default ComponentDefinitionDemo;
