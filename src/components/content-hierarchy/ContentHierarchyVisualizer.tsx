
import React, { useState } from 'react';
import { useContentHierarchy, ContentNode } from '@/hooks/use-content-hierarchy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';

interface ContentHierarchyVisualizerProps {
  projectId: string;
  className?: string;
}

const ContentHierarchyVisualizer: React.FC<ContentHierarchyVisualizerProps> = ({ 
  projectId,
  className
}) => {
  const { nodes, isLoading, error, addNode, deleteNode, analysis } = useContentHierarchy(projectId);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [newNode, setNewNode] = useState<{
    title: string;
    node_type: 'page' | 'section' | 'component' | 'text' | 'media';
    parent_id: string | null;
  }>({
    title: '',
    node_type: 'section',
    parent_id: null
  });

  const toggleNode = (nodeId: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(nodeId)) {
      newExpandedNodes.delete(nodeId);
    } else {
      newExpandedNodes.add(nodeId);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const handleAddNode = async () => {
    if (!newNode.title.trim()) return;
    
    await addNode({
      title: newNode.title,
      node_type: newNode.node_type,
      parent_id: newNode.parent_id,
      project_id: projectId,
      priority: 0,
      position_order: 0
    });
    
    setNewNode({
      title: '',
      node_type: 'section',
      parent_id: null
    });
  };

  const renderNode = (node: ContentNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    
    return (
      <div key={node.id} className="content-node">
        <div 
          className={`flex items-center py-1 px-2 rounded hover:bg-gray-100 ${level > 0 ? 'ml-' + (level * 4) : ''}`}
          style={{ marginLeft: `${level * 16}px` }}
        >
          {hasChildren && (
            <button 
              className="mr-1 p-1 rounded-full hover:bg-gray-200"
              onClick={() => toggleNode(node.id)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <div className="flex-1 flex items-center">
            <span className="font-medium mr-2">{node.title}</span>
            <span className="text-xs text-gray-500 mr-2">{node.node_type}</span>
            {node.priority > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                P{node.priority}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setNewNode({
                title: '',
                node_type: 'component',
                parent_id: node.id
              })}
            >
              <Plus size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => deleteNode(node.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderAnalysis = () => {
    if (!analysis) return null;
    
    return (
      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Hierarchy Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Nodes</p>
            <p className="text-xl font-bold">{analysis.total_nodes}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max Depth</p>
            <p className="text-xl font-bold">{analysis.max_depth}</p>
          </div>
        </div>
        
        <h4 className="text-sm font-medium mt-4 mb-2">By Type</h4>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(analysis.by_type || {}).map(([type, count]) => (
            <div key={type} className="bg-white p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">{type}</p>
              <p className="font-semibold">{count}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (error) {
    return <AlertMessage type="error">Failed to load content hierarchy: {error.message}</AlertMessage>;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Content Hierarchy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Node title"
            value={newNode.title}
            onChange={(e) => setNewNode({ ...newNode, title: e.target.value })}
            className="flex-1"
          />
          <Select
            value={newNode.node_type}
            onValueChange={(value) => setNewNode({ 
              ...newNode, 
              node_type: value as 'page' | 'section' | 'component' | 'text' | 'media' 
            })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="section">Section</SelectItem>
              <SelectItem value="component">Component</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="media">Media</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddNode}>Add Node</Button>
        </div>
        
        {newNode.parent_id && (
          <div className="mb-4 bg-blue-50 p-2 rounded flex items-center justify-between">
            <p className="text-sm">Adding as child of parent node</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setNewNode({ ...newNode, parent_id: null })}
            >
              Cancel
            </Button>
          </div>
        )}
        
        <div className="max-h-[500px] overflow-y-auto border rounded-md p-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : nodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No content nodes yet. Add your first node to start building the hierarchy.
            </div>
          ) : (
            <div>
              {nodes.map(node => renderNode(node))}
            </div>
          )}
        </div>
        
        {renderAnalysis()}
      </CardContent>
    </Card>
  );
};

export default ContentHierarchyVisualizer;
