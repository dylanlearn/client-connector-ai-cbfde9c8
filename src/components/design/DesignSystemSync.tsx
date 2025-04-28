
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Refresh, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DesignSystemService } from '@/services/design-system/design-system-service';

interface DesignSystemSyncProps {
  projectId: string;
  wireframeId: string;
}

interface SyncLog {
  id: string;
  project_id: string;
  wireframe_id: string;
  sync_direction: 'to_wireframe' | 'from_wireframe';
  status: 'pending' | 'completed' | 'conflict' | 'failed';
  changes: any;
  conflicts: any[];
  resolved_conflicts: any[];
  created_at: string;
  completed_at?: string;
}

export function DesignSystemSync({ projectId, wireframeId }: DesignSystemSyncProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [overrideConflicts, setOverrideConflicts] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSyncHistory();
  }, [projectId, wireframeId]);

  const loadSyncHistory = async () => {
    try {
      setIsLoading(true);
      const logs = await DesignSystemService.getSyncHistory(projectId, wireframeId);
      setSyncLogs(logs as SyncLog[]);
    } catch (error) {
      console.error('Error loading sync history:', error);
      toast({
        title: "Error",
        description: "Failed to load sync history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncToWireframe = async () => {
    try {
      setIsSyncing(true);
      const result = await DesignSystemService.syncDesignSystemToWireframe(
        projectId, 
        wireframeId, 
        overrideConflicts
      );
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Design system synced to wireframe"
        });
        loadSyncHistory();
      } else {
        toast({
          title: "Sync Incomplete",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error syncing design system:', error);
      toast({
        title: "Error",
        description: "Failed to sync design system",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncFromWireframe = async () => {
    try {
      setIsSyncing(true);
      const result = await DesignSystemService.syncWireframeToDesignSystem(
        projectId, 
        wireframeId, 
        overrideConflicts
      );
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Wireframe changes synced to design system"
        });
        loadSyncHistory();
      } else {
        toast({
          title: "Sync Incomplete",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error syncing wireframe changes:', error);
      toast({
        title: "Error",
        description: "Failed to sync wireframe changes",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Refresh className="h-5 w-5 mr-2" />
          Design System Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="override" 
            checked={overrideConflicts} 
            onCheckedChange={(checked) => setOverrideConflicts(checked === true)}
          />
          <Label htmlFor="override">Override conflicts</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={handleSyncToWireframe} 
            disabled={isSyncing}
            className="w-full flex items-center justify-center"
          >
            <Refresh className="h-4 w-4 mr-2" /> Apply Design System
          </Button>
          
          <Button 
            onClick={handleSyncFromWireframe} 
            disabled={isSyncing}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <Refresh className="h-4 w-4 mr-2" /> Extract from Wireframe
          </Button>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Sync History</h3>
          {syncLogs.length > 0 ? (
            <div className="space-y-3">
              {syncLogs.slice(0, 5).map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        {log.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        ) : log.status === 'conflict' ? (
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                        ) : (
                          <Refresh className="h-4 w-4 mr-2" />
                        )}
                        <span className="font-medium">
                          {log.sync_direction === 'to_wireframe' ? 'Design System → Wireframe' : 'Wireframe → Design System'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Created: {formatDate(log.created_at)}
                        {log.completed_at && ` • Completed: ${formatDate(log.completed_at)}`}
                      </div>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        log.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        log.status === 'conflict' ? 'bg-amber-100 text-amber-800' : 
                        log.status === 'failed' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  {log.conflicts && log.conflicts.length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium text-amber-600">{log.conflicts.length} conflict(s) detected</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No sync history found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
