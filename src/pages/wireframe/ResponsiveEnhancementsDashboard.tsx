
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreakpointInheritanceProvider } from '@/components/wireframe/responsive/BreakpointInheritance';
import { useStateTransitions } from '@/hooks/use-state-transitions';
import { StatefulComponent } from '@/components/visual-states/StatefulComponent';
import { InteractiveScrollTester } from '@/components/wireframe/scroll';

const ResponsiveEnhancementsDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Responsive Wireframe Enhancements</h1>
      
      <Tabs defaultValue="responsive">
        <TabsList className="mb-4">
          <TabsTrigger value="responsive">Breakpoint System</TabsTrigger>
          <TabsTrigger value="states">Visual States</TabsTrigger>
          <TabsTrigger value="scroll">Scroll Visualization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="responsive">
          <Card>
            <CardHeader>
              <CardTitle>Breakpoint Inheritance System</CardTitle>
            </CardHeader>
            <CardContent>
              <BreakpointInheritanceProvider>
                <BreakpointDemoContent />
              </BreakpointInheritanceProvider>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="states">
          <Card>
            <CardHeader>
              <CardTitle>Component State Management</CardTitle>
            </CardHeader>
            <CardContent>
              <StatesDemoContent />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scroll">
          <InteractiveScrollTester title="Scroll & Overflow Visualization" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Demo content for breakpoint inheritance system
const BreakpointDemoContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        The breakpoint inheritance system allows components to define behavior across
        different screen sizes while maintaining a clean API.
      </p>
      
      {/* Demo content for breakpoint inheritance */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Responsive Properties</h3>
        <p className="text-sm text-muted-foreground">
          Resize your browser window to see how these components adapt to different breakpoints.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Example responsive components would go here */}
          <Card>
            <CardContent className="p-4">
              <p className="font-medium">Responsive Card 1</p>
              <p className="text-sm text-muted-foreground">
                This card adjusts its layout based on screen size.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <p className="font-medium">Responsive Card 2</p>
              <p className="text-sm text-muted-foreground">
                This card adjusts its layout based on screen size.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <p className="font-medium">Responsive Card 3</p>
              <p className="text-sm text-muted-foreground">
                This card adjusts its layout based on screen size.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Demo content for state management
const StatesDemoContent: React.FC = () => {
  const { 
    currentState, 
    changeState,
    getTransitionStyles 
  } = useStateTransitions({
    initialState: 'default',
    autoPlayStates: false,
    duration: 300,
    timing: 'ease'
  });
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        The visual states system allows designers to preview and adjust component states
        and transitions between them.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">State Transitions</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => changeState('default')}
            className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200"
          >
            Default
          </button>
          <button 
            onClick={() => changeState('hover')}
            className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200"
          >
            Hover
          </button>
          <button 
            onClick={() => changeState('active')}
            className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200"
          >
            Active
          </button>
          <button 
            onClick={() => changeState('focus')}
            className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200"
          >
            Focus
          </button>
          <button 
            onClick={() => changeState('disabled')}
            className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200"
          >
            Disabled
          </button>
        </div>
        
        <div className="flex justify-center p-6">
          <StatefulComponent 
            state={currentState} 
            style={getTransitionStyles()}
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Current state: <span className="font-medium">{currentState}</span>
        </p>
      </div>
    </div>
  );
};

export default ResponsiveEnhancementsDashboard;
