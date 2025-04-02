
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAnalytics } from '@/hooks/use-analytics';

interface TimelineDataPoint {
  date: string;
  value: number;
  category: string;
}

const PreferenceTimeline = () => {
  const { getPreferenceTimeline, isLoading } = useAnalytics();
  const timelineData = getPreferenceTimeline();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-md p-2 text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value.toFixed(1)}</span>
            </p>
          ))}
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
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={timelineData}
        margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
        />
        <YAxis domain={[0, 5]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="Hero" 
          stroke="#ee682b" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Navbar" 
          stroke="#8439e9" 
        />
        <Line 
          type="monotone" 
          dataKey="Footer" 
          stroke="#6142e7" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PreferenceTimeline;
