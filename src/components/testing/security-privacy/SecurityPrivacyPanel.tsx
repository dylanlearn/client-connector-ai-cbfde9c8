
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SecurityPrivacyService, SecurityPrivacyRequirement, SecurityPrivacyReview } from '@/services/testing/SecurityPrivacyService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';
import SecurityRequirementsList from './SecurityRequirementsList';
import SecurityReviewResults from './SecurityReviewResults';
import SecurityRiskScoreCard from './SecurityRiskScoreCard';

interface SecurityPrivacyPanelProps {
  wireframeId: string;
}

const SecurityPrivacyPanel: React.FC<SecurityPrivacyPanelProps> = ({ wireframeId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requirements, setRequirements] = useState<SecurityPrivacyRequirement[]>([]);
  const [securityReviews, setSecurityReviews] = useState<SecurityPrivacyReview[]>([]);
  const [isRunningReview, setIsRunningReview] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('privacy');

  useEffect(() => {
    loadSecurityData();
  }, [wireframeId]);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      // Load security & privacy requirements
      const requirementsData = await SecurityPrivacyService.getSecurityRequirements();
      setRequirements(requirementsData);
      
      // Load previous security reviews
      const reviewsData = await SecurityPrivacyService.getSecurityReviews(wireframeId);
      setSecurityReviews(reviewsData);
    } catch (error) {
      console.error('Error loading security data:', error);
      toast.error('Failed to load security and privacy data');
    } finally {
      setIsLoading(false);
    }
  };

  const runSecurityReview = async () => {
    setIsRunningReview(true);
    try {
      const result = await SecurityPrivacyService.conductSecurityReview(wireframeId);
      
      // Update the list of reviews with the new one
      setSecurityReviews([result, ...securityReviews]);
      
      toast.success('Security and privacy review completed');
    } catch (error) {
      console.error('Error running security review:', error);
      toast.error('Failed to run security review');
    } finally {
      setIsRunningReview(false);
    }
  };

  // Filter requirements by active tab
  const filteredRequirements = requirements.filter(req => 
    activeTab === 'all' || req.category === activeTab
  );

  // Get the latest review
  const latestReview = securityReviews[0];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security & Privacy Review</h2>
        <Button 
          onClick={runSecurityReview}
          disabled={isRunningReview}
          className="flex items-center gap-2"
        >
          {isRunningReview ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          <span>Run Security Review</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading security and privacy data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                    <span>Requirements</span>
                  </CardTitle>
                  <CardDescription>Security & privacy requirements</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs 
                    defaultValue="privacy" 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    className="px-6 pb-2"
                  >
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="privacy">Privacy</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <SecurityRequirementsList requirements={filteredRequirements} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {latestReview ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>Review Results</CardTitle>
                      <SecurityRiskScoreCard score={latestReview.riskScore || 0} />
                    </div>
                    <CardDescription>
                      Review completed on {new Date(latestReview.completedAt || '').toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SecurityReviewResults review={latestReview} />
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertTitle>No security review results</AlertTitle>
                  <AlertDescription>
                    No security and privacy review has been conducted for this wireframe yet.
                    Run a review to identify potential concerns.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SecurityPrivacyPanel;
