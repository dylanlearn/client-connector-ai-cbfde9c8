
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Recent Projects</h2>
            <p className="text-muted-foreground">Your recently accessed projects will appear here.</p>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground">Design analytics and insights will appear here.</p>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Actions</h2>
            <p className="text-muted-foreground">Quick actions and tools will appear here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
