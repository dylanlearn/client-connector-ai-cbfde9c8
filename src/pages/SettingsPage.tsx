
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const SettingsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-muted-foreground mb-6">Manage your account preferences and settings.</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Profile Information</h3>
              <p className="text-muted-foreground">Update your account's profile information.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Password</h3>
              <p className="text-muted-foreground">Ensure your account is using a secure password.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Notifications</h3>
              <p className="text-muted-foreground">Manage your notification preferences.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
