
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CornerDownRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdvancedWireframeGenerator, WireframeVisualizer } from '@/components/wireframe';
import { useProject } from '@/hooks/useProject';

const WireframeGeneratorComponent = () => {
  const navigate = useNavigate();
  const { project } = useProject();
  
  const handleNavigateToWireframe = () => {
    if (project) {
      navigate(`/project/${project.id}/advanced-wireframe`);
    }
  };
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Wireframe Generator</span>
          <Button variant="ghost" size="sm" onClick={handleNavigateToWireframe}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Full Generator
          </Button>
        </CardTitle>
        <CardDescription>Create wireframes based on AI-powered design intelligence</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {project ? (
          <div className="flex flex-col h-full">
            <div className="flex-grow mb-4">
              <AdvancedWireframeGenerator
                projectId={project.id}
                viewMode="edit"
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleNavigateToWireframe}
            >
              <CornerDownRight className="h-4 w-4 mr-2" />
              Full Wireframe Generator
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Select a project to use the wireframe generator</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WireframeGeneratorComponent;
