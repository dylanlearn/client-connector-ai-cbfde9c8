
import React from 'react';
import { SecurityPrivacyService } from '@/services/testing/SecurityPrivacyService';

interface SecurityRiskScoreCardProps {
  score: number;
}

const SecurityRiskScoreCard: React.FC<SecurityRiskScoreCardProps> = ({ score }) => {
  const scorePercentage = (score * 100).toFixed(0);
  const scoreColorClass = SecurityPrivacyService.getRiskScoreColor(score);
  
  let scoreLabel = 'Low Risk';
  if (score >= 0.7) scoreLabel = 'High Risk';
  else if (score >= 0.3) scoreLabel = 'Medium Risk';
  
  return (
    <div className="flex items-center gap-2">
      <div className={`text-2xl font-bold ${scoreColorClass}`}>{scorePercentage}%</div>
      <div className="text-sm">
        <div className={scoreColorClass}>{scoreLabel}</div>
        <div className="text-muted-foreground">Risk Score</div>
      </div>
    </div>
  );
};

export default SecurityRiskScoreCard;
