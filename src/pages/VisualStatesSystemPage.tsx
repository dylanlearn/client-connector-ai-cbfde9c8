
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisualStateProvider } from '@/contexts/VisualStateContext';
import { StateControls } from '@/components/visual-states/StateControls';
import { StatefulButton } from '@/components/visual-states/StatefulButton';
import { StatefulCard } from '@/components/visual-states/StatefulCard';
import { StatefulInput } from '@/components/visual-states/StatefulInput';

const VisualStatesSystemPage = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Visual States System</h1>
      <p className="text-gray-600 mb-8">
        A system for visualizing component states and transitions
      </p>
      
      <VisualStateProvider>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>State Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <StateControls />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Button States</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <StatefulButton />
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Card States</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <StatefulCard />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Input States</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <StatefulInput />
              </CardContent>
            </Card>
          </div>
        </div>
      </VisualStateProvider>
    </div>
  );
};

export default VisualStatesSystemPage;
