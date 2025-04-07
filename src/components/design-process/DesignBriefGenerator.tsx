
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDesignProcess } from '@/contexts/design-process/DesignProcessProvider';
import { ArrowRight, FileText } from 'lucide-react';

const DesignBriefGenerator = () => {
  const { intakeData, designBrief, generateWireframe } = useDesignProcess();
  
  if (!intakeData) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">
            Please complete the client intake form first.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Design Brief
        </CardTitle>
        <CardDescription>
          AI-generated design brief based on client requirements
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {designBrief ? (
          <>
            <div>
              <h3 className="text-lg font-medium mb-2">Project Overview</h3>
              <div className="p-4 rounded-md bg-muted">
                <p className="text-sm">{intakeData.projectDescription}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Design Direction</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Site Type:</span>
                    <span className="font-medium">{intakeData.siteType}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Design Style:</span>
                    <span className="font-medium">{intakeData.designStyle || 'Not specified'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Key Features:</span>
                    <span className="font-medium">{intakeData.mainFeatures || 'Not specified'}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Audience Insights</h3>
                <div className="p-4 rounded-md bg-muted">
                  <p className="text-sm">{intakeData.targetAudience}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Design brief is being generated...
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {designBrief && (
          <Button onClick={generateWireframe} className="gap-2">
            Proceed to Wireframing
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DesignBriefGenerator;
