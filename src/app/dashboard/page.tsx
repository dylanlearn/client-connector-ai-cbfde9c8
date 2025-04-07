import React from 'react';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { SystemOptimization } from '@/components/dashboard/SystemOptimization';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">System Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemStatus />
        <SystemOptimization />
        
        {/* Other dashboard components would go here */}
      </div>
    </div>
  );
}
