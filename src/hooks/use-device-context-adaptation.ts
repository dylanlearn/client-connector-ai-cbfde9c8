
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DeviceContext {
  id: string;
  name: string;
  category: string;
  screen_size_class?: string;
  input_methods?: string[];
  orientation?: string;
  capabilities?: Record<string, any>;
  constraints?: Record<string, any>;
}

export interface ComponentAdaptation {
  id: string;
  component_type: string;
  device_context_id: string;
  adaptation_rules: Record<string, any>;
  priority: number;
}

export function useDeviceContextAdaptation(deviceType?: string) {
  const { user } = useAuth();
  const [deviceContexts, setDeviceContexts] = useState<DeviceContext[]>([]);
  const [currentDevice, setCurrentDevice] = useState<DeviceContext | null>(null);
  const [adaptations, setAdaptations] = useState<ComponentAdaptation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeviceContexts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('device_contexts')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setDeviceContexts(data || []);
      
      // Set current device if deviceType is provided
      if (deviceType) {
        const device = data?.find(d => d.name.toLowerCase() === deviceType.toLowerCase());
        if (device) setCurrentDevice(device);
      } else if (data && data.length > 0) {
        // Default to the first device
        setCurrentDevice(data[0]);
      }
    } catch (err) {
      console.error('Error fetching device contexts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch device contexts'));
    } finally {
      setIsLoading(false);
    }
  }, [deviceType]);

  const fetchAdaptationsForDevice = useCallback(async (deviceId: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('component_adaptations')
        .select('*')
        .eq('device_context_id', deviceId)
        .order('priority', { ascending: false });
        
      if (error) throw error;
      
      setAdaptations(data || []);
    } catch (err) {
      console.error('Error fetching adaptations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch adaptations'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeviceContexts();
  }, [fetchDeviceContexts]);

  useEffect(() => {
    if (currentDevice?.id) {
      fetchAdaptationsForDevice(currentDevice.id);
    }
  }, [currentDevice, fetchAdaptationsForDevice]);

  const getAdaptationForComponent = useCallback((componentType: string): Record<string, any> | null => {
    const adaptation = adaptations.find(a => a.component_type === componentType);
    return adaptation?.adaptation_rules || null;
  }, [adaptations]);

  const addDeviceContext = async (deviceContext: Omit<DeviceContext, 'id'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to add device contexts');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('device_contexts')
        .insert(deviceContext)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Device context added successfully');
      fetchDeviceContexts();
      return data;
    } catch (err) {
      console.error('Error adding device context:', err);
      toast.error('Failed to add device context');
      return null;
    }
  };

  const addComponentAdaptation = async (adaptation: Omit<ComponentAdaptation, 'id'>) => {
    if (!user?.id) {
      toast.error('You must be logged in to add adaptations');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('component_adaptations')
        .insert(adaptation)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Component adaptation added successfully');
      if (adaptation.device_context_id === currentDevice?.id) {
        fetchAdaptationsForDevice(currentDevice.id);
      }
      return data;
    } catch (err) {
      console.error('Error adding component adaptation:', err);
      toast.error('Failed to add component adaptation');
      return null;
    }
  };

  const setDevice = (deviceName: string) => {
    const device = deviceContexts.find(d => d.name === deviceName);
    if (device) {
      setCurrentDevice(device);
      return true;
    }
    return false;
  };

  return {
    deviceContexts,
    currentDevice,
    adaptations,
    isLoading,
    error,
    setDevice,
    getAdaptationForComponent,
    addDeviceContext,
    addComponentAdaptation
  };
}
