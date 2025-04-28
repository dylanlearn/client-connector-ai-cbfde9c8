
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCompetitiveElements(competitorId?: string) {
  const { user } = useAuth();
  const [elements, setElements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchElements = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('competitive_elements')
          .select(`
            *,
            competitors (
              name as competitor_name
            )
          `);
          
        // Add filter for specific competitor if provided
        if (competitorId) {
          query = query.eq('competitor_id', competitorId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Format the data to simplify access to competitor name
        const formattedData = data.map(item => ({
          ...item,
          competitor_name: item.competitors?.competitor_name
        }));
        
        setElements(formattedData || []);
      } catch (err) {
        console.error('Error fetching competitive elements:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchElements();
  }, [user?.id, competitorId]);

  const addElement = async (element: any) => {
    if (!user?.id) {
      toast.error('You must be logged in to add elements');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('competitive_elements')
        .insert(element)
        .select(`
          *,
          competitors (
            name as competitor_name
          )
        `)
        .single();
        
      if (error) throw error;
      
      // Format the data
      const formattedData = {
        ...data,
        competitor_name: data.competitors?.competitor_name
      };
      
      setElements(prev => [formattedData, ...prev]);
      toast.success('Element added successfully');
      return formattedData;
    } catch (err) {
      console.error('Error adding element:', err);
      toast.error('Failed to add element');
      return null;
    }
  };

  const updateElement = async (id: string, updates: any) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('competitive_elements')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setElements(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      toast.success('Element updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating element:', err);
      toast.error('Failed to update element');
      return false;
    }
  };

  const deleteElement = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('competitive_elements')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setElements(prev => prev.filter(item => item.id !== id));
      toast.success('Element deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting element:', err);
      toast.error('Failed to delete element');
      return false;
    }
  };

  return {
    elements,
    isLoading,
    error,
    addElement,
    updateElement,
    deleteElement
  };
}
