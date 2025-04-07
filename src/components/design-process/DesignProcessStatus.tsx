
import React from 'react';
import { useDesignProcess } from '@/contexts/design-process/DesignProcessProvider';
import { Progress } from '@/components/ui/progress';
import { DesignStage } from '@/contexts/design-process/DesignProcessProvider';

const DesignProcessStatus = () => {
  const { currentStage, progress } = useDesignProcess();
  
  const stages: { id: DesignStage; name: string }[] = [
    { id: 'intake', name: 'Client Intake' },
    { id: 'analysis', name: 'Design Brief' },
    { id: 'wireframe', name: 'Wireframing' },
    { id: 'moodboard', name: 'Visual Direction' },
    { id: 'design', name: 'Design Development' },
    { id: 'delivery', name: 'Delivery' }
  ];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Design Process</h2>
        <span className="text-sm text-gray-500">{progress}% Complete</span>
      </div>
      
      <Progress value={progress} className="mb-4" />
      
      <div className="flex flex-wrap gap-2 md:gap-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`px-3 py-1 rounded-full text-xs 
              ${currentStage === stage.id 
                ? 'bg-primary text-primary-foreground font-medium' 
                : 'bg-muted text-muted-foreground'
              }`}
          >
            {stage.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignProcessStatus;
