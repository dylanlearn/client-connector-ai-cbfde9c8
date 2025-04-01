
import { BarChart3, PieChart, ChevronRight, LayoutGrid, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DesignPreferenceChart from "@/components/analytics/DesignPreferenceChart"; 
import TopRankedDesigns from "@/components/analytics/TopRankedDesigns";
import CategoryDistribution from "@/components/analytics/CategoryDistribution";

const Analytics = () => {
  const hasProData = false; // This would determine if user has access to Pro features

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Design Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <PieChart className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="preferences">Design Preferences</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Design Preference Metrics</CardTitle>
                <CardDescription>
                  Average preference scores across all intakes
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <DesignPreferenceChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Selections</CardTitle>
                <CardDescription>
                  Most frequently selected designs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopRankedDesigns />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  View all rankings
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>
                  Overall preference by design category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <CategoryDistribution />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Selection Timeline</CardTitle>
                <CardDescription>
                  Recent design selection activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasProData ? (
                  <div className="h-64 flex items-center justify-center">
                    {/* Timeline chart would go here */}
                    <p className="text-muted-foreground">Loading timeline data...</p>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center bg-muted/30 rounded-md p-4">
                    <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">Pro Feature</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Unlock detailed timeline analytics with a Pro subscription.
                    </p>
                    <Button>Upgrade to Pro</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Preference Analysis</CardTitle>
              <CardDescription>
                Average rankings and notes from all intakes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasProData ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Detailed preference data...</p>
                </div>
              ) : (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-6">
                  <Star className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Pro Feature</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Upgrade to Pro to access detailed preference analytics 
                    including client notes, rankings, and selection patterns.
                  </p>
                  <Button>Upgrade to Pro</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Design Preference Trends</CardTitle>
              <CardDescription>
                How selections have changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasProData ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Trend data visualization...</p>
                </div>
              ) : (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-6">
                  <LayoutGrid className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Pro Feature</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Upgrade to Pro to access trend analysis showing how design 
                    preferences evolve over time across different projects.
                  </p>
                  <Button>Upgrade to Pro</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Analytics;
