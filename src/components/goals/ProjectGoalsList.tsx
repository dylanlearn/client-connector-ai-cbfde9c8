
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Target, Plus, ChevronRight } from 'lucide-react';
import { useProjectGoals } from '@/hooks/use-project-goals';
import { AlertMessage } from '@/components/ui/alert-message';
import { format } from 'date-fns';

interface ProjectGoalsListProps {
  projectId?: string;
  onSelectGoal?: (goalId: string) => void;
}

export function ProjectGoalsList({ projectId, onSelectGoal }: ProjectGoalsListProps) {
  const { goals, isLoading, error } = useProjectGoals(projectId);

  if (error) {
    return <AlertMessage type="error" title="Error loading goals">{error.message}</AlertMessage>;
  }

  if (!projectId) {
    return <AlertMessage type="warning" title="No project selected">Select a project to view goals.</AlertMessage>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Project Goals</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Goal</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : goals?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No goals defined for this project yet. Add your first goal to start tracking.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals?.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onClick={() => onSelectGoal?.(goal.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface GoalCardProps {
  goal: any;
  onClick: () => void;
}

function GoalCard({ goal, onClick }: GoalCardProps) {
  // Priority colors
  const priorityColors: Record<number, string> = {
    1: 'bg-green-100 border-green-200 text-green-800',
    2: 'bg-blue-100 border-blue-200 text-blue-800',
    3: 'bg-amber-100 border-amber-200 text-amber-800',
    4: 'bg-orange-100 border-orange-200 text-orange-800',
    5: 'bg-red-100 border-red-200 text-red-800'
  };

  // Status colors
  const statusColors: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'on-hold': 'bg-amber-100 text-amber-800',
    'completed': 'bg-blue-100 text-blue-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{goal.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={priorityColors[goal.priority] || ''}>
              P{goal.priority}
            </Badge>
            <Badge className={statusColors[goal.status] || ''}>
              {goal.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{goal.description}</p>
        
        {goal.target_date && (
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t bg-muted/50 flex justify-between">
        <div className="flex items-center text-sm">
          <Target className="mr-2 h-4 w-4" />
          {goal.kpi_count || 0} KPIs linked
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardFooter>
    </Card>
  );
}
