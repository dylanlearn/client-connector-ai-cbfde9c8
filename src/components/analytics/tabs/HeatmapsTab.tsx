
import { Eye, MousePointer, CursorClick, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/use-analytics";
import HeatmapDisplay from "@/components/analytics/HeatmapDisplay";
import InteractionMetrics from "@/components/analytics/InteractionMetrics";
import AttractionPoints from "@/components/analytics/AttractionPoints";

interface HeatmapsTabProps {
  hasProData: boolean;
}

const HeatmapsTab = ({ hasProData }: HeatmapsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Interaction Analysis</h2>
        <Tabs defaultValue="clicks" className="w-auto">
          <TabsList>
            <TabsTrigger value="clicks">
              <CursorClick className="h-4 w-4 mr-2" />
              Clicks
            </TabsTrigger>
            <TabsTrigger value="movement">
              <MousePointer className="h-4 w-4 mr-2" />
              Movement
            </TabsTrigger>
            <TabsTrigger value="attention">
              <Eye className="h-4 w-4 mr-2" />
              Attention
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {hasProData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Interaction Heatmap</CardTitle>
              <CardDescription>Visual representation of user interactions</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              <HeatmapDisplay />
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Interaction statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <InteractionMetrics />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attraction Points</CardTitle>
                <CardDescription>Elements drawing most attention</CardDescription>
              </CardHeader>
              <CardContent>
                <AttractionPoints />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <Award className="h-12 w-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-2">Pro Feature: Interaction Heatmaps</h3>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Visualize exactly how users interact with your designs, identify attention hotspots, 
              and gain AI-powered insights on user behavior patterns.
            </p>
            <Button size="lg">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeatmapsTab;
