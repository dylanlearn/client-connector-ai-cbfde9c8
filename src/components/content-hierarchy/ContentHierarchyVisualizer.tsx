
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileTree, FolderTree } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: string;
  parent?: string;
  priority: number;
}

interface Edge {
  from: string;
  to: string;
  label: string;
}

interface HierarchyData {
  nodes: Node[];
  edges: Edge[];
}

interface ContentHierarchyVisualizerProps {
  className?: string;
  data: HierarchyData;
}

export function ContentHierarchyVisualizer({ className, data }: ContentHierarchyVisualizerProps) {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return '📄';
      case 'section': return '📑';
      case 'component': return '🧩';
      case 'text': return '📝';
      case 'media': return '🖼️';
      default: return '📦';
    }
  };

  // Build tree structure
  const buildTree = (nodes: Node[]) => {
    const nodeMap = new Map<string, Node & { children: any[] }>();
    const rootNodes: any[] = [];

    // First pass: create node map with empty children arrays
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });
    
    // Second pass: populate children arrays
    nodes.forEach(node => {
      if (node.parent && nodeMap.has(node.parent)) {
        nodeMap.get(node.parent)!.children.push(nodeMap.get(node.id));
      } else {
        rootNodes.push(nodeMap.get(node.id));
      }
    });
    
    return rootNodes;
  };

  const tree = buildTree(data.nodes);

  const renderTreeNode = (node: Node & { children: any[] }, depth = 0) => {
    return (
      <div key={node.id} className="relative">
        <div className={cn(
          "pl-4 border-l border-gray-200 ml-2",
          depth === 0 ? "ml-0 border-none" : ""
        )}>
          <div className="py-2 flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(node.type)}</span>
            <span className="font-medium">{node.label}</span>
            <Badge className={cn("ml-2", getPriorityColor(node.priority))}>
              P{node.priority}
            </Badge>
          </div>
          
          {node.children.length > 0 && (
            <div className="ml-4">
              {node.children.map(child => renderTreeNode(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRelationshipView = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Structural Relationships</h3>
            <ul className="space-y-1 text-sm">
              {data.edges
                .filter(edge => edge.label === 'contains')
                .map((edge, index) => {
                  const fromNode = data.nodes.find(n => n.id === edge.from);
                  const toNode = data.nodes.find(n => n.id === edge.to);
                  
                  return (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-muted-foreground">{fromNode?.label}</span>
                      <span className="text-xs">→</span>
                      <span>{toNode?.label}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Functional Relationships</h3>
            <ul className="space-y-1 text-sm">
              {data.edges
                .filter(edge => edge.label !== 'contains')
                .map((edge, index) => {
                  const fromNode = data.nodes.find(n => n.id === edge.from);
                  const toNode = data.nodes.find(n => n.id === edge.to);
                  
                  return (
                    <li key={index} className="flex items-center gap-1">
                      <span>{fromNode?.label}</span>
                      <span className="text-xs px-1 text-muted-foreground">{edge.label}</span>
                      <span>{toNode?.label}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Priority Distribution</h3>
          <div className="grid grid-cols-3 gap-4 mt-3">
            {[1, 2, 3].map(priority => {
              const count = data.nodes.filter(n => n.priority === priority).length;
              return (
                <div key={priority} className="text-center">
                  <div className={cn(
                    "rounded-full h-12 w-12 flex items-center justify-center mx-auto",
                    getPriorityColor(priority)
                  )}>
                    {count}
                  </div>
                  <div className="text-sm mt-1">Priority {priority}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Content Hierarchy Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tree" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tree" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" /> 
              Hierarchy Tree
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex items-center gap-2">
              <FileTree className="h-4 w-4" /> 
              Relationships
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree" className="space-y-4">
            <div className="border rounded-md p-4">
              {tree.length > 0 ? (
                <div className="space-y-2">
                  {tree.map(node => renderTreeNode(node))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hierarchy data available
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="relationships">
            {renderRelationshipView()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
