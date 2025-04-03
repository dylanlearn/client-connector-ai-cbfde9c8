
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientError } from "@/utils/monitoring/types";
import { fetchClientErrors, resolveClientError, getErrorStatistics } from "@/utils/monitoring/client-error-dashboard";
import { AlertMessage } from "@/components/ui/alert-message";
import { Loader2, CheckCircle, AlertCircle, ListFilter } from "lucide-react";

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
  const [resolutionNotes, setResolutionNotes] = useState("");
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

  const handleResolveError = async () => {
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
      setResolutionNotes("");
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
          
          <TabsContent value="all" className="mt-0">
            {renderErrorList()}
          </TabsContent>
          
          <TabsContent value="unresolved" className="mt-0">
            {renderErrorList()}
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-0">
            {renderErrorList()}
          </TabsContent>
        </Tabs>
        
        {/* Resolution dialog */}
        <Dialog open={!!selectedError} onOpenChange={(open) => !open && setSelectedError(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve Error</DialogTitle>
              <DialogDescription>
                Add resolution notes and mark this error as resolved.
              </DialogDescription>
            </DialogHeader>
            
            {selectedError && (
              <div className="space-y-4 my-4">
                <div>
                  <h4 className="font-medium">Error Message:</h4>
                  <p className="text-sm text-destructive">{selectedError.error_message}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Component:</h4>
                  <p className="text-sm">{selectedError.component_name || 'Unknown'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Resolution Notes:</h4>
                  <Textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter your resolution notes here..."
                    className="w-full mt-1"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedError(null)}>
                Cancel
              </Button>
              <Button onClick={handleResolveError}>
                Mark as Resolved
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  function renderErrorList() {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (errors.length === 0) {
      return (
        <AlertMessage type="info" title="No errors found">
          No client errors have been recorded matching the current filter.
        </AlertMessage>
      );
    }
    
    return (
      <div className="space-y-4">
        {errors.map((error) => (
          <div 
            key={error.id} 
            className="p-4 border rounded-md hover:bg-accent transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {error.resolved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                  <span className="font-medium text-sm">
                    {error.error_message}
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {new Date(error.timestamp!).toLocaleString()}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {error.component_name && (
                    <Badge variant="outline">{error.component_name}</Badge>
                  )}
                  <Badge variant="outline">{error.url?.split('?')[0]}</Badge>
                  {error.resolved && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Resolved
                    </Badge>
                  )}
                </div>
                
                {error.resolution_notes && (
                  <div className="mt-2 text-sm italic border-l-2 pl-2 border-primary-200">
                    {error.resolution_notes}
                  </div>
                )}
              </div>
              
              {!error.resolved && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedError(error);
                    setResolutionNotes("");
                  }}
                >
                  Resolve
                </Button>
              )}
            </div>
            
            {error.error_stack && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-muted-foreground">
                  Error Stack
                </summary>
                <pre className="mt-2 text-xs p-2 bg-slate-50 rounded-md overflow-auto max-h-32">
                  {error.error_stack}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    );
  }
}
