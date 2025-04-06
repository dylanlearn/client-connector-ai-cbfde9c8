
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
import { Loader2, Wand2, Copy, Sparkles } from 'lucide-react';
import { WireframeGenerationParams } from '@/services/ai/wireframe/wireframe-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WireframeGeneratorProps {
  projectId: string;
  onWireframeGenerated?: () => void;
}

const WireframeGenerator: React.FC<WireframeGeneratorProps> = ({ projectId, onWireframeGenerated }) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const { toast } = useToast();
  const { generateWireframe, isGenerating } = useWireframeGeneration();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<WireframeGenerationParams>({
    defaultValues: {
      projectId,
      description: '',
      complexity: 'standard',
      style: 'modern',
      enhancedCreativity: true,
      creativityLevel: 7,
      pages: 1,
      multiPageLayout: false,
      pageTypes: [],
      moodboardSelections: {
        layoutPreferences: [],
        fonts: [],
        colors: [],
        tone: []
      }
    }
  });
  
  const multiPageLayout = watch('multiPageLayout');
  const pages = watch('pages');
  const creativityLevel = watch('creativityLevel');
  
  const onSubmit = async (data: WireframeGenerationParams) => {
    if (data.description?.trim() === '') {
      toast({
        title: "Description Required",
        description: "Please enter a description for your wireframe",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // If multi-page is enabled, ensure pageTypes are set if not already
      if (data.multiPageLayout && (!data.pageTypes || data.pageTypes.length === 0)) {
        const defaultPageTypes = ['home', 'about', 'services', 'contact'];
        data.pageTypes = defaultPageTypes.slice(0, data.pages || 1);
      }
      
      await generateWireframe(data);
      
      if (onWireframeGenerated) {
        onWireframeGenerated();
      }
    } catch (error) {
      console.error("Error generating wireframe:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate wireframe. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleGenerateFromExample = async (example: string) => {
    setValue('description', example);
    await handleSubmit(onSubmit)();
  };
  
  const examples = [
    "Create an elegant architecture portfolio website for a high-end design firm with a minimal aesthetic",
    "Design a modern SaaS landing page that highlights key product features and has strong call to action sections",
    "Generate a clean blog layout for a lifestyle content creator with featured posts and newsletter signup"
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Wireframe</CardTitle>
        <CardDescription>
          Create detailed wireframes using AI based on your project needs
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <div>
                <Label htmlFor="description">Design Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the website you want to create..."
                  rows={4}
                  className="resize-none mt-1"
                  {...register('description', { required: true })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">Description is required</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    onValueChange={(value) => setValue('complexity', value)}
                    defaultValue="standard"
                  >
                    <SelectTrigger id="complexity">
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple (3-4 sections)</SelectItem>
                      <SelectItem value="standard">Standard (5-7 sections)</SelectItem>
                      <SelectItem value="advanced">Advanced (8+ sections)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="examples">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Select an example prompt to get started quickly:</p>
                {examples.map((example, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4 flex justify-between items-center">
                      <p className="text-sm">{example}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleGenerateFromExample(example)}
                        type="button"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Use
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="advanced-mode"
              checked={isAdvancedMode} 
              onCheckedChange={setIsAdvancedMode} 
            />
            <Label htmlFor="advanced-mode">Advanced Options</Label>
          </div>
          
          {isAdvancedMode && (
            <Accordion type="single" collapsible className="w-full border rounded-md">
              <AccordionItem value="wireframe-options">
                <AccordionTrigger className="px-4">Wireframe Options</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                    
                    <div>
                      <Label htmlFor="creativityLevel" className="flex justify-between">
                        Creativity Level <Badge variant="outline">{creativityLevel}/10</Badge>
                      </Label>
                      <Slider
                        id="creativityLevel"
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[7]}
                        onValueChange={(values) => setValue('creativityLevel', values[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="multipage">
                <AccordionTrigger className="px-4">Multi-page Layout</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="multiPageLayout"
                        checked={multiPageLayout} 
                        onCheckedChange={(checked) => setValue('multiPageLayout', checked)} 
                      />
                      <Label htmlFor="multiPageLayout">Enable multi-page layout</Label>
                    </div>
                    
                    {multiPageLayout && (
                      <div>
                        <Label htmlFor="pages" className="flex justify-between">
                          Number of Pages <Badge variant="outline">{pages}</Badge>
                        </Label>
                        <Slider
                          id="pages"
                          min={1}
                          max={5}
                          step={1}
                          defaultValue={[1]}
                          onValueChange={(values) => setValue('pages', values[0])}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Generate up to 5 connected pages with navigation structure
                        </p>
                      </div>
                    )}
                    
                    {multiPageLayout && pages > 1 && (
                      <div>
                        <Label htmlFor="pageTypes">Page Types</Label>
                        <Input
                          id="pageTypes"
                          placeholder="e.g., home, about, services, contact"
                          {...register('pageTypes')}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Comma separated page types (home, about, services, etc.)
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="additional">
                <AccordionTrigger className="px-4">Additional Instructions</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <Textarea
                    id="additionalInstructions"
                    placeholder="Any additional details or specific requirements..."
                    rows={3}
                    {...register('additionalInstructions')}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                <Sparkles className="mr-2 h-4 w-4" />
                Generate {multiPageLayout && pages > 1 ? `${pages}-Page ` : ''}Wireframe
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WireframeGenerator;
