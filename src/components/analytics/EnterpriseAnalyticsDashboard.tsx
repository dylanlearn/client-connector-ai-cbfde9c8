
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { BarChart3, CalendarIcon, ChevronDown, Download, LineChart, PieChart, UsersRound } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { AnalyticsChart } from './AnalyticsChart';
import { AnalyticsStat } from './AnalyticsStat';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAnalyticsAPI } from '@/hooks/analytics/use-analytics-api';
import { DateRangePicker } from '@/components/ui/date-range-picker';

const EnterpriseAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isLoading, fetchAnalytics } = useAnalyticsAPI();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const [analyticsData, setAnalyticsData] = useState<any>({
    productivityMetrics: {
      taskCompletion: { total: 427, average: 89.3, change: 12, trend: 'up' },
      responseTime: { total: 2.4, average: 2.4, change: 18, trend: 'up' },
      qualityScore: { total: 96, average: 96, change: 3, trend: 'up' },
      userSatisfaction: { total: 4.8, average: 4.8, change: 5, trend: 'up' }
    },
    utilizationData: {
      cpu: 67,
      memory: 42,
      storage: 31,
      bandwidth: 78
    }
  });

  useEffect(() => {
    loadAnalyticsData('month');
  }, []);

  const loadAnalyticsData = async (period: string) => {
    try {
      // This would call the actual analytics API in a real app
      // const data = await fetchAnalytics(period);
      // setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDate(range);
    // Here you would fetch data for the specific date range
    // fetchAnalyticsForDateRange(range.from, range.to);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for enterprise decision making
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DateRangePicker 
            onUpdate={handleDateRangeChange}
          />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="resources">Resource Utilization</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsStat 
              title="Projects" 
              value="38" 
              change={12} 
              trend="up" 
            />
            <AnalyticsStat 
              title="Active Users" 
              value="1,429" 
              change={8} 
              trend="up" 
            />
            <AnalyticsStat 
              title="Resources" 
              value="64.2%" 
              change={5} 
              trend="down"
              invertTrend
            />
            <AnalyticsStat 
              title="Avg Response" 
              value="1.8h" 
              change={15} 
              trend="up" 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AnalyticsChart 
                  type="line"
                  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                  datasets={[
                    {
                      label: 'Projects',
                      data: [65, 59, 80, 81, 56, 55, 40, 56, 76, 85, 90, 100],
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    },
                    {
                      label: 'Tasks',
                      data: [28, 48, 40, 19, 86, 27, 90, 102, 129, 145, 138, 156],
                      borderColor: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    }
                  ]}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resource Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AnalyticsChart 
                  type="pie"
                  labels={['Development', 'Design', 'Marketing', 'Operations', 'Support']}
                  datasets={[
                    {
                      label: 'Resource Allocation',
                      data: [35, 20, 15, 20, 10],
                      backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6',
                        '#ec4899'
                      ],
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <AnalyticsChart 
                type="bar"
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                datasets={[
                  {
                    label: 'Load Time (s)',
                    data: [4.3, 3.9, 3.2, 2.8, 2.5, 2.1],
                    backgroundColor: '#2563eb',
                  },
                  {
                    label: 'Error Rate (%)',
                    data: [2.1, 1.8, 1.5, 1.2, 0.9, 0.6],
                    backgroundColor: '#ef4444',
                  },
                  {
                    label: 'User Satisfaction',
                    data: [3.8, 3.9, 4.1, 4.2, 4.5, 4.8],
                    backgroundColor: '#10b981',
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="productivity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsStat 
              title="Task Completion" 
              value={`${analyticsData.productivityMetrics.taskCompletion.average}%`}
              change={analyticsData.productivityMetrics.taskCompletion.change}
              trend={analyticsData.productivityMetrics.taskCompletion.trend}
            />
            <AnalyticsStat 
              title="Avg Response Time" 
              value={`${analyticsData.productivityMetrics.responseTime.average}h`}
              change={analyticsData.productivityMetrics.responseTime.change}
              trend="up"
            />
            <AnalyticsStat 
              title="Quality Score" 
              value={analyticsData.productivityMetrics.qualityScore.average}
              change={analyticsData.productivityMetrics.qualityScore.change}
              trend={analyticsData.productivityMetrics.qualityScore.trend}
            />
            <AnalyticsStat 
              title="User Satisfaction" 
              value={analyticsData.productivityMetrics.userSatisfaction.average}
              change={analyticsData.productivityMetrics.userSatisfaction.change}
              trend={analyticsData.productivityMetrics.userSatisfaction.trend}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Productivity Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <AnalyticsChart 
                  type="line"
                  labels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8']}
                  datasets={[
                    {
                      label: 'Tasks Completed',
                      data: [42, 38, 45, 50, 54, 59, 62, 68],
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    },
                    {
                      label: 'Hours Worked',
                      data: [160, 165, 163, 162, 158, 156, 155, 153],
                      borderColor: '#f59e0b',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    }
                  ]}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <AnalyticsChart 
                  type="bar"
                  labels={['Team A', 'Team B', 'Team C', 'Team D', 'Team E']}
                  datasets={[
                    {
                      label: 'Efficiency Score',
                      data: [85, 72, 93, 78, 88],
                      backgroundColor: '#10b981',
                    },
                    {
                      label: 'Quality Score',
                      data: [92, 88, 90, 95, 86],
                      backgroundColor: '#8b5cf6',
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsStat 
              title="CPU Usage" 
              value={`${analyticsData.utilizationData.cpu}%`}
              icon={<BarChart3 />}
            />
            <AnalyticsStat 
              title="Memory Usage" 
              value={`${analyticsData.utilizationData.memory}%`}
              icon={<BarChart3 />}
            />
            <AnalyticsStat 
              title="Storage Usage" 
              value={`${analyticsData.utilizationData.storage}%`}
              icon={<BarChart3 />}
            />
            <AnalyticsStat 
              title="Bandwidth Usage" 
              value={`${analyticsData.utilizationData.bandwidth}%`}
              icon={<LineChart />}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AnalyticsChart 
                type="line"
                labels={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']}
                datasets={[
                  {
                    label: 'CPU',
                    data: [35, 42, 67, 78, 82, 75, 63],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  },
                  {
                    label: 'Memory',
                    data: [28, 32, 42, 53, 48, 38, 29],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  },
                  {
                    label: 'Storage',
                    data: [25, 26, 28, 30, 31, 33, 35],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  },
                  {
                    label: 'Bandwidth',
                    data: [15, 25, 55, 85, 78, 65, 35],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  }
                ]}
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation by Project</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <AnalyticsChart 
                  type="bar"
                  labels={['Project A', 'Project B', 'Project C', 'Project D', 'Project E']}
                  datasets={[
                    {
                      label: 'Allocated',
                      data: [65, 45, 38, 72, 53],
                      backgroundColor: '#2563eb',
                    },
                    {
                      label: 'Used',
                      data: [58, 35, 22, 65, 48],
                      backgroundColor: '#10b981',
                    }
                  ]}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <AnalyticsChart 
                  type="doughnut"
                  labels={['API Services', 'Web Services', 'Database', 'Storage', 'Computation']}
                  datasets={[
                    {
                      label: 'Distribution',
                      data: [30, 25, 20, 15, 10],
                      backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6',
                        '#ef4444'
                      ],
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsStat 
              title="Total Users" 
              value="1,429"
              change={8}
              trend="up"
              icon={<UsersRound />}
            />
            <AnalyticsStat 
              title="Active Users" 
              value="964"
              change={12}
              trend="up"
              icon={<UsersRound />}
            />
            <AnalyticsStat 
              title="New Users" 
              value="138"
              change={23}
              trend="up"
              icon={<UsersRound />}
            />
            <AnalyticsStat 
              title="User Satisfaction" 
              value="4.7/5"
              change={5}
              trend="up"
              icon={<PieChart />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <AnalyticsChart 
                  type="line"
                  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                  datasets={[
                    {
                      label: 'Total Users',
                      data: [1000, 1150, 1240, 1310, 1390, 1429],
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    },
                    {
                      label: 'Active Users',
                      data: [820, 862, 890, 912, 940, 964],
                      borderColor: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    }
                  ]}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Activity by Department</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <AnalyticsChart 
                  type="bar"
                  labels={['Engineering', 'Product', 'Marketing', 'Sales', 'Support']}
                  datasets={[
                    {
                      label: 'Active Users',
                      data: [285, 175, 120, 230, 154],
                      backgroundColor: '#2563eb',
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <AnalyticsChart 
                type="bar"
                labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                datasets={[
                  {
                    label: 'Average Session Duration (min)',
                    data: [12.5, 13.2, 15.8, 16.3, 17.1, 18.5],
                    backgroundColor: '#2563eb',
                  },
                  {
                    label: 'Pages Per Session',
                    data: [3.2, 3.5, 4.1, 4.3, 4.8, 5.2],
                    backgroundColor: '#10b981',
                  },
                  {
                    label: 'Actions Per Session',
                    data: [5.8, 6.3, 7.2, 7.8, 8.5, 9.2],
                    backgroundColor: '#f59e0b',
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseAnalyticsDashboard;
