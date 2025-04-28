import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Smartphone } from 'lucide-react';
import type { PlatformConfiguration } from '@/types/platform-output';

interface PlatformConfigurationsProps {
  platforms: PlatformConfiguration[];
  isLoading: boolean;
  selectedPlatformId: string | null;
  onPlatformSelect: (platformId: string) => void;
  onPlatformCreated: (platform: PlatformConfiguration) => void;
  onGenerate: (platformId: string) => void;
  onRefresh: () => void;
  wireframeId?: string;
}

export function PlatformConfigurations({
  platforms,
  isLoading,
  selectedPlatformId,
  onPlatformSelect,
  onPlatformCreated,
  onGenerate,
  onRefresh,
  wireframeId
}: PlatformConfigurationsProps) {
  const { toast } = useToast();
  
  const handleGenerateOutput = () => {
    if (!selectedPlatformId) {
      toast({
        title: "No platform selected",
        description: "Please select a platform to generate output.",
        variant: "destructive",
      });
      return;
    }
    
    if (!wireframeId) {
      toast({
        title: "No wireframe selected",
        description: "Please select a wireframe to generate output.",
        variant: "destructive",
      });
      return;
    }
    
    onGenerate(selectedPlatformId);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Available Platforms</h3>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : platforms.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">No platform configurations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <Card 
              key={platform.id}
              className={`cursor-pointer transition-all ${
                selectedPlatformId === platform.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onPlatformSelect(platform.id)}
            >
              <div className="p-4 flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{platform.platform_name}</h4>
                  <p className="text-sm text-muted-foreground">{platform.platform_type}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            // Open platform configuration modal
            toast({
              title: "Coming soon",
              description: "Platform configuration creation will be available soon.",
            });
          }}
        >
          Add Platform
        </Button>
        <Button 
          onClick={handleGenerateOutput}
          disabled={!selectedPlatformId || !wireframeId}
        >
          Generate Output
        </Button>
      </div>
    </div>
  );
}
