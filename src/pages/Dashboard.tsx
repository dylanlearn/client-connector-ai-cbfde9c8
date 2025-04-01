import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, Users, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/dashboard/EmptyState";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardLayout from "@/components/layout/DashboardLayout";

const LAST_TAB_KEY = "lastDashboardTab";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(LAST_TAB_KEY) || "overview";
  });

  useEffect(() => {
    localStorage.setItem(LAST_TAB_KEY, activeTab);
  }, [activeTab]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate("/new-project")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>New Project</span>
        </Button>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className={isMobile ? "px-4 py-4" : ""}>
                <CardTitle className={isMobile ? "text-lg" : ""}>Quick Stats</CardTitle>
                <CardDescription className={isMobile ? "text-sm" : ""}>Your activity summary</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "px-4 pt-0 pb-4" : ""}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Active Projects</span>
                    <span className="text-lg font-semibold">{projects.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Clients</span>
                    <span className="text-lg font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="text-lg font-semibold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
              
            <Card className="md:col-span-2">
              <CardHeader className={isMobile ? "px-4 py-4" : ""}>
                <CardTitle className={isMobile ? "text-lg" : ""}>Upgrade to Sync Pro</CardTitle>
                <CardDescription className={isMobile ? "text-sm" : ""}>Unlock advanced features for your design workflow</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "px-4 pt-0 pb-4" : ""}>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-lg">
                  <h3 className="font-bold text-base md:text-lg mb-2">Pro features include:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <div className="flex items-center">
                      <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={isMobile ? "text-sm" : ""}>Unlimited projects</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={isMobile ? "text-sm" : ""}>Advanced AI analysis</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={isMobile ? "text-sm" : ""}>Client readiness score</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={isMobile ? "text-sm" : ""}>Project analytics</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full md:w-auto text-sm">Upgrade Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Create or continue working on your design projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <EmptyState 
                    title="No projects yet"
                    description="Create your first project to get started with DezignSync."
                    buttonText="Create Project"
                    buttonAction={() => navigate("/new-project")}
                    icon={FileText}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Project cards would go here */}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Your Statistics</CardTitle>
              <CardDescription>
                Overview of your activity and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState 
                title="No statistics yet"
                description="Complete your first project to see statistics."
                buttonText="Create Project"
                buttonAction={() => navigate("/new-project")}
                icon={BarChart3}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Get the most out of DezignSync</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={isMobile ? "text-sm" : ""}>Create a project and generate a client link</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={isMobile ? "text-sm" : ""}>Customize your questionnaire for better results</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={isMobile ? "text-sm" : ""}>Browse templates to speed up your workflow</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
