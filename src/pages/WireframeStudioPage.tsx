
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/hooks/useProject';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnhancedWireframeStudio from '@/components/wireframe/EnhancedWireframeStudio';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';

const WireframeStudioPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading } = useProject();
  const { toast } = useToast();
  const [promptValue, setPromptValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate a default project ID if none is provided
  const effectiveProjectId = projectId || uuidv4();
  
  const {
    isGenerating,
    generateWireframe,
    currentWireframe
  } = useWireframeGeneration();

  // Handle prompt submission
  const handleGenerateWireframe = async () => {
    if (!promptValue.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your wireframe.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Generate wireframe using the prompt
      await generateWireframe({
        description: promptValue,
        projectId: effectiveProjectId
      });
      
      toast({
        title: "Wireframe generated",
        description: "Your wireframe has been created successfully."
      });
      
      // Collapse the prompt panel after generation
      setIsExpanded(false);
    } catch (error) {
      console.error("Error generating wireframe:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate wireframe. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Wireframe Studio</h1>
              <p className="text-muted-foreground mt-1">
                {project ? `Project: ${project.name}` : 'Create and customize wireframes'}
              </p>
            </div>
            
            {/* AI Generation Button */}
            <Button 
              variant={isExpanded ? "secondary" : "default"}
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {isExpanded ? "Cancel" : "Generate with AI"}
            </Button>
          </div>
          
          {/* AI Prompt Panel */}
          {isExpanded && (
            <Card className="mt-4 mb-6">
              <CardContent className="pt-6">
                <Textarea
                  placeholder="Describe the wireframe you want to create, e.g., 'A modern landing page for a fitness app with a hero section, features grid, testimonials, and pricing plans.'"
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                <Button variant="outline" onClick={() => setIsExpanded(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateWireframe}
                  disabled={isGenerating || !promptValue.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>Generate Wireframe</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div className="bg-card rounded-lg shadow">
          <EnhancedWireframeStudio 
            projectId={effectiveProjectId} 
            standalone={true}
            initialData={currentWireframe?.wireframe}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WireframeStudioPage;
