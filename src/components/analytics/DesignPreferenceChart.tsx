
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DesignPreferenceChart = () => {
  // This would normally come from your data source
  const data = [
    { name: 'Modern Hero', average: 4.2, count: 32 },
    { name: 'Classic Navbar', average: 3.8, count: 28 },
    { name: 'Minimal About', average: 4.5, count: 35 },
    { name: 'Dark Footer', average: 3.2, count: 22 },
    { name: 'Serif Font', average: 4.0, count: 30 },
    { name: 'Hero Variant 2', average: 4.7, count: 38 },
    { name: 'Navbar Variant 3', average: 3.5, count: 25 },
  ];

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

  return (
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
  );
};

export default DesignPreferenceChart;
