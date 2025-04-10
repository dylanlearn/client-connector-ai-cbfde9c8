
import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
} from '@xyflow/react';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { initialEdges, initialNodes } from './utils/flow-utils';
import WireframeVisualizer from './WireframeVisualizer';

interface WireframeFlowProps {
  wireframes: WireframeData[];
  onSelect?: (id: string) => void;
}

const WireframeFlow: React.FC<WireframeFlowProps> = ({ wireframes, onSelect }) => {
  const { setViewport } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedWireframe, setSelectedWireframe] = useState<WireframeData | null>(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeSelect = useCallback((wireframeId: string) => {
    if (onSelect) {
      onSelect(wireframeId);
    }
  }, [onSelect]);

  const handleFitView = useCallback(() => {
    setViewport({ zoom: 1, x: 0, y: 0 });
  }, [setViewport]);

  return (
    <div className="wireframe-flow-container flex h-full">
      <div className="flow-diagram w-2/3 border-r p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Wireframe Flow</CardTitle>
            <CardDescription>Visualize the flow of your wireframes</CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              className="bg-muted rounded-md"
            >
              <Controls />
              <Background variant="cross" gap={12} size={1} />
            </ReactFlow>
          </CardContent>
        </Card>
      </div>

      <div className="wireframe-list w-1/3 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Wireframes</CardTitle>
            <CardDescription>Select a wireframe to view details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 h-[calc(100%-80px)] overflow-auto">
            {wireframes.map((wireframe) => (
              <WireframeVisualizer
                key={wireframe.id}
                wireframe={wireframe}
                onSectionClick={(id) => handleNodeSelect(wireframe.id)}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WireframeFlow;
