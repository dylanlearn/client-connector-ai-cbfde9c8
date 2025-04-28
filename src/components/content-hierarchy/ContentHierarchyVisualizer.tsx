
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, FolderOpen, File } from 'lucide-react';

interface ContentHierarchyVisualizerProps {
  className?: string;
  data: {
    nodes: Array<{
      id: string;
      label: string;
      type: string;
      priority?: number;
      parent?: string;
    }>;
    edges: Array<{
      from: string;
      to: string;
      label?: string;
    }>;
  };
}

export function ContentHierarchyVisualizer({ className, data }: ContentHierarchyVisualizerProps) {
  // Function to build the hierarchical tree structure
  const buildTree = () => {
    const nodeMap = new Map();
    const rootNodes: any[] = [];
    
    // Create nodes map
    data.nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });
    
    // Build hierarchy
    data.nodes.forEach(node => {
      if (node.parent) {
        const parentNode = nodeMap.get(node.parent);
        if (parentNode) {
          parentNode.children.push(nodeMap.get(node.id));
        }
      } else {
        rootNodes.push(nodeMap.get(node.id));
      }
    });
    
    return rootNodes;
  };
  
  // Get relationship edges for a node
  const getEdgesForNode = (nodeId: string) => {
    return data.edges.filter(
      edge => (edge.from === nodeId && edge.to !== nodeId) || 
             (edge.from !== nodeId && edge.to === nodeId)
    );
  };

  const renderNode = (node: any, depth = 0) => {
    const nodeEdges = getEdgesForNode(node.id);
    const isFolder = node.type === 'page' || node.type === 'section';
    const IconComponent = isFolder ? FolderOpen : File;
    const priorityClass = node.priority && node.priority > 2 
      ? 'border-l-amber-500' 
      : node.priority === 2 
        ? 'border-l-blue-400' 
        : 'border-l-gray-300';
    
    return (
      <div key={node.id} className="my-1">
        <div 
          className={cn(
            "flex items-center p-2 rounded-md hover:bg-slate-50 border-l-4", 
            priorityClass
          )}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <IconComponent className="w-5 h-5 mr-2 text-slate-500" />
          <span className="font-medium">{node.label}</span>
          {node.priority && (
            <span className="ml-2 text-xs bg-slate-100 px-2 py-1 rounded-full">
              Priority: {node.priority}
            </span>
          )}
          {node.type && (
            <span className="ml-2 text-xs text-slate-500">
              {node.type}
            </span>
          )}
        </div>
        
        {/* Display any relationships */}
        {nodeEdges.length > 0 && (
          <div className="ml-8 pl-2 border-l border-dashed border-slate-300">
            {nodeEdges.map((edge, index) => (
              <div key={index} className="text-xs text-slate-500 my-1">
                {edge.from === node.id ? 
                  `→ ${edge.label || 'connects to'} ${data.nodes.find(n => n.id === edge.to)?.label}` : 
                  `← ${edge.label || 'connected from'} ${data.nodes.find(n => n.id === edge.from)?.label}`
                }
              </div>
            ))}
          </div>
        )}
        
        {/* Render children recursively */}
        {node.children && node.children.length > 0 && (
          <div className="ml-6">
            {node.children.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootNodes = buildTree();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Content Hierarchy</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-auto">
        {rootNodes.length > 0 ? (
          <div className="space-y-2">
            {rootNodes.map(node => renderNode(node))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No content hierarchy data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
