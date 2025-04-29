
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { ReactNode } from "react";

interface AnalyticsStatProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: ReactNode;
  invertTrend?: boolean;
}

export function AnalyticsStat({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  invertTrend = false
}: AnalyticsStatProps) {
  const getChangeDisplay = () => {
    if (!change) return null;
    
    let displayTrend = trend;
    if (invertTrend && trend) {
      displayTrend = trend === 'up' ? 'down' : 'up';
    }
    
    return (
      <div className={`flex items-center text-xs font-medium ${
        displayTrend === 'up' 
          ? 'text-emerald-500' 
          : displayTrend === 'down' 
            ? 'text-rose-500' 
            : 'text-muted-foreground'
      }`}>
        {displayTrend === 'up' ? (
          <ArrowUp className="mr-1 h-3 w-3" />
        ) : displayTrend === 'down' ? (
          <ArrowDown className="mr-1 h-3 w-3" />
        ) : null}
        <span>{change}%</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-5 w-5 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {getChangeDisplay()}
      </CardContent>
    </Card>
  );
}
