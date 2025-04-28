
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlatformOutputService } from '@/services/platform-output/platform-output-service';
import type { PlatformTransformer } from '@/types/platform-output';
import { Component, RefreshCw } from 'lucide-react';

interface PlatformTransformersProps {
  platformId: string | null;
  isPlatformSelected: boolean;
}

export function PlatformTransformers({ platformId, isPlatformSelected }: PlatformTransformersProps) {
  const [transformers, setTransformers] = useState<PlatformTransformer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTransformer, setNewTransformer] = useState({
    componentType: '',
    transformationRules: '',
    properties: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (platformId) {
      loadTransformers(platformId);
    }
  }, [platformId]);

  const loadTransformers = async (platformId: string) => {
    setIsLoading(true);
    try {
      const data = await PlatformOutputService.getTransformers(platformId);
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
    if (!platformId) {
      toast({
        title: "No platform selected",
        description: "Please select a platform to create a transformer.",
        variant: "destructive",
      });
      return;
    }

    if (!newTransformer.componentType || !newTransformer.transformationRules) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      let transformationRules;
      let properties;
      
      try {
        transformationRules = JSON.parse(newTransformer.transformationRules);
      } catch (e) {
        toast({
          title: "Invalid JSON",
          description: "Transformation rules must be valid JSON.",
          variant: "destructive",
        });
        return;
      }

      if (newTransformer.properties) {
        try {
          properties = JSON.parse(newTransformer.properties);
        } catch (e) {
          toast({
            title: "Invalid JSON",
            description: "Platform properties must be valid JSON.",
            variant: "destructive",
          });
          return;
        }
      }

      const transformer = await PlatformOutputService.createTransformer(
        platformId,
        newTransformer.componentType,
        transformationRules,
        properties
      );

      setTransformers([transformer, ...transformers]);
      toast({
        title: "Transformer created",
        description: "Platform transformer has been created successfully.",
      });

      // Clear form
      setNewTransformer({
        componentType: '',
        transformationRules: '',
        properties: ''
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
      <div className="text-gray-500 italic">
        Please select a platform to view and manage transformers.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Platform Transformers</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => platformId && loadTransformers(platformId)}
          disabled={isLoading || !platformId}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-4">Create New Transformer</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Component Type</label>
              <Select 
                value={newTransformer.componentType}
                onValueChange={(value) => setNewTransformer({...newTransformer, componentType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select component type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="input">Input</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="navigation">Navigation</SelectItem>
                  <SelectItem value="layout">Layout</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Transformation Rules (JSON)</label>
              <Textarea 
                placeholder="{ ... }" 
                value={newTransformer.transformationRules}
                onChange={(e) => setNewTransformer({...newTransformer, transformationRules: e.target.value})}
                rows={5}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Platform-Specific Properties (JSON, optional)</label>
              <Textarea 
                placeholder="{ ... }" 
                value={newTransformer.properties}
                onChange={(e) => setNewTransformer({...newTransformer, properties: e.target.value})}
                rows={3}
              />
            </div>
            
            <Button onClick={handleCreateTransformer}>Create Transformer</Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : transformers.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/50">
          <Component className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mt-2">No transformers found for this platform.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first transformer to start mapping wireframe components to platform-specific code.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {transformers.map((transformer) => (
            <Card key={transformer.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{transformer.component_type}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(transformer.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <h5 className="font-medium text-sm mb-2">Transformation Rules:</h5>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(transformer.transformation_rules, null, 2)}
                  </pre>
                </div>
                
                {transformer.platform_specific_properties && (
                  <div className="mt-4 border-t pt-4">
                    <h5 className="font-medium text-sm mb-2">Platform-Specific Properties:</h5>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(transformer.platform_specific_properties, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
