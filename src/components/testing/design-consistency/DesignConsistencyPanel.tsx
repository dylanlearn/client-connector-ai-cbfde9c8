
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DesignConsistencyService, DesignConsistencyCheck } from '@/services/testing/DesignConsistencyService';
import { toast } from 'sonner';
import DesignConsistencyIssuesList from './DesignConsistencyIssuesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DesignConsistencyRulesList from './DesignConsistencyRulesList';

interface DesignConsistencyPanelProps {
  projectId: string;
  wireframeIds?: string[];
}

const DesignConsistencyPanel: React.FC<DesignConsistencyPanelProps> = ({ projectId, wireframeIds }) => {
  const [checks, setChecks] = useState<DesignConsistencyCheck[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('issues');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const checksData = await DesignConsistencyService.getChecks(projectId);
        setChecks(checksData);
        if (checksData.length > 0) {
          setSelectedCheck(checksData[0].id || null);
        }
      } catch (error) {
        console.error('Error loading design consistency checks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleRunCheck = async () => {
    setIsRunning(true);
    try {
      const result = await DesignConsistencyService.runConsistencyCheck(projectId, wireframeIds);
      toast.success('Design consistency check completed');

      // Refresh checks
      const checksData = await DesignConsistencyService.getChecks(projectId);
      setChecks(checksData);
      setSelectedCheck(result.id || null);
    } catch (error) {
      console.error('Error running design consistency check:', error);
      toast.error('Failed to run design consistency check');
    } finally {
      setIsRunning(false);
    }
  };

  const selectedCheckData = checks.find(check => check.id === selectedCheck);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Consistency Verification</CardTitle>
        <CardDescription>
          Verify design consistency across wireframes, screens, and components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={handleRunCheck} 
              disabled={isLoading || isRunning}
            >
              {isRunning ? 'Running Check...' : 'Run Consistency Check'}
            </Button>
          </div>

          {selectedCheck && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="rules">Consistency Rules</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="issues" className="mt-2">
                <DesignConsistencyIssuesList checkId={selectedCheck} />
              </TabsContent>
              <TabsContent value="rules" className="mt-2">
                <DesignConsistencyRulesList projectId={projectId} />
              </TabsContent>
              <TabsContent value="history" className="mt-2">
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Wireframes</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checks.map((check) => (
                        <tr 
                          key={check.id} 
                          className={`border-t ${check.id === selectedCheck ? 'bg-muted/50' : ''}`}
                        >
                          <td className="p-2">
                            {new Date(check.started_at || '').toLocaleString()}
                          </td>
                          <td className="p-2">{check.checkType}</td>
                          <td className="p-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              check.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : check.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {check.status}
                            </span>
                          </td>
                          <td className="p-2">
                            {check.wireframeIds?.length || '0'}
                          </td>
                          <td className="p-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedCheck(check.id || null)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {!selectedCheck && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No consistency checks have been run yet.</p>
              <Button onClick={handleRunCheck}>
                Run First Consistency Check
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {checks.length} design consistency checks run for this project
        </div>
        {selectedCheckData && (
          <div className="text-sm">
            Last run: {new Date(selectedCheckData.started_at || '').toLocaleString()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DesignConsistencyPanel;
