
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeftRight, AlertCircle, Check } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DesignSystemSyncProps {
  wireframeId: string;
}

export const DesignSystemSync: React.FC<DesignSystemSyncProps> = ({ wireframeId }) => {
  const [syncDirection, setSyncDirection] = useState<'to_wireframe' | 'from_wireframe' | 'bidirectional'>('bidirectional');
  
  // Fetch sync logs for this wireframe
  const { data: syncLogs, isLoading } = useQuery({
    queryKey: ['sync-logs', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_system_sync_logs')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  // Mutation for synchronizing
  const { mutate: syncDesignSystem, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('design_system_sync_logs')
        .insert({
          wireframe_id: wireframeId,
          project_id: 'project-1', // You'd get this from context or props
          sync_direction: syncDirection,
          status: 'pending',
          changes: {}
        })
        .select();
      
      if (error) throw error;
      
      // In a real implementation, you would trigger a background process
      // to perform the actual synchronization
      
      // For now we'll simulate completion after 2 seconds
      return new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    },
    onSuccess: () => {
      toast.success("Synchronization initiated");
    },
    onError: (error) => {
      toast.error("Synchronization failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  const getSyncStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Failed</Badge>;
      case 'conflict':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Conflicts</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design System Synchronization</CardTitle>
        <CardDescription>
          Synchronize wireframe elements with your design system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sync">
          <TabsList className="mb-4">
            <TabsTrigger value="sync">Sync</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-gray-500" />
                <div className="text-sm font-medium">Sync Direction</div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={syncDirection === 'to_wireframe' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSyncDirection('to_wireframe')}
                >
                  Design System → Wireframe
                </Button>
                <Button
                  variant={syncDirection === 'from_wireframe' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSyncDirection('from_wireframe')}
                >
                  Wireframe → Design System
                </Button>
                <Button
                  variant={syncDirection === 'bidirectional' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSyncDirection('bidirectional')}
                >
                  Bidirectional
                </Button>
              </div>

              <Button 
                onClick={() => syncDesignSystem()} 
                disabled={isPending}
                className="mt-2"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Synchronizing..." : "Start Synchronization"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history">
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {syncLogs && syncLogs.length > 0 ? (
                  syncLogs.map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Direction: {log.sync_direction}
                        </div>
                      </div>
                      <div>{getSyncStatusBadge(log.status)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    No synchronization history found
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="conflicts">
            <div className="text-center p-6 text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No conflicts detected in the recent synchronizations</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
