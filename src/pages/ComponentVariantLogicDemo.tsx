
import { useState } from 'react';
import { useNestedState } from '@/hooks/use-nested-state';
import { useComponentProfiler } from '@/hooks/use-component-profiler';
import { ComponentDefinitionDemo } from '@/components/ComponentDefinitionDemo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Create a theme state context with nested state management
const themeDefaults = {
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    text: '#1f2937',
    background: '#ffffff',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      base: '16px',
      headings: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.5rem',
      }
    },
  }
};

// Initialize the nested state hook with the theme defaults
const { NestedProvider: ThemeProvider, useNestedStateContext: useThemeContext } = 
  useNestedState(themeDefaults);

// Sample child component using the theme context
const ChildComponent = ({ label, path, level = 0 }: { label: string, path: string, level?: number }) => {
  const { state, overrideState, inheritState, isOverridden, resetState } = useThemeContext();
  const profiler = useComponentProfiler(`ChildComponent-${label}`, { logToConsole: true, trackProps: true });
  const nestedValue = path.split('.').reduce((obj, key) => obj?.[key], state as any);
  
  profiler.captureRenderStart();
  
  // Profile state change function
  const handleOverride = profiler.profileFunction(() => {
    const newValue = typeof nestedValue === 'string' 
      ? prompt(`Override ${path} (currently ${nestedValue}):`, nestedValue) || nestedValue
      : nestedValue;
    overrideState(path, newValue);
  }, 'handleOverride');
  
  const handleReset = () => {
    resetState(path);
  };
  
  // Capture render metrics for the component
  useState(() => {
    profiler.captureRenderEnd({ label, path, level });
  });
  
  const recommendations = profiler.analyzePerformance();
  
  return (
    <Card className={`ml-${level * 4} mb-2`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-medium">{label}</span>
            <code className="ml-2 text-sm text-gray-500">{path}</code>
            {isOverridden(path) && (
              <Badge variant="outline" className="ml-2">Overridden</Badge>
            )}
          </div>
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={handleOverride}>
              Override
            </Button>
            {isOverridden(path) && (
              <Button size="sm" variant="ghost" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-2 rounded text-sm">
          <pre className="whitespace-pre-wrap break-all">
            {typeof nestedValue === 'object' 
              ? JSON.stringify(nestedValue, null, 2)
              : String(nestedValue)
            }
          </pre>
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-2 text-xs text-amber-600">
            <strong>Performance tips:</strong>
            <ul className="list-disc pl-4">
              {recommendations.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          Rendered {profiler.metrics.renderCount} times ({profiler.metrics.lastRenderTime.toFixed(2)}ms last render)
        </div>
      </CardContent>
    </Card>
  );
};

// Parent component with nested children
const NestedStateDemo = () => {
  const { state, setState } = useThemeContext();
  const profiler = useComponentProfiler('NestedStateDemo', { 
    trackMemory: true, 
    trackDOMNodes: true,
    logToConsole: true
  });
  
  profiler.captureRenderStart();
  
  const forceRerender = () => {
    setState({...state});
  };
  
  const stressTest = () => {
    // Force multiple rerenders to test performance
    for (let i = 0; i < 10; i++) {
      setTimeout(forceRerender, i * 100);
    }
  };
  
  const resetAll = () => {
    setState({...themeDefaults});
  };
  
  useState(() => {
    profiler.captureRenderEnd();
  });
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Nested State Management</h2>
        <div className="space-x-2">
          <Button size="sm" onClick={forceRerender}>Force Rerender</Button>
          <Button size="sm" variant="outline" onClick={stressTest}>Stress Test</Button>
          <Button size="sm" variant="secondary" onClick={resetAll}>Reset All</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Current render statistics for this component tree</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium">Render Count</p>
              <p className="text-2xl">{profiler.metrics.renderCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Avg Render Time</p>
              <p className="text-2xl">{profiler.metrics.averageRenderTime.toFixed(2)}ms</p>
            </div>
            <div>
              <p className="text-sm font-medium">DOM Nodes</p>
              <p className="text-2xl">{profiler.metrics.domNodes || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Memory Usage</p>
              <p className="text-2xl">{profiler.metrics.memoryUsage ? 
                `${profiler.metrics.memoryUsage.toFixed(2)}MB` : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <ChildComponent label="Colors" path="colors" />
        <ChildComponent label="Primary Color" path="colors.primary" level={1} />
        <ChildComponent label="Secondary Color" path="colors.secondary" level={1} />
        <ChildComponent label="Typography" path="typography" />
        <ChildComponent label="Font Family" path="typography.fontFamily" level={1} />
        <ChildComponent label="Font Sizes" path="typography.fontSize" level={1} />
        <ChildComponent label="Heading Sizes" path="typography.fontSize.headings" level={2} />
        <ChildComponent label="H1 Size" path="typography.fontSize.headings.h1" level={3} />
      </div>
    </div>
  );
};

// Main page component
const ComponentVariantLogicDemo = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Component Systems</h1>
      
      <Tabs defaultValue="nested-state" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nested-state">Nested State Management</TabsTrigger>
          <TabsTrigger value="component-definition">Component Definition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nested-state" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nested State Management System</CardTitle>
              <CardDescription>
                Manage complex state relationships with inheritance and override capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeProvider>
                <NestedStateDemo />
              </ThemeProvider>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="component-definition">
          <ComponentDefinitionDemo />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-8" />
      
      <div className="text-sm text-gray-500">
        <p>
          This demo showcases advanced component systems for building flexible and performant UI components.
          You can experiment with state inheritance, overrides, and performance profiling.
        </p>
      </div>
    </div>
  );
};

export default ComponentVariantLogicDemo;
