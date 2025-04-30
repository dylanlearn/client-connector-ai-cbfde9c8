
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PerformanceMonitoringDashboard from '@/components/performance/PerformanceMonitoringDashboard';
import DashboardLayout from '@/components/layout/DashboardLayout';

const PerformanceMonitoringPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Performance Monitoring</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Monitor wireframe rendering performance, memory usage, and interaction responsiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceMonitoringDashboard />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PerformanceMonitoringPage;
