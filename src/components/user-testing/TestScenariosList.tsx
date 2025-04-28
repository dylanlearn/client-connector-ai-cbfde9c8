
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, List, Plus, BarChart, Clock } from 'lucide-react';
import { useTestScenarios } from '@/hooks/use-test-scenarios';
import { AlertMessage } from '@/components/ui/alert-message';

export function TestScenariosList() {
  const { scenarios, isLoading, error } = useTestScenarios();

  if (error) {
    return <AlertMessage type="error" title="Error loading test scenarios">{error.message}</AlertMessage>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Test Scenarios</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Create Scenario</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : scenarios?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No test scenarios created yet. Create your first scenario to start simulating user testing.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios?.map((scenario) => (
            <Card key={scenario.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{scenario.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {scenario.description}
                    </CardDescription>
                  </div>
                  <Badge>
                    Difficulty: {scenario.difficulty_level}/5
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Est. completion: {Math.round(scenario.estimated_completion_time / 60)} mins</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <List className="mr-1 h-4 w-4" />
                  <span>{scenario.task_count || 0} Tasks</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
                <Button variant="outline" className="flex items-center gap-1">
                  <List className="h-4 w-4" />
                  <span>View Tasks</span>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    <span>Results</span>
                  </Button>
                  <Button className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>Simulate</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
