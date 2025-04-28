
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  RefreshCw, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { DesignSystemService, SyncResult } from '@/services/design-system/design-system-service';
import { toast } from 'sonner';

interface DesignSystemSyncProps {
  projectId: string;
  wireframeId: string;
}

export function DesignSystemSync({ projectId, wireframeId }: DesignSystemSyncProps) {
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [overrideConflicts, setOverrideConflicts] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    if (projectId && wireframeId) {
      loadSyncHistory();
    }
  }, [projectId, wireframeId]);
  
  const loadSyncHistory = async () => {
    setIsLoading(true);
    try {
      const historyData = await DesignSystemService.getSyncHistory(projectId, wireframeId);
      setSyncHistory(historyData);
    } catch (error) {
      console.error('Error loading sync history:', error);
      toast.error('Failed to load sync history');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSync = async (direction: 'to-wireframe' | 'to-design-system') => {
    setIsSyncing(true);
    try {
      let result: SyncResult;
      
      if (direction === 'to-wireframe') {
        result = await DesignSystemService.syncDesignSystemToWireframe(
          projectId, 
          wireframeId, 
          overrideConflicts
        );
      } else {
        result = await DesignSystemService.syncWireframeToDesignSystem(
          projectId, 
          wireframeId, 
          overrideConflicts
        );
      }
      
      if (result.success) {
        toast.success(`Sync ${direction === 'to-wireframe' ? 'to wireframe' : 'to design system'} completed successfully`);
        loadSyncHistory();
      } else {
        const conflictCount = result.conflicts?.length || 0;
        if (conflictCount > 0 && !overrideConflicts) {
          toast.warning(`Sync completed with ${conflictCount} conflicts. Enable override to force sync.`);
        } else {
          toast.error(`Sync failed: ${result.message}`);
        }
      }
    } catch (error) {
      console.error(`Error syncing ${direction}:`, error);
      toast.error(`Failed to sync ${direction}`);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const getSyncStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'conflict':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design System Synchronization</CardTitle>
        <CardDescription>
          Keep your wireframes and design system in sync by applying changes in either direction
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sync">Sync Controls</TabsTrigger>
            <TabsTrigger value="history">Sync History</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="sync">
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Synchronization Options</h3>
                  <p className="text-sm text-gray-500">
                    Choose sync direction and conflict resolution strategy
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="override-conflicts"
                    checked={overrideConflicts}
                    onCheckedChange={setOverrideConflicts}
                  />
                  <Label htmlFor="override-conflicts">Override conflicts</Label>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Enabling override will force sync and potentially overwrite conflicting values.
                    Make sure you understand the implications before proceeding.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <Download className="h-12 w-12 text-primary mx-auto" />
                        <h3 className="font-medium">Design System → Wireframe</h3>
                        <p className="text-sm text-gray-500">
                          Apply design tokens from system to this wireframe
                        </p>
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => handleSync('to-wireframe')}
                          disabled={isSyncing}
                        >
                          {isSyncing ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : 'Apply to Wireframe'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <Upload className="h-12 w-12 text-primary mx-auto" />
                        <h3 className="font-medium">Wireframe → Design System</h3>
                        <p className="text-sm text-gray-500">
                          Extract design tokens from wireframe to system
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleSync('to-design-system')}
                          disabled={isSyncing}
                        >
                          {isSyncing ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : 'Extract to System'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : syncHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={loadSyncHistory}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </Button>
                  </div>
                  
                  {syncHistory.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className="border rounded-md p-4 flex justify-between items-start"
                    >
                      <div>
                        <div className="flex items-center mb-1 gap-2">
                          {getSyncStatusIcon(item.status)}
                          <span className="font-medium">
                            {item.sync_direction === 'to_wireframe' 
                              ? 'Design System to Wireframe' 
                              : 'Wireframe to Design System'}
                          </span>
                          <Badge variant={
                            item.status?.toLowerCase() === 'success' 
                              ? 'default' 
                              : item.status?.toLowerCase() === 'error' || item.status?.toLowerCase() === 'failed'
                                ? 'destructive'
                                : 'outline'
                          }>
                            {item.status || 'Unknown'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.details || 'No details available'}
                        </p>
                        {item.changes && (
                          <div className="mt-2 text-xs text-gray-500">
                            {typeof item.changes === 'object' ? (
                              <span>
                                Changed: {Object.keys(item.changes).length} items
                              </span>
                            ) : (
                              <span>{item.changes}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {formatDate(item.created_at)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          By: {item.user_id || 'System'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No synchronization history found
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
