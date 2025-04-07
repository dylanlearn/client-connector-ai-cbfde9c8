
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientError } from "@/utils/monitoring/types";
import { fetchClientErrors, resolveClientError, getErrorStatistics } from "@/utils/monitoring/client-error-dashboard";
import { ListFilter } from "lucide-react";
import { ErrorList } from "./error-management/ErrorList";
import { ResolutionDialog } from "./error-management/ResolutionDialog";
import LoadingStateWrapper from "@/components/ui/LoadingStateWrapper";

export function ClientErrorMonitoring() {
  const [errors, setErrors] = useState<ClientError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatistics, setErrorStatistics] = useState({
    total: 0,
    resolved: 0,
    unresolved: 0,
    byComponent: {} as Record<string, number>
  });
  const [selectedError, setSelectedError] = useState<ClientError | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch errors on component mount
  useEffect(() => {
    fetchErrors();
  }, [activeTab]);

  // Fetch error statistics
  useEffect(() => {
    fetchStatistics();
  }, [errors]);

  const fetchErrors = async () => {
    setIsLoading(true);
    let resolved: boolean | undefined = undefined;
    
    if (activeTab === "resolved") {
      resolved = true;
    } else if (activeTab === "unresolved") {
      resolved = false;
    }
    
    const data = await fetchClientErrors(100, resolved);
    setErrors(data);
    setIsLoading(false);
  };

  const fetchStatistics = async () => {
    const stats = await getErrorStatistics();
    setErrorStatistics(stats);
  };

  const handleResolveError = async (resolutionNotes: string) => {
    if (!selectedError) return;
    
    const success = await resolveClientError(selectedError.id!, resolutionNotes);
    if (success) {
      // Update local state to reflect the change
      setErrors(prevErrors => 
        prevErrors.map(error => 
          error.id === selectedError.id 
            ? { ...error, resolved: true, resolution_notes: resolutionNotes } 
            : error
        )
      );
      setSelectedError(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>Client Error Monitoring</div>
          <Button 
            onClick={fetchErrors} 
            variant="outline" 
            size="sm"
            className="ml-2"
          >
            <ListFilter className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">
                All ({errorStatistics.total})
              </TabsTrigger>
              <TabsTrigger value="unresolved">
                Unresolved ({errorStatistics.unresolved})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved ({errorStatistics.resolved})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <LoadingStateWrapper
            isLoading={isLoading}
            error={null}
            isEmpty={errors.length === 0}
            loadingMessage="Loading client errors..."
            emptyState={
              <div className="p-8 text-center text-muted-foreground">
                No errors found matching the current filter.
              </div>
            }
          >
            <ErrorList
              errors={errors}
              isLoading={isLoading}
              onResolveClick={(error) => setSelectedError(error)}
            />
          </LoadingStateWrapper>
        </Tabs>
        
        {/* Resolution dialog */}
        <ResolutionDialog
          error={selectedError}
          onClose={() => setSelectedError(null)}
          onResolve={handleResolveError}
        />
      </CardContent>
    </Card>
  );
}
