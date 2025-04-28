
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCompetitors() {
  const { user } = useAuth();
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchCompetitors = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('competitors')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        setCompetitors(data || []);
      } catch (err) {
        console.error('Error fetching competitors:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitors();
  }, [user?.id]);

  const addCompetitor = async (competitor: any) => {
    if (!user?.id) {
      toast.error('You must be logged in to add competitors');
      return null;
    }
    
    try {
      const newCompetitor = {
        ...competitor,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('competitors')
        .insert(newCompetitor)
        .select()
        .single();
        
      if (error) throw error;
      
      setCompetitors(prev => [...prev, data]);
      toast.success('Competitor added successfully');
      return data;
    } catch (err) {
      console.error('Error adding competitor:', err);
      toast.error('Failed to add competitor');
      return null;
    }
  };

  const updateCompetitor = async (id: string, updates: any) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('competitors')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setCompetitors(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      toast.success('Competitor updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating competitor:', err);
      toast.error('Failed to update competitor');
      return false;
    }
  };

  const deleteCompetitor = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setCompetitors(prev => prev.filter(item => item.id !== id));
      toast.success('Competitor deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting competitor:', err);
      toast.error('Failed to delete competitor');
      return false;
    }
  };

  return {
    competitors,
    isLoading,
    error,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor
  };
}
