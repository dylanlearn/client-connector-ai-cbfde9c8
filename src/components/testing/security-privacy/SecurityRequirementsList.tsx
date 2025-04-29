
import React from 'react';
import { SecurityPrivacyRequirement, SecurityPrivacyService } from '@/services/testing/SecurityPrivacyService';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface SecurityRequirementsListProps {
  requirements: SecurityPrivacyRequirement[];
}

const SecurityRequirementsList: React.FC<SecurityRequirementsListProps> = ({ requirements }) => {
  if (requirements.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground px-6">
        No requirements available.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {requirements.map((requirement) => (
        <div key={requirement.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">{requirement.name}</div>
            <Badge className={SecurityPrivacyService.getSeverityColor(requirement.severity)}>
              {requirement.severity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{requirement.description}</p>
          
          {requirement.guidance && (
            <div className="bg-blue-50 p-3 rounded-md flex gap-2">
              <Info className="h-4 w-4 text-blue-700 mt-0.5" />
              <p className="text-sm text-blue-700">{requirement.guidance}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SecurityRequirementsList;
