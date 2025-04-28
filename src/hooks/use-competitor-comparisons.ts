
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCompetitorComparisons(wireframeId?: string) {
  const { user } = useAuth();
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [positioningSummary, setPositioningSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!wireframeId || !user?.id) return;
    
    const fetchComparisons = async () => {
      try {
        setIsLoading(true);
        
        // Fetch wireframe comparisons
        const { data, error } = await supabase
          .from('wireframe_competitor_comparisons')
          .select(`
            *,
            competitive_elements (
              element_type,
              name,
              competitor_id,
              competitors (
                name
              )
            )
          `)
          .eq('wireframe_id', wireframeId);
          
        if (error) throw error;
        
        // Format the data to simplify access
        const formattedData = data.map(item => ({
          ...item,
          competitor_element_name: item.competitive_elements?.name || 'Unknown element',
          competitor_name: item.competitive_elements?.competitors?.name || 'Unknown competitor'
        }));
        
        setComparisons(formattedData || []);
        
        // Calculate summary
        const superior = data.filter(item => item.rating === 'superior').length;
        const equal = data.filter(item => item.rating === 'equal').length;
        const inferior = data.filter(item => item.rating === 'inferior').length;
        
        setPositioningSummary({
          superior,
          equal,
          inferior,
          total: data.length
        });
        
      } catch (err) {
        console.error('Error fetching comparisons:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisons();
  }, [wireframeId, user?.id]);
  
  const addComparison = async (comparison: any) => {
    if (!user?.id || !wireframeId) {
      toast.error('Missing required information');
      return null;
    }
    
    try {
      const newComparison = {
        ...comparison,
        wireframe_id: wireframeId
      };
      
      const { data, error } = await supabase
        .from('wireframe_competitor_comparisons')
        .insert(newComparison)
        .select(`
          *,
          competitive_elements (
            element_type,
            name,
            competitor_id,
            competitors (
              name
            )
          )
        `)
        .single();
        
      if (error) throw error;
      
      // Format the new data
      const formattedData = {
        ...data,
        competitor_element_name: data.competitive_elements?.name || 'Unknown element',
        competitor_name: data.competitive_elements?.competitors?.name || 'Unknown competitor'
      };
      
      // Update local state
      setComparisons(prev => [...prev, formattedData]);
      
      // Update summary
      setPositioningSummary(prev => {
        const newSummary = { ...prev };
        newSummary[data.rating] = (newSummary[data.rating] || 0) + 1;
        newSummary.total = (newSummary.total || 0) + 1;
        return newSummary;
      });
      
      toast.success('Comparison added successfully');
      return formattedData;
    } catch (err) {
      console.error('Error adding comparison:', err);
      toast.error('Failed to add comparison');
      return null;
    }
  };
  
  const deleteComparison = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      // Get the comparison first to update summary after deletion
      const { data: comparison, error: fetchError } = await supabase
        .from('wireframe_competitor_comparisons')
        .select('rating')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Delete the comparison
      const { error } = await supabase
        .from('wireframe_competitor_comparisons')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setComparisons(prev => prev.filter(item => item.id !== id));
      
      // Update summary
      if (comparison?.rating) {
        setPositioningSummary(prev => {
          const newSummary = { ...prev };
          newSummary[comparison.rating] = Math.max(0, (newSummary[comparison.rating] || 0) - 1);
          newSummary.total = Math.max(0, (newSummary.total || 0) - 1);
          return newSummary;
        });
      }
      
      toast.success('Comparison removed successfully');
      return true;
    } catch (err) {
      console.error('Error deleting comparison:', err);
      toast.error('Failed to delete comparison');
      return false;
    }
  };

  return {
    comparisons,
    positioningSummary,
    isLoading,
    error,
    addComparison,
    deleteComparison
  };
}
