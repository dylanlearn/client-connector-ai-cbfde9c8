
import { Node, Edge } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

// Initial nodes setup for the flow diagram
export const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: 'node-2',
    data: { label: 'Default Node' },
    position: { x: 100, y: 125 },
  },
  {
    id: 'node-3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

// Initial edges setup for the flow diagram
export const initialEdges: Edge[] = [
  { id: uuidv4(), source: 'node-1', target: 'node-2' },
  { id: uuidv4(), source: 'node-2', target: 'node-3' },
];

// Helper function to create a new node
export const createFlowNode = (label: string, position: { x: number, y: number }, type: string = 'default'): Node => {
  return {
    id: uuidv4(),
    type,
    data: { label },
    position,
  };
};

// Helper function to create a new edge
export const createFlowEdge = (source: string, target: string): Edge => {
  return {
    id: uuidv4(),
    source,
    target,
  };
};

// Helper function to layout nodes in a grid
export const layoutNodesGrid = (nodes: Node[], columns: number = 3, spacing: number = 150): Node[] => {
  return nodes.map((node, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    
    return {
      ...node,
      position: {
        x: column * spacing,
        y: row * spacing,
      },
    };
  });
};
