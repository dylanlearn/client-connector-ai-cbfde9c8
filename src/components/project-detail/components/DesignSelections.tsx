import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Grid, Layout, Type, Palette, RefreshCw } from 'lucide-react';

interface DesignSelectionsProps {
  projectId: string;
}

const DesignSelections: React.FC<DesignSelectionsProps> = ({ projectId }) => {
  // This would fetch data from useDesignSelection() hook in a real implementation
  
  return (
    <div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="components">
            <Grid className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Layout className="h-16 w-16 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Hero Layout</h3>
                    <p className="text-sm text-gray-500 mt-1">Split-screen with image</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">Layout</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Grid className="h-16 w-16 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Feature Cards</h3>
                    <p className="text-sm text-gray-500 mt-1">Hover animation style</p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded">Component</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Type className="h-16 w-16 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Typography System</h3>
                    <p className="text-sm text-gray-500 mt-1">Montserrat + Inter</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Typography</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Palette className="h-16 w-16 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Color Palette</h3>
                    <p className="text-sm text-gray-500 mt-1">Blue gradient with accents</p>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">Colors</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Layout className="h-16 w-16 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Hero Layout</h3>
                    <p className="text-sm text-gray-500 mt-1">Split-screen with image</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">Layout</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Other tabs content would go here */}
        <TabsContent value="components" className="mt-6">
          <div className="text-center py-8 text-gray-500">
            <Grid className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-1">No Component Selections Yet</h3>
            <p className="text-sm">Component selections from the Design Picker will appear here.</p>
            <Button variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Go to Design Picker
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="typography" className="mt-6">
          <div className="text-center py-8 text-gray-500">
            <Type className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-1">No Typography Selections Yet</h3>
            <p className="text-sm">Typography selections from the Design Picker will appear here.</p>
            <Button variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Go to Design Picker
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="mt-6">
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-1">No Color Selections Yet</h3>
            <p className="text-sm">Color selections from the Design Picker will appear here.</p>
            <Button variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Go to Design Picker
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignSelections;
