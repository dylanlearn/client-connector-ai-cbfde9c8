
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileQuerySetupAlertProps {
  onSetupClick: () => void;
}

const ProfileQuerySetupAlert: React.FC<ProfileQuerySetupAlertProps> = ({ onSetupClick }) => {
  return (
    <Alert className="bg-amber-50 dark:bg-amber-950/30">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-300">
        Query monitoring setup required
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-400">
        <p className="mb-4">
          The pg_stat_statements extension needs to be configured to monitor query performance.
        </p>
        <Button 
          variant="outline" 
          className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800"
          onClick={onSetupClick}
        >
          Run Setup Script
        </Button>
        <p className="mt-4 text-xs opacity-80">
          This will create the extension if not already enabled and set up the necessary monitoring configurations.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileQuerySetupAlert;
