
import React from 'react';
import {
  ReactFlow,
  Node, 
  Edge,
  Background, 
  Controls,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useUserJourney } from '@/hooks/use-user-journey';

interface UserJourneyFlowProps {
  journeyId: string;
}

export const UserJourneyFlow: React.FC<UserJourneyFlowProps> = ({ journeyId }) => {
  const { journey, isLoading } = useUserJourney(journeyId);
  
  const nodes: Node[] = React.useMemo(() => {
    if (!journey?.steps) return [];
    
    return journey.steps.map((step, index) => ({
      id: step.id,
      type: 'default',
      data: { label: step.title },
      position: { x: index * 200, y: 100 }
    }));
  }, [journey?.steps]);
  
  const edges: Edge[] = React.useMemo(() => {
    if (!journey?.steps) return [];
    
    return journey.steps.slice(0, -1).map((step, index) => ({
      id: `${step.id}-${journey.steps[index + 1].id}`,
      source: step.id,
      target: journey.steps[index + 1].id,
      type: 'smoothstep',
      animated: true
    }));
  }, [journey?.steps]);

  if (isLoading) {
    return <div>Loading journey...</div>;
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
