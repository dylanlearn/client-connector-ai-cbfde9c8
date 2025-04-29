
import React, { useState, useEffect } from 'react';
import { StorageSyncLog } from '@/types/enterprise-storage';
import { EnterpriseStorageService } from '@/services/enterprise/EnterpriseStorageService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface StorageSyncLogsProps {
  integrationId: string;
}

export const StorageSyncLogs: React.FC<StorageSyncLogsProps> = ({ integrationId }) => {
  const [logs, setLogs] = useState<StorageSyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<StorageSyncLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await EnterpriseStorageService.getSyncLogs(integrationId);
      setLogs(data);
    } catch (error) {
      console.error('Error loading sync logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (integrationId) {
      loadLogs();
    }
  }, [integrationId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={loadLogs} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Logs"}
          </Button>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Results</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No sync logs available
                  </TableCell>
                </TableRow>
              ) : (
                logs.slice(0, 5).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDistanceToNow(new Date(log.started_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>{log.files_processed || '—'}</TableCell>
                    <TableCell>
                      {log.status === 'completed' ? (
                        <span className="text-sm">
                          {log.files_succeeded} success, {log.files_failed} failed
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetails(true);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedLog && getStatusIcon(selectedLog.status)}
              <span className="ml-2">Sync Details</span>
            </DialogTitle>
            <DialogDescription>
              Details about the storage synchronization job
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Started</p>
                  <p className="font-medium">
                    {format(new Date(selectedLog.started_at), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{getStatusBadge(selectedLog.status)}</p>
                </div>
                
                {selectedLog.completed_at && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="font-medium">
                        {format(new Date(selectedLog.completed_at), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(selectedLog.started_at), { 
                          includeSeconds: true,
                          addSuffix: false 
                        })}
                      </p>
                    </div>
                  </>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Files Processed</p>
                  <p className="font-medium">{selectedLog.files_processed || '0'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Results</p>
                  <p className="font-medium">
                    {selectedLog.files_succeeded || '0'} success, {selectedLog.files_failed || '0'} failed
                  </p>
                </div>
              </div>
              
              {selectedLog.error_details && Object.keys(selectedLog.error_details).length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Error Details</p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto text-xs">
                    {JSON.stringify(selectedLog.error_details, null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Additional Details</p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto text-xs">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
