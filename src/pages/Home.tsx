
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, LineChart, ShieldCheck, Users, Cpu, Layers } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState('workspaces');

  return (
    <main className="min-h-screen">
      <Tabs defaultValue="workspaces" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-card border-b p-2">
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="workspaces">
              <Building2 className="mr-2 h-4 w-4" />
              Workspace Management
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="container mx-auto p-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Advanced Wireframing Platform</h1>
            <p className="text-muted-foreground">
              Design, collaborate, and build high-performance wireframes with our advanced tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Cross-Team Collaboration
                </CardTitle>
                <CardDescription>
                  Collaborate in real-time with team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time collaborative editing, annotations, and team coordination tools.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/collaboration-demo">Open Collaboration Demo</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  Canvas Optimization
                </CardTitle>
                <CardDescription>
                  Advanced rendering and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Layer caching, incremental rendering, and hardware acceleration for complex wireframes.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/wireframe-editor">Open Wireframe Editor</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Memory Management
                </CardTitle>
                <CardDescription>
                  Optimize resource usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Object pooling, automatic garbage collection, and resource monitoring.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/collaboration-demo?tab=memory">View Memory Features</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <TabsContent value="workspaces">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Basic Wireframe Editor</CardTitle>
                  <CardDescription>Create simple wireframes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Start with a basic wireframe editor for quick prototypes.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/wireframe-editor">Open Editor</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Advanced Generator</CardTitle>
                  <CardDescription>AI-powered wireframe generation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate complex wireframes with our AI engine.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/advanced-generator">Generate Wireframes</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Component Variants</CardTitle>
                  <CardDescription>Create reusable components</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Design flexible components with multiple variants.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/component-variants">Explore Variants</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Enterprise Analytics</CardTitle>
                  <CardDescription>Comprehensive metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track usage patterns, performance, and collaboration metrics.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/quality-dashboard">View Dashboard</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Performance Testing</CardTitle>
                  <CardDescription>Monitor and optimize wireframe performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Test and analyze wireframe performance across different scenarios.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/wireframe-testing">Run Tests</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Design System</CardTitle>
                  <CardDescription>Maintain design consistency</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ensure all wireframes follow design standards and guidelines.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/design-system">View Design System</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Design Handoff</CardTitle>
                  <CardDescription>Streamline design to development</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate specifications and assets for development teams.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/handoff">Start Handoff</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
