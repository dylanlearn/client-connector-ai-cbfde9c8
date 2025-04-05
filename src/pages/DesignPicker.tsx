
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush, Palette, Layout, CircleSlashed } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DesignPicker = () => {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Design Picker</h1>
          <p className="text-muted-foreground">
            Choose and customize design templates for your projects
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="templates">
              <Layout className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="colors">
              <Palette className="mr-2 h-4 w-4" />
              Color Schemes
            </TabsTrigger>
            <TabsTrigger value="styles">
              <Paintbrush className="mr-2 h-4 w-4" />
              Style Guide
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <CircleSlashed className="h-10 w-10 text-gray-400" />
                  </div>
                  <CardHeader>
                    <CardTitle>Template {index}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      A beautiful design template for your project.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="colors">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {["Vibrant", "Soft", "Natural", "Professional", "Playful", "Modern"].map((scheme) => (
                <Card key={scheme}>
                  <div className="h-24 flex">
                    <div className="flex-1 bg-primary"></div>
                    <div className="flex-1 bg-secondary"></div>
                    <div className="flex-1 bg-accent"></div>
                    <div className="flex-1 bg-muted"></div>
                  </div>
                  <CardHeader>
                    <CardTitle>{scheme}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      A {scheme.toLowerCase()} color scheme for your design.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="styles">
            <Card>
              <CardHeader>
                <CardTitle>Style Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium mb-2">Typography</h3>
                    <div className="space-y-2">
                      <div>
                        <h1 className="text-4xl font-bold">Heading 1</h1>
                        <p className="text-sm text-muted-foreground">4xl / Bold</p>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">Heading 2</h2>
                        <p className="text-sm text-muted-foreground">3xl / Bold</p>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Heading 3</h3>
                        <p className="text-sm text-muted-foreground">2xl / Bold</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium">Heading 4</h4>
                        <p className="text-sm text-muted-foreground">xl / Medium</p>
                      </div>
                      <div>
                        <p className="text-base">Body text</p>
                        <p className="text-sm text-muted-foreground">base / Regular</p>
                      </div>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Spacing</h3>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-100"></div>
                      <div className="h-6 w-full bg-gray-100"></div>
                      <div className="h-8 w-full bg-gray-100"></div>
                      <div className="h-12 w-full bg-gray-100"></div>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DesignPicker;
