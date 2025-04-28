
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Plus, Target, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useKeyPerformanceIndicators } from '@/hooks/use-kpis';
import { AlertMessage } from '@/components/ui/alert-message';

interface KPIListProps {
  projectId?: string;
  goalId?: string;
}

export function KPIList({ projectId, goalId }: KPIListProps) {
  const { kpis, isLoading, error } = useKeyPerformanceIndicators(projectId, goalId);

  if (error) {
    return <AlertMessage type="error" title="Error loading KPIs">{error.message}</AlertMessage>;
  }

  if (!projectId) {
    return <AlertMessage type="warning" title="No project selected">Select a project to view KPIs.</AlertMessage>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Key Performance Indicators</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add KPI</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : kpis?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No KPIs defined for this {goalId ? 'goal' : 'project'} yet. Add your first KPI to start tracking performance.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kpis?.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      )}
    </div>
  );
}

interface KPICardProps {
  kpi: any;
}

function KPICard({ kpi }: KPICardProps) {
  const progressValue = kpi.target_value === 0 
    ? 0 
    : Math.min(100, (kpi.current_value / kpi.target_value) * 100);
  
  // Get status icon based on kpi.status
  const StatusIcon = () => {
    switch(kpi.status) {
      case 'exceeding':
        return <ArrowUp className="h-5 w-5 text-green-500" />;
      case 'meeting':
        return <ArrowRight className="h-5 w-5 text-amber-500" />;
      case 'below':
        return <ArrowDown className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Get color based on status
  const getStatusColor = () => {
    switch(kpi.status) {
      case 'exceeding': return 'text-green-500';
      case 'meeting': return 'text-amber-500';
      case 'below': return 'text-red-500';
      default: return '';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{kpi.name}</CardTitle>
            <CardDescription className="mt-1">{kpi.description}</CardDescription>
          </div>
          <Badge className="capitalize">{kpi.metric_type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Current vs Target</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIcon />
            <span className={`font-medium ${getStatusColor()}`}>
              {kpi.status === 'exceeding' ? 'Exceeding' : 
               kpi.status === 'meeting' ? 'Meeting' : 'Below'}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {kpi.current_value}
              {kpi.unit && <span className="text-muted-foreground ml-1">{kpi.unit}</span>}
            </span>
            <span className="text-muted-foreground">
              Goal: {kpi.target_value}
              {kpi.unit && <span className="ml-1">{kpi.unit}</span>}
            </span>
          </div>
          <Progress value={progressValue} />
        </div>
        
        <div className="flex items-center mt-2 text-sm">
          <Target className="mr-2 h-4 w-4 text-muted-foreground" />
          {kpi.element_connections || 0} wireframe elements connected
        </div>
      </CardContent>
    </Card>
  );
}
