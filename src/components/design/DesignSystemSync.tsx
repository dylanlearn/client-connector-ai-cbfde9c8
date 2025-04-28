
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { DesignSystemService, SyncResult } from '@/services/design-system/design-system-service';

interface DesignSystemSyncProps {
  projectId: string;
  wireframeId: string;
}

export function DesignSystemSync({ projectId, wireframeId }: DesignSystemSyncProps) {
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  useEffect(() => {
    if (projectId && wireframeId) {
      loadSyncHistory();
    }
  }, [projectId, wireframeId]);
  
  const loadSyncHistory = async () => {
    setIsLoading(true);
    try {
      const history = await DesignSystemService.getSyncHistory(projectId, wireframeId);
      setSyncHistory(history);
    } catch (error) {
      console.error('Error loading sync history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSyncToWireframe = async () => {
    setIsLoading(true);
    setShowResult(false);
    try {
      const result = await DesignSystemService.syncDesignSystemToWireframe(
        projectId,
        wireframeId
      );
      setSyncResult(result);
      setShowResult(true);
      loadSyncHistory();
    } catch (error) {
      console.error('Error syncing design system to wireframe:', error);
      setSyncResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSyncToDesignSystem = async () => {
    setIsLoading(true);
    setShowResult(false);
    try {
      const result = await DesignSystemService.syncWireframeToDesignSystem(
        projectId,
        wireframeId
      );
      setSyncResult(result);
      setShowResult(true);
      loadSyncHistory();
    } catch (error) {
      console.error('Error syncing wireframe to design system:', error);
      setSyncResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOverrideConflicts = async (direction: 'to_wireframe' | 'from_wireframe') => {
    setIsLoading(true);
    try {
      let result;
      if (direction === 'to_wireframe') {
        result = await DesignSystemService.syncDesignSystemToWireframe(
          projectId,
          wireframeId,
          true // override conflicts
        );
      } else {
        result = await DesignSystemService.syncWireframeToDesignSystem(
          projectId,
          wireframeId,
          true // override conflicts
        );
      }
      setSyncResult(result);
      loadSyncHistory();
    } catch (error) {
      console.error('Error overriding conflicts:', error);
      setSyncResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderSyncHistoryItem = (item: any) => {
    const statusColor = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      conflict: 'bg-red-100 text-red-800',
      error: 'bg-red-100 text-red-800'
    };
    
    const directionIcon = item.sync_direction === 'to_wireframe' 
      ? <ArrowDownToLine className="h-4 w-4 mr-1" /> 
      : <ArrowUpFromLine className="h-4 w-4 mr-1" />;
    
    const directionText = item.sync_direction === 'to_wireframe' 
      ? 'Design System → Wireframe' 
      : 'Wireframe → Design System';
    
    return (
      <div key={item.id} className="p-4 border rounded-md mb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {directionIcon}
            <span>{directionText}</span>
          </div>
          <Badge 
            className={statusColor[item.status as keyof typeof statusColor] || 'bg-gray-100'}
          >
            {item.status}
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(item.created_at).toLocaleString()}
        </div>
        {item.conflicts && item.conflicts.length > 0 && (
          <div className="mt-2">
            <span className="text-sm font-medium">Conflicts: {item.conflicts.length}</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Design System Synchronization
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadSyncHistory} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Keep your design system and wireframes in sync with bidirectional synchronization
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sync">Sync Controls</TabsTrigger>
            <TabsTrigger value="history">Sync History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sync" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleSyncToWireframe} 
                disabled={isLoading}
                className="flex items-center"
              >
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Apply Design System to Wireframe
              </Button>
              
              <Button 
                onClick={handleSyncToDesignSystem} 
                disabled={isLoading}
                className="flex items-center"
              >
                <ArrowUpFromLine className="h-4 w-4 mr-2" />
                Update Design System from Wireframe
              </Button>
            </div>
            
            {showResult && syncResult && (
              <Alert variant={syncResult.success ? "default" : "destructive"}>
                <AlertTitle>{syncResult.success ? "Sync Complete" : "Sync Failed"}</AlertTitle>
                <AlertDescription>
                  {syncResult.message}
                  
                  {syncResult.conflicts && syncResult.conflicts.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">Conflicts detected:</p>
                      <ul className="list-disc pl-5">
                        {syncResult.conflicts.map((conflict: any, index: number) => (
                          <li key={index}>
                            {conflict.type === 'token' ? 'Token: ' : 'Component: '}
                            {conflict.name}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 flex space-x-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleOverrideConflicts('to_wireframe')}
                          disabled={isLoading}
                        >
                          Use Design System Version
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleOverrideConflicts('from_wireframe')}
                          disabled={isLoading}
                        >
                          Use Wireframe Version
                        </Button>
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : syncHistory.length > 0 ? (
              <div className="space-y-2">
                {syncHistory.map(renderSyncHistoryItem)}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No sync history available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
