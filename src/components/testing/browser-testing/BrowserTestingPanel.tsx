
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BrowserTestingService, BrowserConfiguration, BrowserTestSession } from '@/services/testing/BrowserTestingService';
import BrowserTestResultsList from './BrowserTestResultsList';
import { Chrome, Globe, Monitor, Smartphone, Tablet } from 'lucide-react';
import { toast } from 'sonner';
import { AlertMessage } from '@/components/ui/alert-message';

interface BrowserTestingPanelProps {
  wireframeId: string;
}

const BrowserTestingPanel: React.FC<BrowserTestingPanelProps> = ({ wireframeId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [configurations, setConfigurations] = useState<BrowserConfiguration[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [sessions, setSessions] = useState<BrowserTestSession[]>([]);
  const [activeSession, setActiveSession] = useState<BrowserTestSession | null>(null);
  const [activeTab, setActiveTab] = useState<string>('configs');
  
  // Fetch browser configurations and past test sessions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get browser configurations
        const configs = await BrowserTestingService.getBrowserConfigurations();
        setConfigurations(configs);
        
        if (configs.length > 0) {
          setSelectedConfigId(configs[0].id);
        }
        
        // Get past test sessions for this wireframe
        const testSessions = await BrowserTestingService.getTestSessions(wireframeId);
        setSessions(testSessions);
        
      } catch (error) {
        console.error('Error loading browser testing data:', error);
        toast.error('Failed to load browser testing data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [wireframeId]);
  
  const handleRunTest = async () => {
    if (!selectedConfigId) {
      toast.error('Please select a browser configuration first');
      return;
    }
    
    setIsLoading(true);
    try {
      const newSession = await BrowserTestingService.runBrowserTest(wireframeId, selectedConfigId);
      
      // Add the new session to the list and set it as active
      setSessions(prev => [newSession, ...prev]);
      setActiveSession(newSession);
      setActiveTab('results');
      
      toast.success('Browser test completed successfully');
    } catch (error) {
      console.error('Error running browser test:', error);
      toast.error('Failed to run browser test');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewSession = (session: BrowserTestSession) => {
    setActiveSession(session);
    setActiveTab('results');
  };
  
  const getDeviceIcon = (deviceType: string) => {
    switch(deviceType.toLowerCase()) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };
  
  const getBrowserIcon = (browserType: string) => {
    switch(browserType.toLowerCase()) {
      case 'chrome': return <Chrome className="h-4 w-4" />;
      // Firefox icon is not available, use Globe instead
      case 'firefox': return <Globe className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Cross-Browser Testing</CardTitle>
        <CardDescription>
          Test your wireframe across different browsers and devices to ensure consistent rendering.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="configs">Test Configuration</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configs">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Select Browser Configuration</h3>
                <Select 
                  value={selectedConfigId} 
                  onValueChange={setSelectedConfigId}
                  disabled={isLoading || configurations.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a browser configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    {configurations.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        <div className="flex items-center">
                          {getBrowserIcon(config.browserType)}
                          <span className="ml-2">{config.name}</span>
                          {getDeviceIcon(config.deviceType)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedConfigId && (
                <div className="pt-4">
                  <Button 
                    onClick={handleRunTest}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Running Test...' : 'Run Browser Test'}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Previous Test Sessions</h3>
              {sessions.length === 0 ? (
                <p className="text-muted-foreground">No previous test sessions found.</p>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="p-4 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => handleViewSession(session)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getBrowserIcon(session.configuration?.browserType || 'unknown')}
                          <span className="font-medium">
                            {session.configuration?.name || 'Unknown configuration'}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.startedAt && new Date(session.startedAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className={`text-sm px-2 py-0.5 rounded-full ${
                          session.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          session.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </div>
                        
                        {session.resultsSummary && (
                          <div className="text-sm">
                            {session.resultsSummary.passed || 0} passed, {session.resultsSummary.failed || 0} issues
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
            {activeSession ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Test Results: {activeSession.configuration?.name || 'Unknown configuration'}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {activeSession.startedAt && new Date(activeSession.startedAt).toLocaleString()}
                  </div>
                </div>
                
                {activeSession.screenshotUrl && (
                  <>
                    <h4 className="font-medium mt-4">Screenshot</h4>
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={activeSession.screenshotUrl} 
                        alt="Browser test screenshot" 
                        className="w-full object-contain max-h-96"
                      />
                    </div>
                  </>
                )}
                
                <Separator className="my-4" />
                
                <h4 className="font-medium">Test Details</h4>
                <BrowserTestResultsList sessionId={activeSession.id} />
              </div>
            ) : (
              <AlertMessage
                type="info"
                title="No test results selected"
              >
                Run a new test or select a previous test session to view results.
              </AlertMessage>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BrowserTestingPanel;
