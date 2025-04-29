
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrowserTestingService, BrowserConfiguration, BrowserTestSession } from '@/services/testing/BrowserTestingService';
import BrowserTestResultsList from './BrowserTestResultsList';
import { Chrome, Firefox, Globe, Monitor, Smartphone, Tablet } from 'lucide-react';
import { toast } from 'sonner';

interface BrowserTestingPanelProps {
  wireframeId: string;
}

const BrowserTestingPanel: React.FC<BrowserTestingPanelProps> = ({ wireframeId }) => {
  const [configurations, setConfigurations] = useState<BrowserConfiguration[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>('');
  const [sessions, setSessions] = useState<BrowserTestSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const configs = await BrowserTestingService.getConfigurations();
        setConfigurations(configs);
        if (configs.length > 0) {
          setSelectedConfig(configs[0].id || '');
        }

        const sessionData = await BrowserTestingService.getTestSessions(wireframeId);
        setSessions(sessionData);
        if (sessionData.length > 0) {
          setSelectedSession(sessionData[0].id || null);
        }
      } catch (error) {
        console.error('Error loading browser testing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [wireframeId]);

  const handleRunTest = async () => {
    if (!selectedConfig) {
      toast.error('Please select a browser configuration');
      return;
    }

    setIsRunning(true);
    try {
      await BrowserTestingService.runBrowserTest(wireframeId, selectedConfig);
      toast.success('Browser test completed successfully');
      
      // Refresh sessions
      const sessionData = await BrowserTestingService.getTestSessions(wireframeId);
      setSessions(sessionData);
      if (sessionData.length > 0) {
        setSelectedSession(sessionData[0].id || null);
      }
    } catch (error) {
      console.error('Error running browser test:', error);
      toast.error('Failed to run browser test');
    } finally {
      setIsRunning(false);
    }
  };

  const getBrowserIcon = (browserType: string) => {
    switch (browserType) {
      case 'chrome':
        return <Chrome className="h-4 w-4" />;
      case 'firefox':
        return <Firefox className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Browser Testing</CardTitle>
        <CardDescription>
          Test your wireframe across different browsers and devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Browser Configuration</label>
              <Select
                value={selectedConfig}
                onValueChange={setSelectedConfig}
                disabled={isLoading || isRunning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a browser configuration" />
                </SelectTrigger>
                <SelectContent>
                  {configurations.map((config) => (
                    <SelectItem key={config.id} value={config.id || ''}>
                      <div className="flex items-center gap-2">
                        {getBrowserIcon(config.browserType)}
                        {getDeviceIcon(config.deviceType)}
                        <span>{config.name} ({config.viewportWidth}x{config.viewportHeight})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">&nbsp;</label>
              <Button 
                onClick={handleRunTest} 
                disabled={isLoading || isRunning || !selectedConfig}
              >
                {isRunning ? 'Running Test...' : 'Run Test'}
              </Button>
            </div>
          </div>

          {sessions.length > 0 && (
            <Tabs defaultValue="results" className="mt-6">
              <TabsList>
                <TabsTrigger value="results">Test Results</TabsTrigger>
                <TabsTrigger value="history">Test History</TabsTrigger>
              </TabsList>
              <TabsContent value="results" className="mt-2">
                {selectedSession && (
                  <BrowserTestResultsList sessionId={selectedSession} />
                )}
              </TabsContent>
              <TabsContent value="history" className="mt-2">
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Browser</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => (
                        <tr key={session.id} className="border-t">
                          <td className="p-2">
                            {new Date(session.started_at || '').toLocaleString()}
                          </td>
                          <td className="p-2">
                            {session.browser_test_configurations?.name || 'Unknown'}
                          </td>
                          <td className="p-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : session.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {session.status}
                            </span>
                          </td>
                          <td className="p-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedSession(session.id || null)}
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {sessions.length} tests run for this wireframe
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open('#', '_blank')}>
          View Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BrowserTestingPanel;
