
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '@/hooks/use-analytics';

const DesignPreferenceChart = () => {
  const { analytics, isLoading, isRealtime } = useAnalytics();
  
  // Prepare data for chart
  const data = analytics
    ? analytics.slice(0, 7).map(item => ({
        name: item.title,
        average: item.average_rank,
        count: item.selection_count
      }))
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-2 text-sm">
          <p className="font-medium">{label}</p>
          <p>Average Rank: <span className="font-medium">{payload[0].value.toFixed(1)}</span></p>
          <p>Selected: <span className="font-medium">{payload[0].payload.count} times</span></p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-40 w-full bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {isRealtime && (
        <div className="absolute top-0 left-0 text-xs text-muted-foreground flex items-center z-10">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Live data
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70} 
            tick={{ fontSize: 12 }}
          />
          <YAxis domain={[0, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="designGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ee682b" />
              <stop offset="50%" stopColor="#8439e9" />
              <stop offset="100%" stopColor="#6142e7" />
            </linearGradient>
          </defs>
          <Bar dataKey="average" fill="url(#designGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DesignPreferenceChart;
