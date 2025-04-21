
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useAnalyticsAPI } from '@/hooks/analytics/use-analytics-api';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const mockData = [
  { name: 'Jan', users: 400, sessions: 240, interactions: 1240 },
  { name: 'Feb', users: 300, sessions: 139, interactions: 980 },
  { name: 'Mar', users: 200, sessions: 980, interactions: 1600 },
  { name: 'Apr', users: 278, sessions: 390, interactions: 1700 },
  { name: 'May', users: 189, sessions: 480, interactions: 1200 },
  { name: 'Jun', users: 239, sessions: 380, interactions: 1400 },
  { name: 'Jul', users: 349, sessions: 430, interactions: 1800 },
];

const usageData = [
  { name: 'Dashboard', usage: 340 },
  { name: 'Wireframes', usage: 230 },
  { name: 'Projects', usage: 280 },
  { name: 'Analytics', usage: 190 },
  { name: 'Settings', usage: 90 },
  { name: 'AI Features', usage: 320 },
];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('month');
  const { fetchAnalytics, isLoading } = useAnalyticsAPI();
  const [analyticsData, setAnalyticsData] = useState(mockData);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalytics(period);
        if (data) {
          setAnalyticsData(data);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
    
    // Use mock data for now, but the function is ready for real data
    // loadData();
  }, [period, fetchAnalytics]);
  
  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Analytics</h1>
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">System Performance & Usage</h2>
            <p className="text-sm text-muted-foreground">Comprehensive analytics on application performance and user behavior</p>
          </div>
          <div className="flex gap-2">
            <select 
              className="border rounded-md p-2 text-sm"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>Active users across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,246</div>
                  <div className="text-xs text-green-600">+12% from last month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>API Calls</CardTitle>
                  <CardDescription>Total API requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">43.8k</div>
                  <div className="text-xs text-green-600">+5% from last month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Storage Usage</CardTitle>
                  <CardDescription>Current storage utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">128 GB</div>
                  <div className="text-xs text-amber-600">+26% from last month</div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" />
                      <Line type="monotone" dataKey="sessions" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="interactions" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-80">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" />
                        <Line type="monotone" dataKey="sessions" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
