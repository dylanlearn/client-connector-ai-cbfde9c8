
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemMonitoringRecord } from '@/utils/monitoring/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface PerformancePanelProps {
  metrics: SystemMonitoringRecord[] | null;
  isLoading: boolean;
}

export function PerformancePanel({ metrics, isLoading }: PerformancePanelProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>
            </div>
          ) : !metrics || metrics.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <p className="text-gray-400 mb-2">No performance data available</p>
                <p className="text-sm text-gray-400">Check back later for system metrics</p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-lg mb-4">Resource Usage</h3>
              <div className="h-64 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.map(metric => ({
                      ...metric,
                      time: formatTimestamp(metric.timestamp)
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cpu_usage" name="CPU (%)" fill="#8884d8" />
                    <Bar dataKey="memory_usage" name="Memory (%)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <h3 className="font-medium text-lg mb-4">Connection & Error Metrics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.map(metric => ({
                      ...metric,
                      time: formatTimestamp(metric.timestamp)
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active_connections" name="Connections" fill="#ff7300" />
                    <Bar dataKey="error_count" name="Errors" fill="#ff0000" />
                    <Bar dataKey="warning_count" name="Warnings" fill="#ffbb28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
