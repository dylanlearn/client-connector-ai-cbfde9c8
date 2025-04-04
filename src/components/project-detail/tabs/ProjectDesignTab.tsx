
import React, { useState } from 'react';
import { Grid, Palette, Layers, Lightbulb } from 'lucide-react';
import { Project } from '@/types/project';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import WireframeGallery from '../components/WireframeGallery';
import MoodBoard from '../components/MoodBoard';
import DesignSelections from '../components/DesignSelections';

interface ProjectDesignTabProps {
  project: Project;
}

const ProjectDesignTab: React.FC<ProjectDesignTabProps> = ({ project }) => {
  const [designTab, setDesignTab] = useState('wireframes');
  
  return (
    <div>
      <Tabs defaultValue="wireframes" value={designTab} onValueChange={setDesignTab} className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-3">
          <TabsTrigger value="wireframes">
            <Layers className="h-4 w-4 mr-2" />
            Wireframes
          </TabsTrigger>
          <TabsTrigger value="moodboard">
            <Palette className="h-4 w-4 mr-2" />
            Mood Board
          </TabsTrigger>
          <TabsTrigger value="selections">
            <Grid className="h-4 w-4 mr-2" />
            Design Selections
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wireframes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Wireframes</CardTitle>
            </CardHeader>
            <CardContent>
              <WireframeGallery projectId={project.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="moodboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Mood Board</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodBoard projectId={project.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="selections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Design Selections</CardTitle>
            </CardHeader>
            <CardContent>
              <DesignSelections projectId={project.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              AI Design Suggestions
            </div>
          </CardTitle>
          <Button size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Clean UI Elements</h3>
                <p className="text-sm text-gray-600">
                  Consider using flat UI elements with subtle shadows for a clean, modern look.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Color Palette Refinement</h3>
                <p className="text-sm text-gray-600">
                  The blue shade could be slightly darker to improve contrast with white text.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Typography Hierarchy</h3>
                <p className="text-sm text-gray-600">
                  Create more distinct visual hierarchy between headers and subheaders.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDesignTab;
