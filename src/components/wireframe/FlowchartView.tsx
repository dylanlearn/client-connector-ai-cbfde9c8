
import React, { useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  NodeProps,
  Handle,
  Position,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  LayoutDashboard, 
  LayoutGrid, 
  Image as ImageIcon, 
  Type, 
  ListTree, 
  ShoppingCart, 
  MessageCircle, 
  PanelRight, 
  BarChart3, 
  PieChart,
  Table,
  ExternalLink,
  Maximize2,
  MinusCircle,
  Plus
} from 'lucide-react';

// Node types for the flowchart
const SectionNode = ({ data }: NodeProps) => (
  <div className={`p-3 rounded-md border ${data.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50/50 border-blue-100'}`}>
    <div className="flex items-center">
      {data.icon}
      <span className={`ml-2 font-medium ${data.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        {data.label}
      </span>
    </div>
    <Handle type="target" position={Position.Top} className="!bg-blue-400" />
    <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
  </div>
);

const InteractiveSectionNode = ({ data }: NodeProps) => {
  const reactFlow = useReactFlow();
  
  const onExpand = () => {
    if (data.onExpand) {
      data.onExpand(data.id);
    }
  };

  const onCollapse = () => {
    if (data.onCollapse) {
      data.onCollapse(data.id);
    }
  };

  const onAddSection = () => {
    if (data.onAddSection) {
      data.onAddSection(data.id);
    }
  };

  return (
    <div className={`p-3 rounded-md border ${data.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50/50 border-blue-100'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {data.icon}
          <span className={`ml-2 font-medium ${data.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {data.label}
          </span>
        </div>
        <div className="flex gap-1">
          {data.canExpand && (
            <button 
              onClick={onExpand} 
              className={`p-1 rounded hover:bg-blue-100 ${data.darkMode ? 'hover:bg-gray-700' : ''}`}
              title="Expand section details"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          )}
          {data.canCollapse && (
            <button 
              onClick={onCollapse} 
              className={`p-1 rounded hover:bg-blue-100 ${data.darkMode ? 'hover:bg-gray-700' : ''}`}
              title="Collapse section"
            >
              <MinusCircle className="h-3 w-3" />
            </button>
          )}
          {data.canAddSection && (
            <button 
              onClick={onAddSection} 
              className={`p-1 rounded hover:bg-blue-100 ${data.darkMode ? 'hover:bg-gray-700' : ''}`}
              title="Add new section"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      {data.details && (
        <div className={`mt-1 text-xs p-1 rounded ${data.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-gray-600'}`}>
          {data.details}
        </div>
      )}
      <Handle type="target" position={Position.Top} className="!bg-blue-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  sectionNode: SectionNode,
  interactiveNode: InteractiveSectionNode
};

interface FlowchartViewProps {
  pages: any[];
  showDetails?: boolean;
  darkMode?: boolean;
  interactive?: boolean;
  onNodeClick?: (nodeId: string, nodeData: any) => void;
  onNodeExpand?: (nodeId: string) => void;
  onNodeCollapse?: (nodeId: string) => void;
  onAddSection?: (parentId: string) => void;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ 
  pages = [], 
  showDetails = false,
  darkMode = false,
  interactive = false,
  onNodeClick,
  onNodeExpand,
  onNodeCollapse,
  onAddSection
}) => {
  // Get icon based on section type
  const getSectionIcon = (sectionType: string) => {
    switch (sectionType?.toLowerCase()) {
      case 'hero':
        return <ImageIcon className="h-4 w-4" />;
      case 'features':
        return <LayoutGrid className="h-4 w-4" />;
      case 'testimonials':
        return <MessageCircle className="h-4 w-4" />;
      case 'pricing':
        return <ShoppingCart className="h-4 w-4" />;
      case 'dashboard':
        return <LayoutDashboard className="h-4 w-4" />;
      case 'chart':
        return <BarChart3 className="h-4 w-4" />;
      case 'pie-chart':
        return <PieChart className="h-4 w-4" />;
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'sidebar':
        return <PanelRight className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  // Convert page data to nodes and edges for ReactFlow
  const generateFlowElements = () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    pages.forEach((page, pageIndex) => {
      // Add page node
      const pageId = `page-${pageIndex}`;
      nodes.push({
        id: pageId,
        type: interactive ? 'interactiveNode' : 'sectionNode',
        data: { 
          id: pageId,
          label: page.name || `Page ${pageIndex + 1}`, 
          icon: <ListTree className={`h-4 w-4 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />,
          darkMode,
          details: showDetails ? `Type: ${page.pageType || 'Standard'}` : undefined,
          canExpand: interactive && !showDetails,
          canCollapse: interactive && showDetails,
          canAddSection: interactive,
          onExpand: onNodeExpand,
          onCollapse: onNodeCollapse,
          onAddSection: onAddSection,
          pageData: page
        },
        position: { x: 250, y: yOffset },
        style: { width: 200 }
      });
      
      yOffset += 100;
      
      // Add section nodes
      if (page.sections?.length > 0) {
        page.sections.forEach((section: any, sectionIndex: number) => {
          const sectionId = `section-${pageIndex}-${sectionIndex}`;
          const sectionDetails = showDetails ? 
            `Type: ${section.sectionType || 'Generic'}${section.componentVariant ? `, Variant: ${section.componentVariant}` : ''}` : 
            undefined;
            
          nodes.push({
            id: sectionId,
            type: interactive ? 'interactiveNode' : 'sectionNode',
            data: { 
              id: sectionId,
              label: section.name || section.sectionType || `Section ${sectionIndex + 1}`,
              icon: getSectionIcon(section.sectionType),
              darkMode,
              details: sectionDetails,
              canExpand: interactive && !showDetails,
              canCollapse: interactive && showDetails,
              sectionData: section
            },
            position: { x: 250, y: yOffset },
            style: { width: 200 }
          });
          
          // Add edge from page to first section
          if (sectionIndex === 0) {
            edges.push({
              id: `edge-page-${pageIndex}-section-${sectionIndex}`,
              source: pageId,
              target: sectionId,
              animated: interactive
            });
          }
          
          // Add edge from previous section to this one
          if (sectionIndex > 0) {
            edges.push({
              id: `edge-${pageIndex}-${sectionIndex-1}-${sectionIndex}`,
              source: `section-${pageIndex}-${sectionIndex-1}`,
              target: sectionId
            });
          }
          
          yOffset += 100;
        });
      }
      
      // Add spacing between pages
      yOffset += 50;
    });
    
    return { nodes, edges };
  };
  
  const { nodes, edges } = generateFlowElements();
  
  if (pages.length === 0) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <ListTree className={`h-12 w-12 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
        <p>No page structure available</p>
      </div>
    );
  }

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node.id, node.data);
    }
  };
  
  return (
    <div className={`h-[500px] ${darkMode ? 'bg-gray-900' : 'bg-blue-50'} rounded-lg`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultEdgeOptions={{ animated: false }}
        onNodeClick={interactive ? handleNodeClick : undefined}
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor={darkMode ? '#374151' : '#dbeafe'}
          nodeColor={darkMode ? '#1f2937' : '#eff6ff'}
          maskColor={darkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(239, 246, 255, 0.5)'}
        />
        <Background color={darkMode ? '#4b5563' : '#bfdbfe'} gap={16} />
      </ReactFlow>
    </div>
  );
};
