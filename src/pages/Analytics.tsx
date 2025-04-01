
import { BarChart3, PieChart, ChevronRight, LayoutGrid, Star, Zap, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DesignPreferenceChart from "@/components/analytics/DesignPreferenceChart"; 
import TopRankedDesigns from "@/components/analytics/TopRankedDesigns";
import CategoryDistribution from "@/components/analytics/CategoryDistribution";
import ShareAnalyticsLink from "@/components/analytics/ShareAnalyticsLink";
import { useAnalytics } from "@/hooks/use-analytics";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { useDesignSelection } from "@/hooks/use-design-selection";

const Analytics = () => {
  const hasProData = false; // This would determine if user has access to Pro features
  const { analytics, userPreferences, isLoading, isRealtime } = useAnalytics();
  const { user } = useAuth();
  const { clientAccessMode, viewOnlyMode } = useDesignSelection({});

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Design Analytics</h1>
          {isRealtime && (
            <div className="flex items-center ml-4 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              <Zap className="w-4 h-4 text-green-500 mr-1" />
              Live Data
            </div>
          )}
          {clientAccessMode && (
            <div className="flex items-center ml-4 text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded">
              <Share2 className="w-4 h-4 mr-1" />
              Client View Mode
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!viewOnlyMode && <ShareAnalyticsLink />}
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
              <CardTitle>Your Design Preferences</CardTitle>
              <CardDescription>
                Your rankings and selections from all intakes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userPreferences && userPreferences.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Design</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userPreferences.map((pref) => (
                      <TableRow key={pref.id}>
                        <TableCell className="font-medium">{pref.title}</TableCell>
                        <TableCell className="capitalize">{pref.category}</TableCell>
                        <TableCell>
                          {pref.rank ? (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                              <span>{pref.rank}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not ranked</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {pref.notes || <span className="text-muted-foreground">No notes</span>}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(pref.updated_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-6">
                  <Star className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Preferences Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    You haven't selected any design preferences yet. Go to the Design Picker
                    to start selecting and ranking your favorite designs.
                  </p>
                  <Button>Go to Design Picker</Button>
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
