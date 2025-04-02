
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const InteractionMetrics = () => {
  const metrics = [
    { 
      name: "Total Clicks", 
      value: "2,145", 
      change: 12.4, 
      isPositive: true 
    },
    { 
      name: "Avg. Time (sec)", 
      value: "42.3", 
      change: 8.7, 
      isPositive: true 
    },
    { 
      name: "Bounce Rate", 
      value: "24.8%", 
      change: 3.2, 
      isPositive: false 
    },
    { 
      name: "Click Density", 
      value: "High", 
      note: "Above avg." 
    },
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center justify-between pb-2 last:pb-0 last:border-0 border-b border-gray-100">
          <span className="text-sm font-medium">{metric.name}</span>
          <div className="flex items-center">
            <span className="font-semibold">{metric.value}</span>
            {metric.change && (
              <div className={`flex items-center ml-2 text-xs ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                )}
                {metric.change}%
              </div>
            )}
            {metric.note && (
              <span className="ml-2 text-xs text-muted-foreground">{metric.note}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InteractionMetrics;
