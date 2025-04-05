
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Database, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function DatabaseMaintenancePanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    timestamp: Date;
  } | null>(null);
  const { toast } = useToast();

  const runVacuum = async () => {
    setIsLoading(true);
    try {
      // Call the edge function that runs VACUUM
      const { data, error } = await supabase.functions.invoke('database-maintenance', {
        body: { action: 'vacuum', tables: ['profiles'] }
      });

      if (error) {
        throw error;
      }

      setLastResult({
        success: true,
        message: `VACUUM completed successfully on ${data?.tables?.length || 0} tables`,
        timestamp: new Date()
      });

      toast({
        title: "Database maintenance completed",
        description: "VACUUM operation finished successfully",
      });
    } catch (error: any) {
      console.error('Error running VACUUM:', error);
      setLastResult({
        success: false,
        message: error.message || "Failed to run VACUUM operation",
        timestamp: new Date()
      });
      
      toast({
        variant: "destructive",
        title: "Maintenance failed",
        description: error.message || "Failed to run VACUUM operation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeDatabase = async () => {
    setIsLoading(true);
    try {
      // Call the edge function that runs ANALYZE
      const { data, error } = await supabase.functions.invoke('database-maintenance', {
        body: { action: 'analyze', tables: ['profiles'] }
      });

      if (error) {
        throw error;
      }

      setLastResult({
        success: true,
        message: `ANALYZE completed successfully on ${data?.tables?.length || 0} tables`,
        timestamp: new Date()
      });

      toast({
        title: "Database analysis completed",
        description: "ANALYZE operation finished successfully",
      });
    } catch (error: any) {
      console.error('Error running ANALYZE:', error);
      setLastResult({
        success: false,
        message: error.message || "Failed to run ANALYZE operation",
        timestamp: new Date()
      });
      
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error.message || "Failed to run ANALYZE operation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupCache = async () => {
    setIsLoading(true);
    try {
      // Call the edge function to clean up expired cache entries
      const { data, error } = await supabase.functions.invoke('cleanup-expired-cache');

      if (error) {
        throw error;
      }

      setLastResult({
        success: true,
        message: `Removed ${data?.entriesRemoved || 0} expired cache entries`,
        timestamp: new Date()
      });

      toast({
        title: "Cache cleanup completed",
        description: `Removed ${data?.entriesRemoved || 0} expired cache entries`,
      });
    } catch (error: any) {
      console.error('Error cleaning up cache:', error);
      setLastResult({
        success: false,
        message: error.message || "Failed to clean up cache",
        timestamp: new Date()
      });
      
      toast({
        variant: "destructive",
        title: "Cache cleanup failed",
        description: error.message || "Failed to clean up expired cache entries",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Database Maintenance
        </CardTitle>
        <CardDescription>
          Run database maintenance operations to optimize performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button 
            onClick={runVacuum}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Run VACUUM
          </Button>
          
          <Button 
            onClick={analyzeDatabase}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            Run ANALYZE
          </Button>
          
          <Button 
            onClick={cleanupCache}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Clean Cache
          </Button>
        </div>

        {lastResult && (
          <Alert variant={lastResult.success ? "default" : "destructive"}>
            {lastResult.success ? (
              <Database className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{lastResult.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{lastResult.message}</p>
              <p className="text-xs text-muted-foreground">
                {lastResult.timestamp.toLocaleString()}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
