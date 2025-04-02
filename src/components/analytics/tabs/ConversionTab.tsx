
import { TrendingUp, ArrowRightLeft, Filter, ListFilter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import FunnelVisualization from "@/components/analytics/FunnelVisualization";
import ABTestResults from "@/components/analytics/ABTestResults";
import ConversionInsights from "@/components/analytics/ConversionInsights";

interface ConversionTabProps {
  hasProData: boolean;
}

const ConversionTab = ({ hasProData }: ConversionTabProps) => {
  return (
    <div className="space-y-6">
      {hasProData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey from first interaction to conversion</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[350px]">
                <FunnelVisualization />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Automated analysis of conversion patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ConversionInsights />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>A/B Test Results</CardTitle>
                  <CardDescription>Statistical comparison of design variations</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filter Tests
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ABTestResults />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <TrendingUp className="h-12 w-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-2">Pro Feature: Conversion Analytics</h3>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Unlock powerful conversion tracking, A/B testing capabilities, and AI-powered 
              insights to optimize your design's performance.
            </p>
            <Button size="lg">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversionTab;
