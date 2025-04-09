
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDesignProcess } from '@/contexts/design-process/DesignProcessProvider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DesignProcessStatus from '@/components/design-process/DesignProcessStatus';
import ClientDesignIntake from '@/components/design-process/ClientDesignIntake';
import DesignBriefGenerator from '@/components/design-process/DesignBriefGenerator';
import EnhancedWireframeStudio from '@/components/wireframe/EnhancedWireframeStudio';
import { v4 as uuidv4 } from 'uuid';

const DesignProcessPage: React.FC = () => {
  const { currentStage, resetProcess } = useDesignProcess();
  const navigate = useNavigate();
  
  // Generate a consistent project ID for this design process
  const designProcessProjectId = React.useMemo(() => {
    const storedId = localStorage.getItem('designProcessProjectId');
    if (storedId) return storedId;
    
    const newId = uuidv4();
    localStorage.setItem('designProcessProjectId', newId);
    return newId;
  }, []);
  
  const renderStageContent = () => {
    switch (currentStage) {
      case 'intake':
        return <ClientDesignIntake />;
      case 'analysis':
        return <DesignBriefGenerator />;
      case 'wireframe':
        return <EnhancedWireframeStudio projectId={designProcessProjectId} />;
      case 'moodboard':
        // This would be implemented in a real application
        return (
          <div className="flex items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <h2 className="text-xl font-semibold mb-4">Visual Direction</h2>
              <p className="text-gray-500">
                The moodboard feature is coming soon. It will allow you to explore visual styles and design elements.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <h2 className="text-xl font-semibold mb-4">This stage is coming soon</h2>
              <p className="text-gray-500">
                We're still building this part of the design process. Stay tuned for updates!
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">AI-Assisted Design Process</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetProcess}
              className="flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Process
            </Button>
          </div>
          
          <DesignProcessStatus />
          
          {renderStageContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignProcessPage;
