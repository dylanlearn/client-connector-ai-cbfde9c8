
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface AIInsightCardProps {
  title: string;
  insights: string[];
  className?: string;
  icon?: React.ReactNode;
}

const AIInsightCard = ({
  title,
  insights,
  className = "",
  icon = <Zap className="h-5 w-5" />,
}: AIInsightCardProps) => {
  return (
    <Card className={`glass-card hover-card-animate ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className="bg-gradient-primary p-1.5 rounded-full mr-2">
            <span className="text-white">{icon}</span>
          </div>
          <span className="text-gradient">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="bg-gradient-to-br from-[#ee682b] via-[#8439e9] to-[#6142e7] text-white rounded-full p-1 mt-0.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
