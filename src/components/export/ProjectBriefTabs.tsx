
import { useState, useId } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PDFExportDialog } from "@/components/export/PDFExportDialog";
import { Folder, FileText, Layout, Lightbulb, Image } from "lucide-react";

interface ProjectBriefTabsProps {
  projectName: string;
  copyContent?: React.ReactNode;
  layoutContent?: React.ReactNode;
  strategyContent?: React.ReactNode;
  assetsContent?: React.ReactNode;
}

export function ProjectBriefTabs({
  projectName,
  copyContent,
  layoutContent,
  strategyContent,
  assetsContent
}: ProjectBriefTabsProps) {
  const [activeTab, setActiveTab] = useState("copy");
  const contentId = useId();
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <CardTitle>{projectName} Brief</CardTitle>
          </div>
          <PDFExportDialog 
            contentId={`briefContent-${contentId}`} 
            filename={`${projectName.replace(/\s+/g, '-').toLowerCase()}-brief`}
          />
        </div>
        <CardDescription>
          Complete project brief with all design specifications and assets
        </CardDescription>
      </CardHeader>
      
      <div id={`briefContent-${contentId}`} className="pb-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="copy" className="flex items-center gap-1 text-xs sm:text-sm">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Copy</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-1 text-xs sm:text-sm">
                <Layout className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Layout</span>
              </TabsTrigger>
              <TabsTrigger value="strategy" className="flex items-center gap-1 text-xs sm:text-sm">
                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Strategy</span>
              </TabsTrigger>
              <TabsTrigger value="assets" className="flex items-center gap-1 text-xs sm:text-sm">
                <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Assets</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="copy" className="px-6 py-4">
            <h3 className="text-lg font-semibold mb-3">Website Copy</h3>
            {copyContent || (
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Headline</h4>
                  <p className="text-xl font-bold">Transform Your Digital Presence</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Subheadline</h4>
                  <p>We build stunning websites that convert visitors into customers</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Call to Action</h4>
                  <Button size="sm">Get Started Today</Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="layout" className="px-6 py-4">
            <h3 className="text-lg font-semibold mb-3">Layout Guidelines</h3>
            {layoutContent || (
              <div className="space-y-4">
                <div className="border p-4 rounded-md space-y-2">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Website Structure</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Homepage with hero section and testimonials</li>
                    <li>About page with team information</li>
                    <li>Services with detailed offerings</li>
                    <li>Portfolio showcasing previous work</li>
                    <li>Contact page with form and map</li>
                  </ul>
                </div>
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Navigation</h4>
                  <p>Horizontal top navigation with dropdown menus for mobile</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="strategy" className="px-6 py-4">
            <h3 className="text-lg font-semibold mb-3">Project Strategy</h3>
            {strategyContent || (
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Target Audience</h4>
                  <p>Small to medium businesses looking to establish online presence</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Competitive Advantage</h4>
                  <p>Focus on user experience and conversion optimization</p>
                </div>
                <div className="border p-4 rounded-md space-y-2">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Success Metrics</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Increase conversion rate by 25%</li>
                    <li>Reduce bounce rate by 15%</li>
                    <li>Improve engagement metrics</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="assets" className="px-6 py-4">
            <h3 className="text-lg font-semibold mb-3">Project Assets</h3>
            {assetsContent || (
              <div className="space-y-4">
                <div className="border p-4 rounded-md space-y-2">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Brand Assets</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Logo (SVG and PNG formats)</li>
                    <li>Brand color palette</li>
                    <li>Typography guidelines</li>
                  </ul>
                </div>
                <div className="border p-4 rounded-md space-y-2">
                  <h4 className="font-medium text-sm mb-1 text-gray-500">Images</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Hero banner images</li>
                    <li>Team photos</li>
                    <li>Product images</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <PDFExportDialog 
          contentId={`briefContent-${contentId}`} 
          filename={`${projectName.replace(/\s+/g, '-').toLowerCase()}-brief`}
          trigger={
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Export Brief
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
