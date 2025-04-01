
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, Users, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmptyState from "@/components/dashboard/EmptyState";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/new-project")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <Tabs defaultValue="projects" className="mb-8">
          <TabsList>
            <TabsTrigger value="projects" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center">
              <Users className="mr-2 h-4 w-4" /> Clients
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="clients" className="mt-6">
            <EmptyState 
              title="No clients yet"
              description="Invite clients to collaborate on your projects."
              buttonText="Invite Client"
              buttonAction={() => {}}
              icon={Users}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Upgrade to Sync Pro to access detailed analytics about your projects and clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="font-medium text-lg mb-2">Pro Feature</h3>
                    <p className="text-gray-500 max-w-md mb-4">
                      Gain insights into your design process with advanced analytics.
                    </p>
                    <Button>Upgrade to Pro</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and profile information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings content would go here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Get the most out of DezignSync</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Create a project and generate a client link</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Customize your questionnaire for better results</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Browse templates to speed up your workflow</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upgrade to Sync Pro</CardTitle>
              <CardDescription>Unlock advanced features for your design workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-2">Pro features include:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Unlimited projects</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Advanced AI analysis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Client readiness score</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-indigo-500 text-white rounded-full p-1 mr-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Project analytics</span>
                  </div>
                </div>
                <Button className="mt-4 w-full md:w-auto">Upgrade Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
