
import React from 'react';

interface ApiUsageChartProps {
  data: any | null;
}

const ApiUsageChart: React.FC<ApiUsageChartProps> = ({ data }) => {
  if (!data) {
    return <div className="text-center py-4 text-muted-foreground">No API usage data available</div>;
  }
  
  return (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      API usage chart visualization would go here
    </div>
  );
};

export default ApiUsageChart;
