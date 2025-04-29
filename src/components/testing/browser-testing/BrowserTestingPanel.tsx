
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrowserTestingService, BrowserConfiguration, BrowserTestSession } from '@/services/testing/BrowserTestingService';
import BrowserTestResultsList from './BrowserTestResultsList';
import { Chrome, Globe, Monitor, Smartphone, Tablet } from 'lucide-react';
import { toast } from 'sonner';

interface BrowserTestingPanelProps {
  wireframeId: string;
}

const BrowserTestingPanel: React.FC<BrowserTestingPanelProps> = ({ wireframeId }) => {
  const [configurations, setConfigurations] = useState<BrowserConfiguration[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [sessions, setSessions] = useState<BrowserTestSession[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadConfigurations();
    loadSessions();
  }, [wireframeId]);

  const loadConfigurations = async () => {
    setIsLoadingConfigs(true);
    try {
      const configs = await BrowserTestingService.getConfigurations();
      setConfigurations(configs);
      if (configs.length > 0) {
        setSelectedConfigId(configs[0].id);
      }
    } catch (error) {
      console.error('Error loading browser configurations:', error);
      toast.error('Failed to load browser configurations');
    } finally {
      setIsLoadingConfigs(false);
    }
  };

  const loadSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const sessionData = await BrowserTestingService.getSessions(wireframeId);
      setSessions(sessionData);
    } catch (error) {
      console.error('Error loading test sessions:', error);
      toast.error('Failed to load test sessions');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const runBrowserTest = async () => {
    if (!selectedConfigId) {
      toast.error('Please select a browser configuration');
      return;
    }

    setIsRunningTest(true);
    try {
      await BrowserTestingService.createTestSession(wireframeId, selectedConfigId);
      toast.success('Browser test started successfully');
      // In a real app, this might start a background job
      // For demo, we'll simulate a completed test after a delay
      setTimeout(() => {
        loadSessions();
      }, 2000);
    } catch (error) {
      console.error('Error starting browser test:', error);
      toast.error('Failed to start browser test');
    } finally {
      setIsRunningTest(false);
    }
  };

  const getBrowserIcon = (browserType: string) => {
    switch (browserType.toLowerCase()) {
      case 'chrome':
        return <Chrome className="h-5 w-5" />;
      case 'edge':
        return <Globe className="h-5 w-5" />;
      case 'safari':
        return <Globe className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Run Browser Compatibility Test</CardTitle>
          <CardDescription>
            Test your wireframe across different browsers and device types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Browser Configuration</label>
              <Select 
                value={selectedConfigId} 
                onValueChange={setSelectedConfigId}
                disabled={isLoadingConfigs || isRunningTest}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a browser configuration" />
                </SelectTrigger>
                <SelectContent>
                  {configurations.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      <div className="flex items-center gap-2">
                        {getBrowserIcon(config.browserType)}
                        <span>{config.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={runBrowserTest}
              disabled={isLoadingConfigs || isRunningTest || !selectedConfigId}
              className="mt-2 md:mt-0"
            >
              {isRunningTest ? 'Running Test...' : 'Run Test'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Test History</CardTitle>
          <CardDescription>
            Previous browser compatibility test results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSessions ? (
            <div className="py-4">Loading test sessions...</div>
          ) : sessions.length === 0 ? (
            <Alert>
              <AlertTitle>No tests found</AlertTitle>
              <AlertDescription>
                Run your first browser compatibility test to see results
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="border rounded-lg overflow-hidden"
                >
                  <div 
                    className="p-4 border-b cursor-pointer flex items-center justify-between"
                    onClick={() => setSelectedSessionId(selectedSessionId === session.id ? null : session.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {session.configuration && getBrowserIcon(session.configuration.browserType)}
                      <div>
                        <h4 className="font-medium">
                          {session.configuration?.name || 'Unknown Browser'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.startedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.resultsSummary && (
                        <div className="flex gap-3 text-sm">
                          <span className="text-green-600">
                            {session.resultsSummary.passed} passed
                          </span>
                          <span className="text-red-600">
                            {session.resultsSummary.failed} failed
                          </span>
                          <span className="text-amber-600">
                            {session.resultsSummary.warnings} warnings
                          </span>
                        </div>
                      )}
                      <span className="text-xs">
                        {session.status}
                      </span>
                    </div>
                  </div>
                  {selectedSessionId === session.id && (
                    <div className="p-4 bg-slate-50">
                      <div className="flex gap-4 items-center mb-4">
                        {session.configuration && getDeviceIcon(session.configuration.deviceType)}
                        <div>
                          <p className="text-sm">
                            Viewport: {session.configuration?.viewportWidth} x {session.configuration?.viewportHeight}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Device: {session.configuration?.deviceType}
                          </p>
                        </div>
                      </div>
                      {session.screenshotUrl && (
                        <div className="mb-4">
                          <img 
                            src={session.screenshotUrl} 
                            alt="Test screenshot" 
                            className="border rounded w-full max-h-[300px] object-contain"
                          />
                        </div>
                      )}
                      <BrowserTestResultsList sessionId={session.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowserTestingPanel;
