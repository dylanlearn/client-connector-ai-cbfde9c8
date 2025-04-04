
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import { WireframeGenerationParams } from '@/services/ai/wireframe/wireframe-types';

interface WireframeGeneratorProps {
  projectId: string;
  onWireframeGenerated?: () => void;
}

const WireframeGenerator: React.FC<WireframeGeneratorProps> = ({ projectId, onWireframeGenerated }) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const { toast } = useToast();
  const { generateWireframe, isGenerating } = useWireframeGeneration();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<WireframeGenerationParams & {
    moodboardSelections?: {
      layoutPreferences?: string[];
      fonts?: string[];
      colors?: string[];
      tone?: string[];
    };
  }>({
    defaultValues: {
      projectId,
      prompt: '',
      complexity: 'medium',
      style: 'modern',
      moodboardSelections: {
        layoutPreferences: [],
        fonts: [],
        colors: [],
        tone: []
      }
    }
  });
  
  const onSubmit = async (data: WireframeGenerationParams & {
    moodboardSelections?: {
      layoutPreferences?: string[];
      fonts?: string[];
      colors?: string[];
      tone?: string[];
    };
  }) => {
    if (data.prompt.trim() === '') {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt for your wireframe",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await generateWireframe(data);
      
      if (onWireframeGenerated) {
        onWireframeGenerated();
      }
    } catch (error) {
      console.error("Error generating wireframe:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Wireframe</CardTitle>
        <CardDescription>
          Create a wireframe using AI based on your project needs
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Design Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the website you want to create..."
              rows={4}
              className="resize-none mt-1"
              {...register('prompt', { required: true })}
            />
            {errors.prompt && (
              <p className="text-red-500 text-sm mt-1">Prompt is required</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="style">Style</Label>
              <Select
                onValueChange={(value) => setValue('style', value)}
                defaultValue="modern"
              >
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern & Clean</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="bold">Bold & Vibrant</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="playful">Playful & Fun</SelectItem>
                  <SelectItem value="luxury">Luxury & Elegant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="complexity">Complexity</Label>
              <Select
                onValueChange={(value: 'simple' | 'medium' | 'complex') => setValue('complexity', value)}
                defaultValue="medium"
              >
                <SelectTrigger id="complexity">
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (3-4 sections)</SelectItem>
                  <SelectItem value="medium">Medium (5-7 sections)</SelectItem>
                  <SelectItem value="complex">Complex (8+ sections)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="advanced-mode"
              checked={isAdvancedMode} 
              onCheckedChange={setIsAdvancedMode} 
            />
            <Label htmlFor="advanced-mode">Advanced Options</Label>
          </div>
          
          {isAdvancedMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4 bg-gray-50">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., E-commerce, SaaS, Education"
                  {...register('industry')}
                />
              </div>
              <div>
                <Label htmlFor="typography">Typography Style</Label>
                <Input
                  id="typography"
                  placeholder="e.g., Modern Sans-serif, Classic Serif"
                  {...register('typography')}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="additionalInstructions">Additional Instructions</Label>
                <Textarea
                  id="additionalInstructions"
                  placeholder="Any additional details or specific requirements..."
                  rows={2}
                  {...register('additionalInstructions')}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Wireframe...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Wireframe
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WireframeGenerator;
