
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/alert-message";

const AccessDeniedView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AlertMessage type="error" title="Access Denied">
          This client hub link is invalid or has expired. Please contact your designer for a new link.
        </AlertMessage>
        <Button 
          onClick={() => navigate('/')}
          className="mx-auto block mt-8"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedView;
