
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';

const FunnelVisualization = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const data = [
    { stage: 'Page View', value: 1000, description: 'Initial landing page visits' },
    { stage: 'Engagement', value: 750, description: 'Visitors who interact with content' },
    { stage: 'Sign Up Click', value: 480, description: 'Clicked on sign up/contact button' },
    { stage: 'Form Start', value: 380, description: 'Started filling contact/signup form' },
    { stage: 'Form Complete', value: 270, description: 'Completed form submission' },
    { stage: 'Conversion', value: 180, description: 'Completed desired action' },
  ];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-md p-3 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-gray-700">{payload[0].payload.description}</p>
          <div className="flex justify-between mt-1">
            <span>Count:</span>
            <span className="font-medium">{payload[0].value}</span>
          </div>
          {payload[0].payload.dropoff && (
            <div className="flex justify-between text-red-600">
              <span>Dropoff:</span>
              <span className="font-medium">{payload[0].payload.dropoff}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Calculate dropoff rates
  const dataWithDropoff = data.map((item, index, arr) => {
    if (index === 0) return item;
    const prevValue = arr[index - 1].value;
    const dropoff = Math.round(((prevValue - item.value) / prevValue) * 100);
    return { ...item, dropoff };
  });
  
  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  const getColors = () => {
    const baseColor = [65, 105, 225]; // Royal blue in RGB
    return data.map((_, index) => {
      const opacity = 1 - (index * 0.15);
      return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${opacity})`;
    });
  };
  
  const colors = getColors();
  
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataWithDropoff}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" />
          <YAxis 
            dataKey="stage" 
            type="category" 
            scale="band" 
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index]} 
                stroke={activeIndex === index ? '#333' : 'none'}
                strokeWidth={activeIndex === index ? 1 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelVisualization;
