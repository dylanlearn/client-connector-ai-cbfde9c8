
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AccessDeniedView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This client hub link is invalid or has expired. Please contact your designer for a new link.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => navigate('/')}
          className="mx-auto block"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedView;
