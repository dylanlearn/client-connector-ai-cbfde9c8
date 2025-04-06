
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const Settings: React.FC = () => {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button variant="outline">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-medium mb-4">Account Settings</h2>
        <p className="text-muted-foreground">Configure your account settings and preferences.</p>
      </div>
    </div>
  );
};
