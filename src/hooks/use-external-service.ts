
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ExternalServiceConnector } from '@/services/external-service/external-service-connector';
import type { ExternalServiceConnection, ExternalServiceMapping, ExternalServiceSyncLog } from '@/types/external-service';
import { supabase } from '@/integrations/supabase/client';

export function useExternalService(projectId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connections, setConnections] = useState<ExternalServiceConnection[]>([]);
  const { toast } = useToast();
  
  const loadConnections = async () => {
    setIsLoading(true);
    try {
      const data = await ExternalServiceConnector.getConnections(projectId);
      setConnections(data);
      return data;
    } catch (error) {
      console.error("Error loading connections:", error);
      toast({
        title: "Error loading connections",
        description: "Failed to load service connections. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const createConnection = async (
    serviceName: string,
    serviceType: string,
    connectionConfig: Record<string, any>,
    authConfig: Record<string, any>,
    syncFrequency?: string
  ) => {
    setIsLoading(true);
    try {
      const connection = await ExternalServiceConnector.createConnection(
        serviceName,
        serviceType,
        connectionConfig,
        authConfig,
        projectId,
        syncFrequency
      );
      
      setConnections(prev => [connection, ...prev]);
      toast({
        title: "Connection created",
        description: "External service connection has been created successfully.",
      });
      
      return connection;
    } catch (error) {
      console.error("Error creating connection:", error);
      toast({
        title: "Error creating connection",
        description: "Failed to create service connection. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const syncService = async (connectionId: string) => {
    setIsSyncing(true);
    try {
      // Call our edge function instead of the RPC
      const { data: result, error } = await supabase.functions.invoke('sync-design-system', {
        body: { connectionId }
      });
      
      if (error) throw error;
      
      if (result.success) {
        toast({
          title: "Service synced",
          description: "Service has been synced successfully.",
        });
      } else {
        throw new Error(result.error || 'Unknown error during sync');
      }
      
      // Refresh the list of connections
      loadConnections();
      
    } catch (error) {
      console.error("Error syncing service:", error);
      toast({
        title: "Error syncing service",
        description: "Failed to sync service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  return {
    connections,
    isLoading,
    isSyncing,
    loadConnections,
    createConnection,
    syncService,
  };
}
