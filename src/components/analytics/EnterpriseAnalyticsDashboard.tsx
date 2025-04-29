
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, LineChart, PieChart, Users, Calendar, Activity, 
  Clock, TrendingUp, AlertTriangle, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnterpriseAnalyticsService } from "@/services/analytics/EnterpriseAnalyticsService";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";
import { Workspace, WorkspaceTeam } from "@/types/workspace";
import { 
  AnalyticsDashboard, 
  AnalyticsWidget, 
  MetricsSummary 
} from "@/types/analytics";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsStat } from "./AnalyticsStat";
import { AnalyticsChart } from "./AnalyticsChart";
import { ResourceUtilizationChart } from "./ResourceUtilizationChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function EnterpriseAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [dashboards, setDashboards] = useState<AnalyticsDashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<AnalyticsDashboard | null>(null);
  const [widgets, setWidgets] = useState<AnalyticsWidget[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [projectMetrics, setProjectMetrics] = useState<Record<string, MetricsSummary>>({});
  
  useEffect(() => {
    loadWorkspaces();
  }, []);
  
  useEffect(() => {
    if (selectedWorkspace) {
      loadDashboards(selectedWorkspace.id);
    }
  }, [selectedWorkspace]);
  
  useEffect(() => {
    if (selectedDashboard) {
      loadWidgets(selectedDashboard.id);
      loadProjectMetrics(selectedDashboard.workspace_id);
    }
  }, [selectedDashboard, dateRange]);
  
  const loadWorkspaces = async () => {
    setLoading(true);
    const result = await WorkspaceService.getUserWorkspaces();
    setWorkspaces(result);
    
    if (result.length > 0) {
      setSelectedWorkspace(result[0]);
    } else {
      setLoading(false);
      toast.error("No workspaces found. Please create a workspace first.");
    }
  };
  
  const loadDashboards = async (workspaceId: string) => {
    setLoading(true);
    const result = await EnterpriseAnalyticsService.getDashboards(workspaceId);
    setDashboards(result);
    
    // Select default dashboard
    const defaultDashboard = result.find(d => d.is_default) || result[0];
    if (defaultDashboard) {
      setSelectedDashboard(defaultDashboard);
    } else {
      setLoading(false);
    }
  };
  
  const loadWidgets = async (dashboardId: string) => {
    try {
      const result = await EnterpriseAnalyticsService.getDashboardWidgets(dashboardId);
      setWidgets(result);
    } catch (error) {
      console.error("Error loading widgets:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadProjectMetrics = async (workspaceId: string) => {
    try {
      const metrics = await EnterpriseAnalyticsService.getProjectStatusMetrics(workspaceId);
      setProjectMetrics(metrics);
    } catch (error) {
      console.error("Error loading project metrics:", error);
    }
  };
  
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };
  
  const handleWorkspaceChange = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setSelectedWorkspace(workspace);
    }
  };
  
  const handleDashboardChange = (dashboardId: string) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      setSelectedDashboard(dashboard);
    }
  };
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Analytics</h1>
          <p className="text-muted-foreground">
            Monitor performance metrics, resource utilization, and project status
          </p>
        </div>
        <div className="flex gap-4">
          <DateRangePicker 
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={handleDateRangeChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-6">
          <Select value={selectedWorkspace?.id} onValueChange={handleWorkspaceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map(workspace => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-6">
          <Select 
            value={selectedDashboard?.id} 
            onValueChange={handleDashboardChange}
            disabled={!selectedWorkspace || dashboards.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dashboard" />
            </SelectTrigger>
            <SelectContent>
              {dashboards.map(dashboard => (
                <SelectItem key={dashboard.id} value={dashboard.id}>
                  {dashboard.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-6">
          {/* Skeleton for stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-16 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Skeleton for charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array(2).fill(0).map((_, i) => (
              <Card key={i} className="h-[350px]">
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="h-[280px]">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Project status metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsStat
              title="Active Projects"
              value={projectMetrics.active?.total || 0}
              change={projectMetrics.active?.change}
              trend={projectMetrics.active?.trend}
              icon={<Activity className="h-4 w-4" />}
            />
            
            <AnalyticsStat
              title="Completed Projects"
              value={projectMetrics.completed?.total || 0}
              change={projectMetrics.completed?.change}
              trend={projectMetrics.completed?.trend}
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            
            <AnalyticsStat
              title="Delayed Projects"
              value={projectMetrics.delayed?.total || 0}
              change={projectMetrics.delayed?.change}
              trend={projectMetrics.delayed?.trend === 'down' ? 'up' : 'down'} // Inverted for delays
              icon={<AlertTriangle className="h-4 w-4" />}
              invertTrend
            />
            
            <AnalyticsStat
              title="Team Productivity"
              value="82%"
              change={4}
              trend="up"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
          
          {/* Main dashboard content */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="productivity">
                <Activity className="mr-2 h-4 w-4" />
                Productivity
              </TabsTrigger>
              <TabsTrigger value="resources">
                <Users className="mr-2 h-4 w-4" />
                Resource Utilization
              </TabsTrigger>
              <TabsTrigger value="timeTracking">
                <Clock className="mr-2 h-4 w-4" />
                Time Tracking
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Wireframe Generation</CardTitle>
                    <CardDescription>
                      Wireframe generation metrics over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart 
                      type="bar" 
                      labels={["Week 1", "Week 2", "Week 3", "Week 4"]}
                      datasets={[
                        {
                          label: "Generated",
                          data: [65, 72, 86, 91],
                          backgroundColor: "rgba(32, 113, 173, 0.5)"
                        },
                        {
                          label: "Completed",
                          data: [54, 67, 76, 85],
                          backgroundColor: "rgba(46, 204, 113, 0.5)"
                        }
                      ]}
                      height={300}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Project Status Distribution</CardTitle>
                    <CardDescription>
                      Current status breakdown of all projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart
                      type="pie"
                      labels={["Active", "Completed", "Delayed", "On Hold"]}
                      datasets={[
                        {
                          data: [15, 32, 3, 5],
                          backgroundColor: [
                            "rgba(54, 162, 235, 0.5)",
                            "rgba(75, 192, 192, 0.5)",
                            "rgba(255, 99, 132, 0.5)",
                            "rgba(255, 206, 86, 0.5)"
                          ]
                        }
                      ]}
                      height={300}
                    />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Team Performance Metrics</CardTitle>
                    <CardDescription>
                      Performance comparison across teams
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart
                      type="bar"
                      labels={["Design Team", "Development Team", "QA Team", "Product Team"]}
                      datasets={[
                        {
                          label: "Productivity Score",
                          data: [85, 78, 90, 82],
                          backgroundColor: "rgba(54, 162, 235, 0.5)"
                        },
                        {
                          label: "Delivery Rate",
                          data: [92, 83, 87, 75],
                          backgroundColor: "rgba(75, 192, 192, 0.5)"
                        },
                        {
                          label: "Quality Score",
                          data: [79, 81, 94, 88],
                          backgroundColor: "rgba(255, 159, 64, 0.5)"
                        }
                      ]}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="productivity" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Productivity Trends</CardTitle>
                    <CardDescription>
                      Team productivity over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart
                      type="line"
                      labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
                      datasets={[
                        {
                          label: "Design Team",
                          data: [75, 78, 76, 79, 85, 87],
                          borderColor: "rgb(54, 162, 235)"
                        },
                        {
                          label: "Development Team",
                          data: [68, 72, 75, 80, 82, 78],
                          borderColor: "rgb(255, 99, 132)"
                        }
                      ]}
                      height={300}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Contributors</CardTitle>
                    <CardDescription>
                      Based on wireframe output and quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {[
                        { name: "Alice Smith", email: "alice@example.com", score: 95, position: "Design Lead" },
                        { name: "Bob Johnson", email: "bob@example.com", score: 91, position: "UX Designer" },
                        { name: "Carol Williams", email: "carol@example.com", score: 87, position: "Product Manager" },
                        { name: "Dave Brown", email: "dave@example.com", score: 85, position: "UI Designer" },
                        { name: "Eve Davis", email: "eve@example.com", score: 82, position: "UX Researcher" }
                      ].map((user, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{i + 1}</Badge>
                            <Avatar>
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.position}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{user.score}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Allocation</CardTitle>
                    <CardDescription>
                      Current resource allocation across projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResourceUtilizationChart
                      resources={[
                        { name: "Project A", design: 40, development: 30, qa: 20, management: 10 },
                        { name: "Project B", design: 25, development: 45, qa: 15, management: 15 },
                        { name: "Project C", design: 35, development: 25, qa: 30, management: 10 }
                      ]}
                      height={300}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Team Capacity</CardTitle>
                    <CardDescription>
                      Current workload vs. capacity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart
                      type="bar"
                      labels={["Design Team", "Development Team", "QA Team", "Product Team"]}
                      datasets={[
                        {
                          label: "Current Workload",
                          data: [85, 90, 65, 75],
                          backgroundColor: "rgba(54, 162, 235, 0.5)"
                        },
                        {
                          label: "Capacity",
                          data: [100, 100, 100, 100],
                          backgroundColor: "rgba(255, 99, 132, 0.2)",
                          type: "line"
                        }
                      ]}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="timeTracking" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Time Spent by Project</CardTitle>
                    <CardDescription>
                      Distribution of time across projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart
                      type="pie"
                      labels={["Project A", "Project B", "Project C", "Project D", "Other"]}
                      datasets={[
                        {
                          data: [35, 25, 20, 15, 5],
                          backgroundColor: [
                            "rgba(54, 162, 235, 0.5)",
                            "rgba(255, 99, 132, 0.5)",
                            "rgba(75, 192, 192, 0.5)",
                            "rgba(255, 206, 86, 0.5)",
                            "rgba(153, 102, 255, 0.5)"
                          ]
                        }
                      ]}
                      height={300}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Time by Activity Type</CardTitle>
                    <CardDescription>
                      Distribution of time across activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsChart
                      type="bar"
                      labels={["Design", "Development", "Meetings", "Documentation", "Testing"]}
                      datasets={[
                        {
                          label: "Hours",
                          data: [42, 85, 38, 25, 45],
                          backgroundColor: "rgba(75, 192, 192, 0.5)"
                        }
                      ]}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
