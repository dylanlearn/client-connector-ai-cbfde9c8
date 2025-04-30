
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { WireframeEditor } from '@/components/wireframe';
import { WireframeData } from '@/types/wireframe';

const AdvancedWireframeGeneratorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [wireframeData, setWireframeData] = useState<WireframeData>({
    id: uuidv4(),
    title: 'New Wireframe',
    sections: [],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  });

  // Fetch project details when the component mounts
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('title')
          .eq('id', projectId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProjectName(data.title);
        }
      } catch (error: any) {
        console.error('Error fetching project details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectDetails();
  }, [projectId, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{projectName || 'Advanced Wireframe Generator'}</h1>
          <p className="text-muted-foreground mt-1">
            Create and customize wireframes for your project
          </p>
        </div>
      </header>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle>Wireframe Editor</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <WireframeEditor 
            wireframeData={wireframeData}
            viewMode="edit"
            onUpdate={(updatedWireframe) => setWireframeData(updatedWireframe)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedWireframeGeneratorPage;
