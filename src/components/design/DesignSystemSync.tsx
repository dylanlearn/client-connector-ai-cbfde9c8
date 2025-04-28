
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, AlertTriangle, Check, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DesignSystemService, SyncResult } from '@/services/design-system/design-system-service';

interface DesignSystemSyncProps {
  wireframeId: string;
  projectId: string;
}

export function DesignSystemSync({ wireframeId, projectId }: DesignSystemSyncProps) {
  const [syncDirection, setSyncDirection] = useState<'to_wireframe' | 'from_wireframe'>('to_wireframe');
  const [conflicts, setConflicts] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  
  const handleSync = async (overrideConflicts = false) => {
    setIsLoading(true);
    try {
      let result: SyncResult;
      
      if (syncDirection === 'to_wireframe') {
        result = await DesignSystemService.syncDesignSystemToWireframe(
          wireframeId, 
          projectId, 
          overrideConflicts
        );
      } else {
        result = await DesignSystemService.syncWireframeToDesignSystem(
          wireframeId,
          projectId,
          overrideConflicts
        );
      }
      
      setLastSyncResult(result);
      
      if (!result.success && result.conflicts && result.conflicts.length > 0) {
        setConflicts(result.conflicts);
        toast.warning("Sync conflicts detected", {
          description: "Please review and resolve conflicts"
        });
      } else if (result.success) {
        setConflicts(null);
        toast.success("Sync completed successfully", {
          description: syncDirection === 'to_wireframe' 
            ? "Design system applied to wireframe" 
            : "Wireframe changes applied to design system"
        });
      }
    } catch (error) {
      toast.error("Sync failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resolveConflicts = async () => {
    await handleSync(true);
    setConflicts(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Design System Synchronization</span>
          {lastSyncResult?.success && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Synced
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Synchronize design tokens and components between wireframes and design system
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="direction" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direction">Sync Direction</TabsTrigger>
            <TabsTrigger value="status">Sync Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direction" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={syncDirection === 'to_wireframe' ? 'default' : 'outline'}
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => setSyncDirection('to_wireframe')}
              >
                <ArrowLeftRight className="rotate-180" />
                <span>Design System → Wireframe</span>
              </Button>
              
              <Button 
                variant={syncDirection === 'from_wireframe' ? 'default' : 'outline'}
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => setSyncDirection('from_wireframe')}
              >
                <ArrowLeftRight />
                <span>Wireframe → Design System</span>
              </Button>
            </div>
            
            {conflicts && conflicts.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Conflicts Detected</AlertTitle>
                <AlertDescription>
                  {conflicts.length} conflicts were found. You can override them or cancel.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="status">
            <div className="space-y-4 py-4">
              {lastSyncResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Status</h4>
                      <p className="text-sm text-muted-foreground">
                        {lastSyncResult.success ? (
                          <span className="text-green-600 flex items-center">
                            <Check className="w-4 h-4 mr-1" /> Success
                          </span>
                        ) : (
                          <span className="text-amber-600 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" /> Conflicts
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Direction</h4>
                      <p className="text-sm text-muted-foreground">
                        {syncDirection === 'to_wireframe' ? 'Design System → Wireframe' : 'Wireframe → Design System'}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Message</h4>
                    <p className="text-sm">{lastSyncResult.message}</p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No sync operations performed yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {conflicts && conflicts.length > 0 ? (
          <>
            <Button variant="outline" onClick={() => setConflicts(null)}>
              Cancel
            </Button>
            <Button onClick={resolveConflicts} variant="destructive" disabled={isLoading}>
              Override Conflicts
            </Button>
          </>
        ) : (
          <>
            <div></div>
            <Button onClick={() => handleSync(false)} disabled={isLoading}>
              {isLoading ? 'Syncing...' : 'Sync Now'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
