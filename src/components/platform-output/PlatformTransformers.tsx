import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Component } from 'lucide-react';
import type { PlatformTransformer } from '@/types/platform-output';
import { PlatformOutputService } from '@/services/platform-output/platform-output-service';

interface PlatformTransformersProps {
  platformId: string | null;
  isPlatformSelected: boolean;
}

export function PlatformTransformers({ platformId, isPlatformSelected }: PlatformTransformersProps) {
  const [transformers, setTransformers] = useState<PlatformTransformer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [componentType, setComponentType] = useState('');
  const [transformationRules, setTransformationRules] = useState('');
  const [platformSpecificProps, setPlatformSpecificProps] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (platformId) {
      loadTransformers();
    }
  }, [platformId]);

  const loadTransformers = async () => {
    if (!platformId) return;
    
    setIsLoading(true);
    try {
      const data = await PlatformOutputService.getPlatformTransformers(platformId);
      setTransformers(data);
    } catch (error) {
      console.error("Error loading transformers:", error);
      toast({
        title: "Error loading transformers",
        description: "Failed to load platform transformers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransformer = async () => {
    if (!platformId) return;
    
    try {
      // Validate inputs
      if (!componentType.trim()) {
        toast({
          title: "Missing component type",
          description: "Please specify a component type.",
          variant: "destructive",
        });
        return;
      }

      // Parse JSON inputs
      let parsedRules = {};
      let parsedProps = null;
      
      try {
        parsedRules = transformationRules ? JSON.parse(transformationRules) : {};
      } catch (e) {
        toast({
          title: "Invalid transformation rules",
          description: "Please provide valid JSON for transformation rules.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        parsedProps = platformSpecificProps ? JSON.parse(platformSpecificProps) : null;
      } catch (e) {
        toast({
          title: "Invalid platform properties",
          description: "Please provide valid JSON for platform specific properties.",
          variant: "destructive",
        });
        return;
      }

      const transformer = await PlatformOutputService.createPlatformTransformer(
        platformId,
        componentType,
        parsedRules,
        parsedProps
      );
      
      setTransformers(prev => [transformer, ...prev]);
      
      // Reset form
      setComponentType('');
      setTransformationRules('');
      setPlatformSpecificProps('');
      
      toast({
        title: "Transformer created",
        description: "Platform transformer has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating transformer:", error);
      toast({
        title: "Error creating transformer",
        description: "Failed to create platform transformer. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isPlatformSelected) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40">
            <Component className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Please select a platform to manage transformers</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Transformer</CardTitle>
          <CardDescription>
            Define how design components are transformed to platform-specific code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="componentType">Component Type</Label>
              <Input
                id="componentType"
                placeholder="e.g., Button, Card, TextField"
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="transformationRules">Transformation Rules (JSON)</Label>
              <Textarea
                id="transformationRules"
                placeholder='{"props": {"mapping": {"text": "label", "onClick": "onPress"}}}'
                value={transformationRules}
                onChange={(e) => setTransformationRules(e.target.value)}
                rows={5}
              />
            </div>
            
            <div>
              <Label htmlFor="platformProps">Platform-Specific Properties (JSON)</Label>
              <Textarea
                id="platformProps"
                placeholder='{"androidRippleEffect": true, "iosAccessibilityRole": "button"}'
                value={platformSpecificProps}
                onChange={(e) => setPlatformSpecificProps(e.target.value)}
                rows={3}
              />
            </div>
            
            <Button onClick={handleCreateTransformer}>
              Create Transformer
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Platform Transformers</CardTitle>
          <CardDescription>
            Manage existing component transformers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading transformers...</p>
            </div>
          ) : transformers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Component className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No transformers defined yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transformers.map((transformer) => (
                <Card key={transformer.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{transformer.component_type}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(transformer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {}}>
                      Edit
                    </Button>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Transformation Rules:</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(transformer.transformation_rules, null, 2)}
                    </pre>
                  </div>
                  {transformer.platform_specific_properties && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Platform-Specific Properties:</p>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(transformer.platform_specific_properties, null, 2)}
                      </pre>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
