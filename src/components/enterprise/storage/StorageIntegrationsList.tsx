
import React, { useState, useEffect } from 'react';
import { StorageIntegration } from '@/types/enterprise-storage';
import { EnterpriseStorageService } from '@/services/enterprise/EnterpriseStorageService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Database, 
  HardDrive, 
  Loader2, 
  PlusCircle, 
  RefreshCw,
  Server,
  Trash2
} from 'lucide-react';
import { StorageIntegrationForm } from './StorageIntegrationForm';
import { toast } from 'sonner';
import { StorageSyncLogs } from './StorageSyncLogs';
import { BackupSchedules } from './BackupSchedules';

export const StorageIntegrationsList: React.FC = () => {
  const [integrations, setIntegrations] = useState<StorageIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<StorageIntegration | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const data = await EnterpriseStorageService.getStorageIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Error loading storage integrations:', error);
      toast.error('Failed to load storage integrations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleSync = async (integrationId: string) => {
    setIsSyncing(integrationId);
    try {
      await EnterpriseStorageService.syncStorage(integrationId);
      // Refresh integrations to update last sync status
      loadIntegrations();
    } catch (error) {
      console.error('Error syncing storage:', error);
    } finally {
      setIsSyncing(null);
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 's3':
      case 'gcs':
        return <Cloud className="h-8 w-8 text-blue-500" />;
      case 'azure':
        return <Server className="h-8 w-8 text-blue-500" />;
      case 'ftp':
      case 'sftp':
        return <HardDrive className="h-8 w-8 text-green-500" />;
      default:
        return <Database className="h-8 w-8 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Enterprise Storage Integrations</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={loadIntegrations}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button onClick={() => {
            setSelectedIntegration(null);
            setShowForm(true);
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Integration
          </Button>
        </div>
      </div>
      
      {showForm ? (
        <StorageIntegrationForm
          integration={selectedIntegration}
          onSave={(integration) => {
            loadIntegrations();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.id} className={!integration.is_active ? 'opacity-70' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {getIntegrationIcon(integration.integration_type)}
                    <div>
                      <CardTitle>{integration.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {integration.integration_type} Integration
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={integration.is_active ? "outline" : "secondary"}>
                    {integration.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Configuration</h4>
                    {integration.integration_type === 's3' && (
                      <div className="text-sm">
                        <p>Bucket: <span className="font-medium">{integration.configuration.bucket}</span></p>
                        <p>Region: {integration.configuration.region}</p>
                      </div>
                    )}
                    {integration.integration_type === 'gcs' && (
                      <div className="text-sm">
                        <p>Bucket: <span className="font-medium">{integration.configuration.bucket}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  if (showDetails === integration.id) {
                    setShowDetails(null);
                  } else {
                    setShowDetails(integration.id);
                  }
                }}>
                  {showDetails === integration.id ? "Hide Details" : "View Details"}
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleSync(integration.id)}
                  disabled={isSyncing === integration.id}
                >
                  {isSyncing === integration.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </>
                  )}
                </Button>
              </CardFooter>

              {showDetails === integration.id && (
                <div className="border-t px-6 py-4 space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Sync Logs</h4>
                    <StorageSyncLogs integrationId={integration.id} />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Backup Schedules</h4>
                    <BackupSchedules integrationId={integration.id} />
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setShowForm(true);
                      }}
                    >
                      Edit Configuration
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
          
          {integrations.length === 0 && !isLoading && (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>No Storage Integrations</CardTitle>
                <CardDescription>
                  Add your first enterprise storage integration to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Button onClick={() => setShowForm(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Storage Integration
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
