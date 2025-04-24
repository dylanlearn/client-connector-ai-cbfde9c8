
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useComponentProfiler from '@/hooks/use-component-profiler';
import useNestedState from '@/hooks/use-nested-state';

// Demo component for profiling
const ProfiledComponent: React.FC<{ complexity: number }> = ({ complexity }) => {
  const [counter, setCounter] = useState(0);
  
  // Simulate expensive rendering
  useEffect(() => {
    const startTime = performance.now();
    // Simulate work that takes time based on complexity
    for (let i = 0; i < complexity * 1000; i++) {
      Math.sqrt(i * complexity);
    }
    console.log(`Render work took: ${performance.now() - startTime}ms`);
  }, [complexity, counter]);
  
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium">Profiled Component</h3>
      <p>Counter: {counter}</p>
      <p>Complexity: {complexity}</p>
      <Button onClick={() => setCounter(c => c + 1)} className="mt-2">
        Trigger Re-render
      </Button>
    </div>
  );
};

// Demo for the nested state system
const NestedStateDemo: React.FC = () => {
  // Create a nested state system for theme settings
  const { NestedProvider, useNestedStateContext } = useNestedState({
    theme: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Inter',
        body: 'Roboto'
      },
      spacing: {
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem'
      }
    },
    settings: {
      darkMode: false,
      animations: true,
      notifications: true
    }
  });

  // Component that displays and manages theme settings
  const ThemeManager: React.FC = () => {
    const { state, overrideState, resetState, isOverridden } = useNestedStateContext();

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Theme Manager</h3>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span>Primary Color:</span>
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded-full" 
                style={{ backgroundColor: state.theme.colors.primary }}
              />
              <input
                type="color"
                value={state.theme.colors.primary}
                onChange={(e) => overrideState('theme.colors.primary', e.target.value)}
                className="w-10 h-8"
              />
              {isOverridden('theme.colors.primary') && (
                <Badge variant="outline" className="ml-2 cursor-pointer" onClick={() => resetState('theme.colors.primary')}>
                  Reset
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Secondary Color:</span>
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded-full" 
                style={{ backgroundColor: state.theme.colors.secondary }}
              />
              <input
                type="color"
                value={state.theme.colors.secondary}
                onChange={(e) => overrideState('theme.colors.secondary', e.target.value)}
                className="w-10 h-8"
              />
              {isOverridden('theme.colors.secondary') && (
                <Badge variant="outline" className="ml-2 cursor-pointer" onClick={() => resetState('theme.colors.secondary')}>
                  Reset
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Dark Mode:</span>
            <input
              type="checkbox"
              checked={state.settings.darkMode}
              onChange={(e) => overrideState('settings.darkMode', e.target.checked)}
              className="h-4 w-4"
            />
          </div>
        </div>
        
        <Button onClick={() => resetState()} variant="outline" size="sm">
          Reset All
        </Button>
        
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Current State:</h4>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  // Child component that inherits theme
  const ChildComponent: React.FC = () => {
    const ChildNestedProvider = NestedProvider;
    return (
      <ChildNestedProvider initialState={{ settings: { animations: false } }}>
        <ChildContent />
      </ChildNestedProvider>
    );
  };

  const ChildContent: React.FC = () => {
    const { state, inheritState } = useNestedStateContext();

    return (
      <div className="border p-4 mt-4 rounded-md">
        <h3 className="text-lg font-semibold">Child Component</h3>
        <p>This component inherits and can override parent state</p>
        
        <div className="mt-2">
          <Button 
            onClick={() => inheritState('theme.colors.primary')}
            size="sm"
          >
            Inherit Primary Color
          </Button>
        </div>
        
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Child State:</h4>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-4">
        <h2 className="text-xl font-bold mb-4">Nested State Management</h2>
        <p className="text-gray-600 mb-4">
          This demo shows how state can be shared and inherited between parent and child components,
          with the ability to override specific values.
        </p>
      </div>

      <NestedProvider>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-4">
            <ThemeManager />
          </Card>
          <Card className="p-4">
            <ChildComponent />
          </Card>
        </div>
      </NestedProvider>
    </div>
  );
};

// Main component that demonstrates both profiler and nested state
export const ComponentProfilerDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('profiler');
  const [complexity, setComplexity] = useState<number>(5);

  // Initialize the profiler
  const { 
    metrics, 
    captureRenderStart, 
    captureRenderEnd,
    resetMetrics,
    analyzePerformance
  } = useComponentProfiler('ProfiledComponent', {
    trackMemory: true,
    trackDOMNodes: true,
    logToConsole: true
  });

  // Profile the component
  const ProfilerDemo = () => {
    useEffect(() => {
      captureRenderStart();
      return () => {
        captureRenderEnd();
      };
    }, []);

    return (
      <div className="space-y-6">
        <div className="pb-4">
          <h2 className="text-xl font-bold mb-4">Component Performance Profiler</h2>
          <p className="text-gray-600 mb-4">
            This demo shows how to profile component rendering performance and get metrics
            to optimize your React components.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span>Complexity:</span>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={complexity} 
            onChange={(e) => setComplexity(parseInt(e.target.value))}
            className="w-40"
          />
          <span>{complexity}</span>
          <Button onClick={resetMetrics} variant="outline" size="sm">Reset Metrics</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-4">
            <ProfiledComponent complexity={complexity} />
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Render Count:</span>
                <span className="font-medium">{metrics.renderCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Render Time:</span>
                <span className="font-medium">{metrics.lastRenderTime.toFixed(2)} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Render Time:</span>
                <span className="font-medium">{metrics.averageRenderTime.toFixed(2)} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Render Time:</span>
                <span className="font-medium">{metrics.maxRenderTime.toFixed(2)} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Render Time:</span>
                <span className="font-medium">{metrics.totalRenderTime.toFixed(2)} ms</span>
              </div>
              {metrics.memoryUsage !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Usage:</span>
                  <span className="font-medium">{metrics.memoryUsage.toFixed(2)} MB</span>
                </div>
              )}
              {metrics.domNodes !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">DOM Nodes:</span>
                  <span className="font-medium">{metrics.domNodes}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Unnecessary Renders:</span>
                <span className="font-medium">{metrics.rerenderedWithoutPropChanges}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {analyzePerformance().length > 0 ? (
                  analyzePerformance().map((rec, i) => (
                    <li key={i} className="text-amber-700">{rec}</li>
                  ))
                ) : (
                  <li className="text-green-600">No performance issues detected</li>
                )}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="profiler">Performance Profiler</TabsTrigger>
        <TabsTrigger value="nestedState">Nested State Management</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profiler">
        <ProfilerDemo />
      </TabsContent>
      
      <TabsContent value="nestedState">
        <NestedStateDemo />
      </TabsContent>
    </Tabs>
  );
};

export default ComponentProfilerDemo;
