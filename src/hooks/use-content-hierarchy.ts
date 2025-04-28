
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContentNode {
  id: string;
  parent_id: string | null;
  project_id: string;
  wireframe_id?: string;
  title: string;
  node_type: 'page' | 'section' | 'component' | 'text' | 'media';
  priority: number;
  depth: number;
  path?: string;
  position_order?: number;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  children?: ContentNode[];
}

export interface ContentRelationship {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  strength: number;
  metadata?: Record<string, any>;
}

export interface ContentHierarchyAnalysis {
  total_nodes: number;
  max_depth: number;
  structure: Array<{ level: number; count: number }>;
  by_type: Record<string, number>;
}

export function useContentHierarchy(projectId?: string) {
  const { user } = useAuth();
  const [nodes, setNodes] = useState<ContentNode[]>([]);
  const [relationships, setRelationships] = useState<ContentRelationship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [analysis, setAnalysis] = useState<ContentHierarchyAnalysis | null>(null);

  const fetchHierarchy = useCallback(async () => {
    if (!projectId || !user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch content nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from('content_hierarchy')
        .select('*')
        .eq('project_id', projectId)
        .order('depth', { ascending: true })
        .order('position_order', { ascending: true });
        
      if (nodesError) throw nodesError;
      
      // Fetch relationships
      const { data: relsData, error: relsError } = await supabase
        .from('content_relationships')
        .select('*')
        .in('source_id', nodesData.map(node => node.id));
        
      if (relsError) throw relsError;
      
      // Get hierarchy analysis
      const { data: analysisData, error: analysisError } = await supabase
        .rpc('analyze_content_hierarchy', { p_project_id: projectId });
        
      if (analysisError) throw analysisError;
      
      // Build tree structure for hierarchical display
      const nodeMap = new Map<string, ContentNode>();
      const rootNodes: ContentNode[] = [];
      
      nodesData.forEach(node => {
        nodeMap.set(node.id, { ...node, children: [] });
      });
      
      nodeMap.forEach(node => {
        if (node.parent_id && nodeMap.has(node.parent_id)) {
          const parent = nodeMap.get(node.parent_id);
          parent?.children?.push(node);
        } else {
          rootNodes.push(node);
        }
      });
      
      setNodes(rootNodes);
      setRelationships(relsData || []);
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Error fetching content hierarchy:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch content hierarchy'));
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user?.id]);

  useEffect(() => {
    fetchHierarchy();
  }, [fetchHierarchy]);

  const addNode = async (node: Omit<ContentNode, 'id' | 'depth' | 'path' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to add nodes');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('content_hierarchy')
        .insert({
          ...node,
          project_id: projectId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Node added successfully');
      fetchHierarchy(); // Refresh the hierarchy
      return data;
    } catch (err) {
      console.error('Error adding content node:', err);
      toast.error('Failed to add node');
      return null;
    }
  };

  const updateNode = async (id: string, updates: Partial<ContentNode>) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('content_hierarchy')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Node updated successfully');
      fetchHierarchy(); // Refresh the hierarchy
      return true;
    } catch (err) {
      console.error('Error updating content node:', err);
      toast.error('Failed to update node');
      return false;
    }
  };

  const deleteNode = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      // First, delete any relationships involving this node
      await supabase
        .from('content_relationships')
        .delete()
        .or(`source_id.eq.${id},target_id.eq.${id}`);
      
      // Then delete the node itself
      const { error } = await supabase
        .from('content_hierarchy')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Node deleted successfully');
      fetchHierarchy(); // Refresh the hierarchy
      return true;
    } catch (err) {
      console.error('Error deleting content node:', err);
      toast.error('Failed to delete node');
      return false;
    }
  };

  const addRelationship = async (relationship: Omit<ContentRelationship, 'id'>) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('content_relationships')
        .insert(relationship);
        
      if (error) throw error;
      
      toast.success('Relationship added successfully');
      fetchHierarchy(); // Refresh the hierarchy
      return true;
    } catch (err) {
      console.error('Error adding relationship:', err);
      toast.error('Failed to add relationship');
      return false;
    }
  };

  return {
    nodes,
    relationships,
    analysis,
    isLoading,
    error,
    fetchHierarchy,
    addNode,
    updateNode,
    deleteNode,
    addRelationship
  };
}
