
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useComponentProfiler } from '@/hooks/use-component-profiler';
import useNestedState from '@/hooks/use-nested-state';
import { toast } from 'sonner';

// Demo component that will be profiled
const DemoComponent: React.FC<{ level: number; iterations?: number }> = ({ level, iterations = 1000 }) => {
  const [count, setCount] = useState(0);

  // Expensive operation to simulate performance issues
  useEffect(() => {
    // Create artificial load
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i);
    }
    const end = performance.now();
    console.log(`DemoComponent (level ${level}) rendered with ${iterations} iterations in ${(end - start).toFixed(2)}ms`);
  }, [level, iterations]);

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-semibold mb-2">Demo Component (Level {level})</h3>
      <p className="mb-2">Iterations: {iterations.toLocaleString()}</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setCount(count + 1)}>
          Increment: {count}
        </Button>
      </div>
    </div>
  );
};

// Create nested state for demo
const { NestedProvider, useNestedStateContext } = useNestedState({
  theme: {
    darkMode: false,
    animations: true,
    notifications: true,
  },
  user: {
    name: "User",
    preferences: {
      language: "English",
      timezone: "UTC",
    }
  }
});

// Child component that uses nested state
const ThemeControls: React.FC = () => {
  const { state, overrideState, isOverridden } = useNestedStateContext();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Theme Controls</h3>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span>Dark Mode:</span>
          <Button 
            size="sm" 
            variant={state.theme.darkMode ? "default" : "outline"}
            onClick={() => overrideState('theme.darkMode', !state.theme.darkMode)}
          >
            {state.theme.darkMode ? 'On' : 'Off'}
          </Button>
          {isOverridden('theme.darkMode') && <Badge>Overridden</Badge>}
        </div>
        
        <div className="flex items-center gap-2">
          <span>Animations:</span>
          <Button 
            size="sm" 
            variant={state.theme.animations ? "default" : "outline"}
            onClick={() => overrideState('theme.animations', !state.theme.animations)}
          >
            {state.theme.animations ? 'On' : 'Off'}
          </Button>
          {isOverridden('theme.animations') && <Badge>Overridden</Badge>}
        </div>
        
        <div className="flex items-center gap-2">
          <span>Notifications:</span>
          <Button 
            size="sm" 
            variant={state.theme.notifications ? "default" : "outline"}
            onClick={() => overrideState('theme.notifications', !state.theme.notifications)}
          >
            {state.theme.notifications ? 'On' : 'Off'}
          </Button>
          {isOverridden('theme.notifications') && <Badge>Overridden</Badge>}
        </div>
      </div>
    </div>
  );
};

// Child component that inherits theme state
const UserPreferences: React.FC = () => {
  const { state, overrideState, inheritState, resetState } = useNestedStateContext();
  
  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">User Preferences</h3>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={() => inheritState('theme')}>
            Inherit Theme
          </Button>
          <Button size="sm" variant="outline" onClick={() => resetState('theme')}>
            Reset Theme
          </Button>
        </div>
      </div>
      
      <p>Using theme configuration:</p>
      <pre className="bg-muted p-2 rounded text-sm">
        {JSON.stringify(state.theme, null, 2)}
      </pre>
      
      <div className="flex items-center gap-2">
        <span>Language:</span>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => {
            const newLang = state.user.preferences.language === "English" ? "Spanish" : "English";
            overrideState('user.preferences.language', newLang);
          }}
        >
          {state.user.preferences.language}
        </Button>
      </div>
    </div>
  );
};

// Component that uses nested state providers to demonstrate state inheritance
const NestedStateDemo: React.FC = () => {
  return (
    <NestedProvider>
      <Card>
        <CardHeader>
          <CardTitle>Parent Component</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeControls />
          <Separator className="my-4" />
          
          <NestedProvider initialState={{ theme: { darkMode: true, animations: true, notifications: false } }}>
            <Card>
              <CardHeader>
                <CardTitle>Child Component (With Initial Override)</CardTitle>
              </CardHeader>
              <CardContent>
                <ThemeControls />
                <UserPreferences />
              </CardContent>
            </Card>
          </NestedProvider>
          
          <div className="mt-4">
            <NestedProvider>
              <Card>
                <CardHeader>
                  <CardTitle>Child Component (Inherits All)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeControls />
                  <UserPreferences />
                </CardContent>
              </Card>
            </NestedProvider>
          </div>
        </CardContent>
      </Card>
    </NestedProvider>
  );
};

export const ComponentProfilerDemo: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [iterations, setIterations] = useState(10000);
  const { metrics, captureRenderStart, captureRenderEnd, resetMetrics, analyzePerformance } = useComponentProfiler('DemoComponent', {
    trackMemory: true,
    trackDOMNodes: true,
    logToConsole: true,
    sampleInterval: 0,
    trackProps: true
  });

  // Function to handle profiling click
  const handleProfile = () => {
    resetMetrics();
    captureRenderStart();
    setTimeout(() => {
      captureRenderEnd();
      toast.success('Performance metrics updated!');
    }, 100);
  };

  // Demo component with the full configuration object
  const ConfiguredComponent = () => {
    // Fix: provide all required properties
    const config = {
      darkMode: false,
      animations: false,
      notifications: false
    };
    
    return (
      <div className="p-4 border rounded">
        <h3>Configured Component</h3>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Component Profiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Controls</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" onClick={handleProfile}>
                    Run Profiling
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIterations(iterations * 2)}>
                    2x Iterations
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIterations(Math.max(1000, iterations / 2))}>
                    ÷2 Iterations
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => resetMetrics()}>
                    Reset
                  </Button>
                </div>
              </div>
              
              <DemoComponent level={level} iterations={iterations} />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <p><strong>Render Count:</strong> {metrics.renderCount}</p>
                  <p><strong>Last Render Time:</strong> {metrics.lastRenderTime.toFixed(2)}ms</p>
                  <p><strong>Average Render Time:</strong> {metrics.averageRenderTime.toFixed(2)}ms</p>
                  <p><strong>Max Render Time:</strong> {metrics.maxRenderTime.toFixed(2)}ms</p>
                  {metrics.memoryUsage !== undefined && (
                    <p><strong>Memory Usage:</strong> {metrics.memoryUsage.toFixed(2)} MB</p>
                  )}
                  {metrics.domNodes !== undefined && (
                    <p><strong>DOM Nodes:</strong> {metrics.domNodes}</p>
                  )}
                  <p><strong>Unnecessary Renders:</strong> {metrics.rerenderedWithoutPropChanges}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analyzePerformance().map((rec, idx) => (
                    <li key={idx} className="text-sm">{rec}</li>
                  ))}
                  {analyzePerformance().length === 0 && (
                    <li className="text-sm">No recommendations at this time.</li>
                  )}
                </ul>
              </div>
              
              <ConfiguredComponent />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nested State Management</CardTitle>
          </CardHeader>
          <CardContent>
            <NestedStateDemo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentProfilerDemo;
