
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RefreshCw, ChevronDown, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ExternalServiceConnector } from '@/services/external-service/external-service-connector';
import type { ExternalServiceSyncLog } from '@/types/external-service';

interface ServiceSyncLogsProps {
  connectionId: string | null;
  isConnectionSelected: boolean;
}

export function ServiceSyncLogs({ 
  connectionId, 
  isConnectionSelected 
}: ServiceSyncLogsProps) {
  const [syncLogs, setSyncLogs] = useState<ExternalServiceSyncLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (connectionId) {
      loadSyncLogs();
    }
  }, [connectionId]);

  const loadSyncLogs = async () => {
    if (!connectionId) return;

    setIsLoading(true);
    try {
      const data = await ExternalServiceConnector.getSyncLogs(connectionId);
      setSyncLogs(data);
    } catch (error) {
      console.error("Error loading sync logs:", error);
      toast({
        title: "Error loading sync logs",
        description: "Failed to load synchronization logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  const getDirectionBadge = (direction: string) => {
    switch (direction) {
      case 'inbound':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Inbound</Badge>;
      case 'outbound':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Outbound</Badge>;
      case 'bidirectional':
        return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Bidirectional</Badge>;
      default:
        return <Badge variant="outline">{direction}</Badge>;
    }
  };

  if (!isConnectionSelected) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Select a service connection to view synchronization logs.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Synchronization Logs</h3>
        <Button variant="outline" size="sm" onClick={loadSyncLogs} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : syncLogs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No sync logs found. Synchronize the service to see activity.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncLogs.map(log => (
                  <React.Fragment key={log.id}>
                    <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => toggleLogExpansion(log.id)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : log.status === 'failed' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <div className="h-4 w-4 border-2 border-t-blue-500 border-r-blue-500 border-b-blue-100 border-l-blue-100 rounded-full animate-spin"></div>
                          )}
                          {getStatusBadge(log.status)}
                        </div>
                      </TableCell>
                      <TableCell>{getDirectionBadge(log.sync_direction)}</TableCell>
                      <TableCell>{new Date(log.sync_started_at).toLocaleString()}</TableCell>
                      <TableCell>{log.records_processed}</TableCell>
                      <TableCell>
                        {log.records_processed > 0 
                          ? `${Math.round((log.records_succeeded / log.records_processed) * 100)}%` 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {expandedLogId === log.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <Collapsible open={expandedLogId === log.id}>
                          <CollapsibleContent>
                            <div className="p-4 bg-gray-50 text-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Sync Details</h4>
                                  <div className="space-y-1">
                                    <div>
                                      <span className="font-medium">ID:</span> {log.id}
                                    </div>
                                    <div>
                                      <span className="font-medium">Started:</span> {new Date(log.sync_started_at).toLocaleString()}
                                    </div>
                                    {log.sync_completed_at && (
                                      <div>
                                        <span className="font-medium">Completed:</span> {new Date(log.sync_completed_at).toLocaleString()}
                                      </div>
                                    )}
                                    <div>
                                      <span className="font-medium">Duration:</span> {
                                        log.sync_completed_at 
                                          ? `${Math.round((new Date(log.sync_completed_at).getTime() - new Date(log.sync_started_at).getTime()) / 1000)}s` 
                                          : 'In progress'
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Results</h4>
                                  <div className="space-y-1">
                                    <div>
                                      <span className="font-medium">Total Records:</span> {log.records_processed}
                                    </div>
                                    <div>
                                      <span className="font-medium">Succeeded:</span> {log.records_succeeded}
                                    </div>
                                    <div>
                                      <span className="font-medium">Failed:</span> {log.records_failed}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {log.error_details && Object.keys(log.error_details).length > 0 && (
                                <div className="mt-4">
                                  <h4 className="font-semibold mb-2 text-red-600">Errors</h4>
                                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                                    {JSON.stringify(log.error_details, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
