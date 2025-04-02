
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const RoleManagementGuide = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>User Role Management Guide</CardTitle>
        <CardDescription>How to change user roles in your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          As an admin, you can change user roles through the Admin Panel. Here's how:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to the <strong>Admin Panel</strong> by clicking on your profile and selecting "Admin Panel"</li>
          <li>Go to the <strong>User Management</strong> tab</li>
          <li>Find the user whose role you want to change in the user list</li>
          <li>Use the role dropdown menu to select a new role</li>
          <li>The change will be applied immediately</li>
        </ol>
        
        <Alert className="mt-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Available Roles</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              <li><strong>Free:</strong> Basic access to the platform without paid features</li>
              <li><strong>Sync:</strong> Standard tier with core features</li>
              <li><strong>Sync Pro:</strong> Full access to all premium features</li>
              <li><strong>Trial:</strong> Temporary access to premium features</li>
              <li><strong>Template Buyer:</strong> Access to purchased templates</li>
              <li><strong>Admin:</strong> Complete administrative access to all features and settings</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default RoleManagementGuide;
