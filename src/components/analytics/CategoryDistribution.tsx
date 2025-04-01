
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAnalytics } from '@/hooks/use-analytics';

const CategoryDistribution = () => {
  const { getCategoryDistribution, isLoading, isRealtime } = useAnalytics();
  const data = getCategoryDistribution();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-md p-2 text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p>Preference: <span className="font-medium">{payload[0].value}%</span></p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-40 w-40 rounded-full bg-muted animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {isRealtime && (
        <div className="absolute top-0 left-0 text-xs text-muted-foreground flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Live data
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryDistribution;
