
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface RiskListProps {
  assessments: any[];
  isLoading: boolean;
}

export const RiskList: React.FC<RiskListProps> = ({ assessments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!assessments?.length) {
    return (
      <Alert>
        <AlertTitle>No risks assessed</AlertTitle>
        <AlertDescription>
          Start by assessing potential implementation risks.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <div key={assessment.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">
              {assessment.risk_assessment_templates.risk_categories.name}
            </h3>
            <Badge variant={getRiskBadgeVariant(assessment.risk_level)}>
              {assessment.risk_level}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {assessment.risk_factors.description}
          </p>
          {assessment.mitigation_plan && (
            <div className="text-sm">
              <strong>Mitigation: </strong>
              {assessment.mitigation_plan.strategy}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

function getRiskBadgeVariant(level: string): 'default' | 'destructive' | 'warning' {
  switch (level) {
    case 'high':
    case 'critical':
      return 'destructive';
    case 'medium':
      return 'warning';
    default:
      return 'default';
  }
}
