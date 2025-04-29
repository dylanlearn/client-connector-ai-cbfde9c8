
import React from 'react';
import { SecurityPrivacyReview, SecurityPrivacyService } from '@/services/testing/SecurityPrivacyService';
import { Shield, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SecurityReviewResultsProps {
  review: SecurityPrivacyReview;
}

const SecurityReviewResults: React.FC<SecurityReviewResultsProps> = ({ review }) => {
  if (!review) return null;

  const hasFindings = review.findings && review.findings.length > 0;

  return (
    <div className="space-y-6">
      {review.recommendations && (
        <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recommendations
          </h4>
          <p className="text-blue-700">{review.recommendations}</p>
        </div>
      )}

      <div>
        <h4 className="font-medium mb-3">
          {hasFindings ? 'Security & Privacy Findings' : 'No Issues Found'}
        </h4>
        
        {hasFindings ? (
          <div className="space-y-3">
            {review.findings?.map((finding, index) => (
              <div 
                key={index} 
                className={`border rounded-md p-3 ${SecurityPrivacyService.getSeverityColor(finding.severity)}`}
              >
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      Element: {finding.elementId}
                    </div>
                    <div>{finding.finding}</div>
                    <div className="text-sm mt-1">
                      <span className="uppercase font-medium mr-1">Severity:</span>
                      <span className="capitalize">{finding.severity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 items-center text-green-700 bg-green-50 p-4 rounded-md">
            <ShieldCheck className="h-5 w-5" />
            <span>No security or privacy issues detected in this wireframe!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityReviewResults;
