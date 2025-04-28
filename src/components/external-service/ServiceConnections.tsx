import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import type { ExternalServiceConnection } from '@/types/external-service';

interface ServiceConnectionsProps {
  connections: ExternalServiceConnection[];
  isLoading: boolean;
  projectId: string;
  selectedConnectionId: string | null;
  onConnectionSelect: (connectionId: string) => void;
  onConnectionCreated: (connection: ExternalServiceConnection) => void;
  onSync: (connectionId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function ServiceConnections({
  connections,
  isLoading,
  projectId,
  selectedConnectionId,
  onConnectionSelect,
  onConnectionCreated,
  onSync,
  onRefresh,
}: ServiceConnectionsProps) {
  const [isCreating, setIsCreating] = React.useState(false);
  const [serviceName, setServiceName] = React.useState('');
  const [serviceType, setServiceType] = React.useState('');
  const [connectionConfig, setConnectionConfig] = React.useState('');
  const [authConfig, setAuthConfig] = React.useState('');
  const [syncFrequency, setSyncFrequency] = React.useState('');
  const { toast } = useToast();

  const handleCreateConnection = async () => {
    setIsCreating(true);
    try {
      const parsedConnectionConfig = JSON.parse(connectionConfig || '{}');
      const parsedAuthConfig = JSON.parse(authConfig || '{}');

      const response = await fetch('/api/external-service/create-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectId,
          serviceName: serviceName,
          serviceType: serviceType,
          connectionConfig: parsedConnectionConfig,
          authConfig: parsedAuthConfig,
          syncFrequency: syncFrequency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create connection');
      }

      const newConnection = await response.json() as ExternalServiceConnection;
      onConnectionCreated(newConnection);

      toast({
        title: 'Connection created',
        description: 'Service connection has been created successfully.',
      });
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error creating connection:', error);
      toast({
        title: 'Error creating connection',
        description: error.message || 'Failed to create service connection. Please try again.',
        variant: 'destructive',
      });
      setIsCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Service Connections</h3>
        <p className="text-sm text-muted-foreground">
          Manage connections to external services.
        </p>
      </div>

      {isLoading ? (
        <p>Loading connections...</p>
      ) : (
        <div className="grid gap-4">
          {connections.map((connection) => (
            <Card
              key={connection.id}
              className={`border-2 ${selectedConnectionId === connection.id ? 'border-primary' : 'border-transparent'
                }`}
            >
              <div className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-semibold">{connection.service_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Type: {connection.service_type}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSync(connection.id)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onConnectionSelect(connection.id)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Create New Connection</h3>
        <div className="grid gap-4">
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              id="serviceName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
              Service Type
            </label>
            <input
              type="text"
              id="serviceType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="connectionConfig" className="block text-sm font-medium text-gray-700">
              Connection Config (JSON)
            </label>
            <textarea
              id="connectionConfig"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={connectionConfig}
              onChange={(e) => setConnectionConfig(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="authConfig" className="block text-sm font-medium text-gray-700">
              Auth Config (JSON)
            </label>
            <textarea
              id="authConfig"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={authConfig}
              onChange={(e) => setAuthConfig(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="syncFrequency" className="block text-sm font-medium text-gray-700">
              Sync Frequency
            </label>
            <input
              type="text"
              id="syncFrequency"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={syncFrequency}
              onChange={(e) => setSyncFrequency(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateConnection} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Connection'}
          </Button>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
}
