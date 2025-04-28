
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlatformConfigurations } from './PlatformConfigurations';
import { PlatformTransformers } from './PlatformTransformers';
import { GeneratedOutputs } from './GeneratedOutputs';
import { PlatformOutputService } from '@/services/platform-output/platform-output-service';
import type { PlatformConfiguration } from '@/types/platform-output';

interface PlatformOutputManagerProps {
  wireframeId?: string;
  projectId: string;
}

export function PlatformOutputManager({ wireframeId, projectId }: PlatformOutputManagerProps) {
  const [activeTab, setActiveTab] = useState('platforms');
  const [platforms, setPlatforms] = useState<PlatformConfiguration[]>([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    setIsLoading(true);
    try {
      const data = await PlatformOutputService.getPlatformConfigurations();
      setPlatforms(data);
      
      // Select the first platform by default if it exists
      if (data.length > 0 && !selectedPlatformId) {
        setSelectedPlatformId(data[0].id);
      }
    } catch (error) {
      console.error("Error loading platform configurations:", error);
      toast({
        title: "Error loading platforms",
        description: "Failed to load platform configurations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateOutput = async (platformId: string) => {
    if (!wireframeId) {
      toast({
        title: "No wireframe selected",
        description: "Please select a wireframe to generate output.",
        variant: "destructive",
      });
      return;
    }

    try {
      await PlatformOutputService.generatePlatformOutput(wireframeId, platformId);
      toast({
        title: "Output generated",
        description: "Platform output has been generated successfully.",
      });
      setActiveTab('outputs');
    } catch (error) {
      console.error("Error generating platform output:", error);
      toast({
        title: "Error generating output",
        description: "Failed to generate platform output. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlatformCreated = (platform: PlatformConfiguration) => {
    setPlatforms(prev => [platform, ...prev]);
    setSelectedPlatformId(platform.id);
    toast({
      title: "Platform configuration created",
      description: "Platform configuration has been created successfully.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multi-Platform Output Framework</CardTitle>
        <CardDescription>
          Generate platform-specific code and assets from wireframes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="transformers">Transformers</TabsTrigger>
            <TabsTrigger value="outputs">Generated Outputs</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="platforms">
              <PlatformConfigurations 
                platforms={platforms}
                isLoading={isLoading}
                selectedPlatformId={selectedPlatformId}
                onPlatformSelect={setSelectedPlatformId}
                onPlatformCreated={handlePlatformCreated}
                onGenerate={generateOutput}
                onRefresh={loadPlatforms}
                wireframeId={wireframeId}
              />
            </TabsContent>
            
            <TabsContent value="transformers">
              <PlatformTransformers 
                platformId={selectedPlatformId}
                isPlatformSelected={!!selectedPlatformId}
              />
            </TabsContent>
            
            <TabsContent value="outputs">
              <GeneratedOutputs 
                wireframeId={wireframeId}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
