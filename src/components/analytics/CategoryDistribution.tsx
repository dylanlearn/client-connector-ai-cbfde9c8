
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CategoryDistribution = () => {
  // This would normally come from your data source
  const data = [
    { name: 'Hero', value: 35, color: '#ee682b' },
    { name: 'Navbar', value: 25, color: '#ec7f00' },
    { name: 'About', value: 15, color: '#af5cf7' },
    { name: 'Footer', value: 15, color: '#8439e9' },
    { name: 'Font', value: 10, color: '#6142e7' },
  ];

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

  return (
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
  );
};

export default CategoryDistribution;
