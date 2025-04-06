import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardSectionProps {
  sectionIndex: number;
  variant?: string;
  layout?: string;
  darkMode?: boolean;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  sectionIndex,
  variant = 'default',
  layout = 'grid',
  darkMode = false,
}) => {
  // Dashboard color styles
  const getColorClass = (index: number) => {
    const colors = [
      'bg-blue-100 border-blue-200',
      'bg-purple-100 border-purple-200',
      'bg-green-100 border-green-200',
      'bg-yellow-100 border-yellow-200',
    ];
    
    if (darkMode) {
      return 'bg-gray-800 border-gray-700';
    }
    
    return colors[index % colors.length];
  };
  
  // Mock data for charts
  const metrics = [
    { label: 'Total Revenue', value: '$24,345', change: '+12.5%', icon: DollarSign },
    { label: 'Active Users', value: '1,234', change: '+7.2%', icon: TrendingUp },
    { label: 'Conversion Rate', value: '3.4%', change: '+0.8%', icon: PieChart },
    { label: 'Avg. Transaction', value: '$94.50', change: '+2.3%', icon: BarChart3 },
  ];
  
  // Chart placeholder component
  const ChartPlaceholder = ({ type, height }: { type: string, height: string }) => (
    <div className={`relative rounded-md border ${height} overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {type === 'bar' && <BarChart3 className={`h-10 w-10 mx-auto ${darkMode ? 'text-gray-700' : 'text-gray-400'}`} />}
          {type === 'pie' && <PieChart className={`h-10 w-10 mx-auto ${darkMode ? 'text-gray-700' : 'text-gray-400'}`} />}
          {type === 'line' && <TrendingUp className={`h-10 w-10 mx-auto ${darkMode ? 'text-gray-700' : 'text-gray-400'}`} />}
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{type.charAt(0).toUpperCase() + type.slice(1)} Chart</p>
        </div>
      </div>
    </div>
  );
  
  // Table placeholder
  const TablePlaceholder = () => (
    <div className={`rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className={`p-2 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <div className="grid grid-cols-4 gap-4">
          <div className={`h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className={`p-2 border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-4 gap-4">
            <div className={`h-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
  
  // Sidebar placeholder for dashboard layout
  const SidebarPlaceholder = () => (
    <div className={`hidden md:block w-48 border-r h-full ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
      <div className="p-3 space-y-6">
        <div className={`h-8 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className={`h-5 w-32 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-28 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Top navigation bar for dashboard
  const TopNavPlaceholder = () => (
    <div className={`w-full h-14 px-4 border-b flex items-center justify-between ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-4">
        <div className={`h-6 w-24 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        <div className="hidden md:flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-4 w-16 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
      </div>
    </div>
  );

  // Render the dashboard section based on the variant
  return (
    <section className={`py-4 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-white'}`}>
      <div className={`flex flex-col ${variant === 'sidebar' ? 'md:flex-row' : ''}`}>
        {variant === 'sidebar' && <SidebarPlaceholder />}
        <div className="flex-1">
          <TopNavPlaceholder />
          
          <div className="p-4 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, idx) => (
                <Card key={idx} className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <div className="flex justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
                      <p className="text-xl font-semibold mt-1">{metric.value}</p>
                    </div>
                    <div className={`p-2 rounded-full ${getColorClass(idx)}`}>
                      <metric.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change}
                    </span>
                    <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>vs last period</span>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Revenue Trends</h3>
                <ChartPlaceholder type="line" height="h-64" />
              </Card>
              
              <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sales Distribution</h3>
                <ChartPlaceholder type="pie" height="h-64" />
              </Card>
            </div>
            
            {/* Table Section */}
            <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recent Transactions</h3>
              <TablePlaceholder />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
