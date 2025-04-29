
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertMessage } from '@/components/ui/alert-message';
import { toast } from 'sonner';
import { DesignConsistencyService, DesignConsistencyCheck, DesignConsistencyIssue } from '@/services/testing/DesignConsistencyService';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface DesignConsistencyPanelProps {
  projectId: string;
  wireframeIds: string[];
}

const DesignConsistencyPanel: React.FC<DesignConsistencyPanelProps> = ({ projectId, wireframeIds }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [checks, setChecks] = useState<DesignConsistencyCheck[]>([]);
  const [activeCheck, setActiveCheck] = useState<DesignConsistencyCheck | null>(null);
  const [issues, setIssues] = useState<DesignConsistencyIssue[]>([]);
  const [activeTab, setActiveTab] = useState<string>('run');
  
  // Fetch past consistency checks
  useEffect(() => {
    if (!projectId) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const checksData = await DesignConsistencyService.getConsistencyChecks(projectId);
        setChecks(checksData);
      } catch (error) {
        console.error('Error loading design consistency checks:', error);
        toast.error('Failed to load design consistency data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [projectId]);
  
  const handleRunCheck = async () => {
    if (!projectId || wireframeIds.length === 0) {
      toast.error('Project ID or wireframe IDs are missing');
      return;
    }
    
    setIsLoading(true);
    try {
      const newCheck = await DesignConsistencyService.runConsistencyCheck(projectId, wireframeIds);
      
      // Add the new check to the list and set it as active
      setChecks(prev => [newCheck, ...prev]);
      setActiveCheck(newCheck);
      
      // Load issues for this check
      const issuesData = await DesignConsistencyService.getConsistencyIssues(newCheck.id);
      setIssues(issuesData);
      
      setActiveTab('results');
      
      toast.success('Design consistency check completed successfully');
    } catch (error) {
      console.error('Error running design consistency check:', error);
      toast.error('Failed to run design consistency check');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewCheck = async (check: DesignConsistencyCheck) => {
    setIsLoading(true);
    try {
      const issuesData = await DesignConsistencyService.getConsistencyIssues(check.id);
      setIssues(issuesData);
      setActiveCheck(check);
      setActiveTab('results');
    } catch (error) {
      console.error('Error loading consistency issues:', error);
      toast.error('Failed to load consistency issues');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Design Consistency Verification</CardTitle>
        <CardDescription>
          Verify design consistency across wireframes, screens, and components with exception reporting.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="run">Run Check</TabsTrigger>
            <TabsTrigger value="history">Check History</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="run">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Design Consistency Check</h3>
                <p className="text-sm text-muted-foreground">
                  This will analyze the selected wireframes for design consistency issues such as:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                  <li>Color usage consistency</li>
                  <li>Typography consistency</li>
                  <li>Spacing and alignment patterns</li>
                  <li>Component style variations</li>
                  <li>Layout grid adherence</li>
                </ul>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleRunCheck}
                  disabled={isLoading || !projectId || wireframeIds.length === 0}
                >
                  {isLoading ? 'Running Check...' : 'Run Consistency Check'}
                </Button>
                
                {(!projectId || wireframeIds.length === 0) && (
                  <p className="mt-2 text-sm text-red-600">
                    Project ID and at least one wireframe ID are required to run the check.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Previous Consistency Checks</h3>
              {checks.length === 0 ? (
                <p className="text-muted-foreground">No previous consistency checks found.</p>
              ) : (
                <div className="space-y-2">
                  {checks.map((check) => (
                    <div 
                      key={check.id} 
                      className="p-4 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => handleViewCheck(check)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {check.checkType === 'full' ? 'Full Consistency Check' : 'Partial Consistency Check'}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {check.startedAt && new Date(check.startedAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className={`text-sm px-2 py-0.5 rounded-full ${
                          check.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          check.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {check.status}
                        </div>
                        
                        {check.resultsSummary && (
                          <div className="text-sm">
                            {check.resultsSummary.issueCount} issues found
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {activeCheck ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {activeCheck.checkType === 'full' ? 'Full Consistency Check' : 'Partial Consistency Check'}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {activeCheck.startedAt && new Date(activeCheck.startedAt).toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-background p-3 rounded-md border">
                      <div className="text-sm text-muted-foreground">Wireframes Analyzed</div>
                      <div className="text-2xl font-bold">{activeCheck.wireframeIds?.length || 0}</div>
                    </div>
                    <div className="bg-background p-3 rounded-md border">
                      <div className="text-sm text-muted-foreground">Issues Found</div>
                      <div className="text-2xl font-bold">{issues.length}</div>
                    </div>
                    <div className="bg-background p-3 rounded-md border">
                      <div className="text-sm text-muted-foreground">Critical Issues</div>
                      <div className="text-2xl font-bold text-red-600">
                        {issues.filter(i => i.severity === 'critical').length}
                      </div>
                    </div>
                    <div className="bg-background p-3 rounded-md border">
                      <div className="text-sm text-muted-foreground">Components Checked</div>
                      <div className="text-2xl font-bold">
                        {activeCheck.resultsSummary?.componentsChecked || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h4 className="font-medium">Consistency Issues</h4>
                {issues.length === 0 ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle>No consistency issues found</AlertTitle>
                    <AlertDescription>
                      Great job! Your design is consistent across all wireframes.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <div 
                        key={issue.id} 
                        className={`border p-4 rounded-md ${
                          issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                          issue.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                          issue.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                          'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getStatusIcon(issue.severity)}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h5 className="font-medium">{issue.issueType}</h5>
                              <Badge variant="outline">{issue.severity}</Badge>
                            </div>
                            <p className="mt-1">{issue.description}</p>
                            
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              {issue.expectedValue && (
                                <div className="bg-background p-2 rounded border">
                                  <div className="font-medium">Expected:</div>
                                  <div className="mt-1 break-all">{issue.expectedValue}</div>
                                </div>
                              )}
                              {issue.actualValue && (
                                <div className="bg-background p-2 rounded border">
                                  <div className="font-medium">Found:</div>
                                  <div className="mt-1 break-all">{issue.actualValue}</div>
                                </div>
                              )}
                            </div>
                            
                            {issue.recommendation && (
                              <div className="mt-3 bg-white bg-opacity-50 p-2 rounded">
                                <div className="font-medium">Recommendation:</div>
                                <div className="mt-1">{issue.recommendation}</div>
                              </div>
                            )}
                            
                            <div className="mt-3 text-xs text-muted-foreground">
                              {issue.wireframeId && (
                                <span>Wireframe: {issue.wireframeId}</span>
                              )}
                              {issue.elementId && (
                                <span className="ml-2">Element: {issue.elementId}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <AlertMessage
                type="info"
                title="No check results selected"
              >
                Run a new consistency check or select a previous check to view results.
              </AlertMessage>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DesignConsistencyPanel;
