'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, LineChart, PieChart, 
  BarChart3, ArrowUpRight, Users, Clock, 
  Database, Calendar, ChevronsUpDown 
} from "lucide-react";
import { AnalyticsStat } from "./AnalyticsStat";
import { AnalyticsChart } from "./AnalyticsChart";
import { ResourceUtilizationChart } from "./ResourceUtilizationChart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dataset, MetricsSummary, ProductivityMetric, ResourceUtilization } from "@/types/analytics";
import { format } from 'date-fns';

const sampleTeamData = [
  { name: 'Design', value: 30, color: '#ee682b' },
  { name: 'Engineering', value: 40, color: '#8439e9' },
  { name: 'Marketing', value: 20, color: '#6142e7' },
  { name: 'Sales', value: 10, color: '#af5cf7' },
];

const sampleResourceData = [
  { name: 'Project A', design: 25, engineering: 35, marketing: 20, sales: 20 },
  { name: 'Project B', design: 30, engineering: 30, marketing: 25, sales: 15 },
  { name: 'Project C', design: 20, engineering: 40, marketing: 15, sales: 25 },
];

const samplePerformanceData = {
  totalTasks: 120,
  completedTasks: 95,
  averageCompletionTime: 3.5,
  customerSatisfaction: 4.2,
};

const sampleEngagementData = {
  activeUsers: 520,
  averageSessionDuration: 15.2,
  bounceRate: 0.45,
  conversionRate: 0.12,
};

const sampleFinancialData = {
  revenue: 500000,
  expenses: 350000,
  profitMargin: 0.30,
  customerAcquisitionCost: 150,
};

export const EnterpriseAnalyticsDashboard = () => {
  const [timePeriod, setTimePeriod] = useState('last_30_days');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('all');
  const { isLoading, fetchAnalytics } = useAnalyticsAPI();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAnalytics(timePeriod);
      setDashboardData(data);
    };

    fetchData();
  }, [timePeriod, fetchAnalytics]);

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    setIsCustomDateRange(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
  };

  const handleDateRangeSelect = (range: { from?: Date; to?: Date; }) => {
    setDateRange(range);
    setIsCustomDateRange(true);
  };

  const applyCustomDateRange = async () => {
    if (dateRange.from && dateRange.to) {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      console.log(`Fetching data from ${startDate} to ${endDate}`);
      setTimePeriod('custom_range');
      const data = await fetchAnalytics('custom_range');
      setDashboardData(data);
    }
  };

  const teamDistribution = sampleTeamData.map(team => team.value);
  const teamColors = sampleTeamData.map(team => team.color);
  const resourceData = sampleResourceData.map(resource => ({
    name: resource.name,
    design: resource.design,
    engineering: resource.engineering,
    marketing: resource.marketing,
    sales: resource.sales,
  }));
  const resourceColors = ['#ee682b', '#8439e9', '#6142e7', '#af5cf7'];

  return (
    <div className="container py-8">
      {/* Dashboard header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Analytics</h1>
          <p className="text-muted-foreground">
            Metrics and insights across your organization
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <DateRangePicker 
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={(range) => {
              if (range.from && range.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
          />
          
          <div className="flex items-center">
            <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workspaces</SelectItem>
                <SelectItem value="workspace-1">Main Workspace</SelectItem>
                <SelectItem value="workspace-2">Design Team</SelectItem>
                <SelectItem value="workspace-3">Development</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-2" size="icon">
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Team Performance</h2>
        <div className="space-x-2">
          <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
              <SelectItem value="custom_range">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {timePeriod === 'custom_range' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={date}
                  selected={dateRange}
                  onSelect={handleDateRangeSelect}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2020-01-01")
                  }
                  initialFocus
                />
                <div className="p-4">
                  <Button size="sm" className="w-full" onClick={applyCustomDateRange}>
                    Apply Date Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Distribution</CardTitle>
            <CardDescription>
              Distribution of employees across different teams.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              type="doughnut"
              labels={sampleTeamData.map(team => team.name)}
              datasets={[{
                label: 'Distribution',
                data: teamDistribution,
                backgroundColor: teamColors
              }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>
              Allocation of resources across different projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResourceUtilizationChart resources={resourceData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators for project completion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnalyticsStat
              title="Total Tasks"
              value={samplePerformanceData.totalTasks.toLocaleString()}
            />
            <AnalyticsStat
              title="Completed Tasks"
              value={samplePerformanceData.completedTasks.toLocaleString()}
              change={80}
              trend="up"
            />
            <AnalyticsStat
              title="Average Completion Time"
              value={`${samplePerformanceData.averageCompletionTime.toFixed(1)} days`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>
              Metrics related to user engagement and interaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnalyticsStat
              title="Active Users"
              value={sampleEngagementData.activeUsers.toLocaleString()}
            />
            <AnalyticsStat
              title="Average Session Duration"
              value={`${sampleEngagementData.averageSessionDuration.toFixed(1)} mins`}
            />
            <AnalyticsStat
              title="Bounce Rate"
              value={`${(sampleEngagementData.bounceRate * 100).toFixed(0)}%`}
              change={5}
              trend="down"
              invertTrend
            />
            <AnalyticsStat
              title="Conversion Rate"
              value={`${(sampleEngagementData.conversionRate * 100).toFixed(0)}%`}
              change={2}
              trend="up"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics</CardTitle>
            <CardDescription>
              Financial performance indicators for the organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnalyticsStat
              title="Revenue"
              value={`$${sampleFinancialData.revenue.toLocaleString()}`}
            />
            <AnalyticsStat
              title="Expenses"
              value={`$${sampleFinancialData.expenses.toLocaleString()}`}
            />
            <AnalyticsStat
              title="Profit Margin"
              value={`${(sampleFinancialData.profitMargin * 100).toFixed(0)}%`}
            />
            <AnalyticsStat
              title="Customer Acquisition Cost"
              value={`$${sampleFinancialData.customerAcquisitionCost.toLocaleString()}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseAnalyticsDashboard;
