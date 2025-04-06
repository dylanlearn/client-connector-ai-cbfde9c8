
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-medium mb-4">Welcome</h2>
          <p>Welcome to your dashboard. Your projects and wireframes will appear here.</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-medium mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Generated Wireframes</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
