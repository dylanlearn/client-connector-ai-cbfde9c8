
import React from 'react';
import { TechnicalFeasibilityService } from '@/services/testing/TechnicalFeasibilityService';

interface FeasibilityScoreCardProps {
  score: number;
}

const FeasibilityScoreCard: React.FC<FeasibilityScoreCardProps> = ({ score }) => {
  const scorePercentage = (score * 100).toFixed(0);
  const scoreColorClass = TechnicalFeasibilityService.getScoreColor(score);
  
  let scoreLabel = 'Poor';
  if (score >= 0.9) scoreLabel = 'Excellent';
  else if (score >= 0.8) scoreLabel = 'Very Good';
  else if (score >= 0.7) scoreLabel = 'Good';
  else if (score >= 0.5) scoreLabel = 'Average';
  
  return (
    <div className="flex items-center gap-2">
      <div className={`text-2xl font-bold ${scoreColorClass}`}>{scorePercentage}%</div>
      <div className="text-sm">
        <div className={scoreColorClass}>{scoreLabel}</div>
        <div className="text-muted-foreground">Feasibility</div>
      </div>
    </div>
  );
};

export default FeasibilityScoreCard;
