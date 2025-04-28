
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Plus, Database, Sync } from 'lucide-react';
import { ExternalServiceConnector } from '@/services/external-service/external-service-connector';
import type { ExternalServiceConnection } from '@/types/external-service';

interface ServiceConnectionsProps {
  connections: ExternalServiceConnection[];
  isLoading: boolean;
  projectId: string;
  selectedConnectionId: string | null;
  onConnectionSelect: (id: string) => void;
  onConnectionCreated: (connection: ExternalServiceConnection) => void;
  onSync: (connectionId: string) => void;
  onRefresh: () => void;
}

export function ServiceConnections({ 
  connections, 
  isLoading, 
  projectId,
  selectedConnectionId,
  onConnectionSelect,
  onConnectionCreated,
  onSync,
  onRefresh
}: ServiceConnectionsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState('figma');
  const [connectionConfig, setConnectionConfig] = useState('{}');
  const [authConfig, setAuthConfig] = useState('{}');
  const [syncFrequency, setSyncFrequency] = useState('');

  const createConnection = async () => {
    if (!serviceName) return;

    let parsedConnectionConfig: Record<string, any>;
    let parsedAuthConfig: Record<string, any>;

    try {
      parsedConnectionConfig = JSON.parse(connectionConfig);
      parsedAuthConfig = JSON.parse(authConfig);
    } catch (e) {
      console.error("Invalid JSON configuration");
      return;
    }

    setIsCreating(true);
    try {
      const newConnection = await ExternalServiceConnector.createConnection(
        serviceName,
        serviceType,
        parsedConnectionConfig,
        parsedAuthConfig,
        projectId,
        syncFrequency || undefined
      );
      
      setShowDialog(false);
      resetForm();
      onConnectionCreated(newConnection);
    } catch (error) {
      console.error("Error creating connection:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setServiceName('');
    setServiceType('figma');
    setConnectionConfig('{}');
    setAuthConfig('{}');
    setSyncFrequency('');
  };

  const formatServiceType = (type: string) => {
    switch (type) {
      case 'figma':
        return 'Figma';
      case 'github':
        return 'GitHub';
      case 'jira':
        return 'Jira';
      case 'slack':
        return 'Slack';
      default:
        return 'Custom';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Service Connections</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Service Connection</DialogTitle>
                <DialogDescription>
                  Connect to an external service for data synchronization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input 
                      id="serviceName" 
                      value={serviceName} 
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="My Figma Project"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <select
                      id="serviceType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="figma">Figma</option>
                      <option value="github">GitHub</option>
                      <option value="jira">Jira</option>
                      <option value="slack">Slack</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="connectionConfig">Connection Configuration (JSON)</Label>
                  <Textarea 
                    id="connectionConfig" 
                    value={connectionConfig} 
                    onChange={(e) => setConnectionConfig(e.target.value)}
                    placeholder="{}"
                    className="font-mono text-sm h-20"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="authConfig">Authentication Configuration (JSON)</Label>
                  <Textarea 
                    id="authConfig" 
                    value={authConfig} 
                    onChange={(e) => setAuthConfig(e.target.value)}
                    placeholder="{}"
                    className="font-mono text-sm h-20"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="syncFrequency">Sync Frequency (optional)</Label>
                  <Input 
                    id="syncFrequency" 
                    value={syncFrequency} 
                    onChange={(e) => setSyncFrequency(e.target.value)}
                    placeholder="daily, hourly, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button 
                  onClick={createConnection} 
                  disabled={isCreating || !serviceName}
                >
                  {isCreating ? "Creating..." : "Create Connection"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : connections.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No service connections found. Create a new connection to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {connections.map(connection => (
            <Card 
              key={connection.id} 
              className={`overflow-hidden cursor-pointer hover:bg-gray-50 transition ${
                selectedConnectionId === connection.id ? 'border-primary' : ''
              }`}
              onClick={() => onConnectionSelect(connection.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <h3 className="font-semibold">{connection.service_name}</h3>
                      <Badge variant="outline">
                        {formatServiceType(connection.service_type)}
                      </Badge>
                      <Badge variant={connection.is_active ? "default" : "outline"}>
                        {connection.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {connection.last_sync_at && (
                      <p className="text-xs text-muted-foreground">
                        Last synced: {new Date(connection.last_sync_at).toLocaleString()}
                      </p>
                    )}
                    {connection.sync_frequency && (
                      <p className="text-xs text-muted-foreground">
                        Sync frequency: {connection.sync_frequency}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSync(connection.id);
                    }}
                  >
                    <Sync className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
