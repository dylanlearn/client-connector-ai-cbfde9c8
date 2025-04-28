
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ServiceConnections } from './ServiceConnections';
import { ServiceMappings } from './ServiceMappings';
import { ServiceSyncLogs } from './ServiceSyncLogs';
import { ExternalServiceConnector } from '@/services/external-service/external-service-connector';
import type { ExternalServiceConnection } from '@/types/external-service';

interface ExternalServiceManagerProps {
  projectId: string;
}

export function ExternalServiceManager({ projectId }: ExternalServiceManagerProps) {
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState<ExternalServiceConnection[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      loadConnections();
    }
  }, [projectId]);

  const loadConnections = async () => {
    setIsLoading(true);
    try {
      const data = await ExternalServiceConnector.getConnections(projectId);
      setConnections(data);
      
      // Select the first connection by default if it exists
      if (data.length > 0 && !selectedConnectionId) {
        setSelectedConnectionId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading connections:", error);
      toast({
        title: "Error loading connections",
        description: "Failed to load service connections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncService = async (connectionId: string) => {
    try {
      await ExternalServiceConnector.syncExternalService(connectionId);
      toast({
        title: "Service synced",
        description: "Service has been synced successfully.",
      });
      setActiveTab('logs');
    } catch (error) {
      console.error("Error syncing service:", error);
      toast({
        title: "Error syncing service",
        description: "Failed to sync service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConnectionCreated = (newConnection: ExternalServiceConnection) => {
    setConnections(prev => [newConnection, ...prev]);
    setSelectedConnectionId(newConnection.id);
    toast({
      title: "Connection created",
      description: "Service connection has been created successfully.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>External Service Connectors</CardTitle>
        <CardDescription>
          Connect and synchronize with external services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="connections">
              <ServiceConnections 
                connections={connections}
                isLoading={isLoading}
                projectId={projectId}
                selectedConnectionId={selectedConnectionId}
                onConnectionSelect={setSelectedConnectionId}
                onConnectionCreated={handleConnectionCreated}
                onSync={syncService}
                onRefresh={loadConnections}
              />
            </TabsContent>
            
            <TabsContent value="mappings">
              <ServiceMappings 
                connectionId={selectedConnectionId}
                isConnectionSelected={!!selectedConnectionId}
              />
            </TabsContent>
            
            <TabsContent value="logs">
              <ServiceSyncLogs 
                connectionId={selectedConnectionId}
                isConnectionSelected={!!selectedConnectionId}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
