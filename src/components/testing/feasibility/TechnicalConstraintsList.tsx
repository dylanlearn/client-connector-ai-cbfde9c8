
import React from 'react';
import { TechnicalConstraint } from '@/services/testing/TechnicalFeasibilityService';
import { Badge } from '@/components/ui/badge';

interface TechnicalConstraintsListProps {
  constraints: TechnicalConstraint[];
}

const TechnicalConstraintsList: React.FC<TechnicalConstraintsListProps> = ({ constraints }) => {
  if (constraints.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No constraints available.
      </div>
    );
  }

  const getConstraintTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'resource':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'display':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'performance':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'connectivity':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'compatibility':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {constraints.map((constraint) => (
        <div key={constraint.id} className="p-3 border rounded-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{constraint.name}</h3>
            <Badge className={getConstraintTypeColor(constraint.constraintType)} variant="outline">
              {constraint.constraintType}
            </Badge>
          </div>
          {constraint.description && (
            <p className="text-sm text-muted-foreground mb-3">{constraint.description}</p>
          )}
          <div className="bg-slate-50 p-2 rounded-md text-sm">
            <div className="font-mono">
              {Object.entries(constraint.parameters).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-700">{key}:</span>
                  <span>{JSON.stringify(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnicalConstraintsList;
