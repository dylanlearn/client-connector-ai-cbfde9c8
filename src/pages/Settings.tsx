
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <Button variant="outline">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings content would go here</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Settings;
