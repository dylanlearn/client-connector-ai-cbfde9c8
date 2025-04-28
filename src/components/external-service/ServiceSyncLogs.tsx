import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ExternalServiceSyncLog } from '@/types/external-service';

interface ServiceSyncLogsProps {
  connectionId: string | null;
  isConnectionSelected: boolean;
}

export function ServiceSyncLogs({ connectionId, isConnectionSelected }: ServiceSyncLogsProps) {
  const [syncLogs, setSyncLogs] = React.useState<ExternalServiceSyncLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (connectionId) {
      loadSyncLogs(connectionId);
    }
  }, [connectionId]);

  const loadSyncLogs = async (connectionId: string) => {
    setIsLoading(true);
    try {
      // const data = await ExternalServiceConnector.getSyncLogs(connectionId);
      // setSyncLogs(data);
      setSyncLogs([
        {
          id: '1',
          connection_id: connectionId,
          sync_started_at: new Date().toISOString(),
          sync_completed_at: new Date().toISOString(),
          status: 'completed',
          records_processed: 100,
          records_succeeded: 90,
          records_failed: 10,
          error_details: null,
          sync_direction: 'inbound',
        },
        {
          id: '2',
          connection_id: connectionId,
          sync_started_at: new Date().toISOString(),
          sync_completed_at: null,
          status: 'in_progress',
          records_processed: 50,
          records_succeeded: 45,
          records_failed: 5,
          error_details: null,
          sync_direction: 'outbound',
        },
      ]);
    } catch (error) {
      console.error("Error loading sync logs:", error);
      toast({
        title: "Error loading sync logs",
        description: "Failed to load sync logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnectionSelected) {
    return (
      <div className="text-gray-500 italic">
        Please select a connection to view sync logs.
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading sync logs...</div>;
  }

  return (
    <div>
      {syncLogs.length === 0 ? (
        <div className="text-gray-500 italic">No sync logs available for this connection.</div>
      ) : (
        syncLogs.map((log) => (
          <Card key={log.id} className="mb-4">
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Sync Started At:</strong> {new Date(log.sync_started_at).toLocaleString()}
                </div>
                <div>
                  <strong>Sync Completed At:</strong> {log.sync_completed_at ? new Date(log.sync_completed_at).toLocaleString() : 'In Progress'}
                </div>
                <div>
                  <strong>Status:</strong> {log.status}
                </div>
                <div>
                  <strong>Direction:</strong> {log.sync_direction}
                </div>
                <div>
                  <strong>Records Processed:</strong> {log.records_processed}
                </div>
                <div>
                  <strong>Records Succeeded:</strong> {log.records_succeeded}
                </div>
                <div>
                  <strong>Records Failed:</strong> {log.records_failed}
                </div>
                {log.error_details && (
                  <div className="col-span-2">
                    <strong>Error Details:</strong>
                    <pre>{JSON.stringify(log.error_details, null, 2)}</pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
