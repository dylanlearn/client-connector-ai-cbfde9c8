import React, { useState, useEffect } from 'react';
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
import { Loader2, Wand2, Copy, Sparkles, Shuffle, BookOpen, LayoutGrid } from 'lucide-react';
import { WireframeGenerationParams } from '@/services/ai/wireframe/wireframe-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WireframeGeneratorProps {
  projectId: string;
  onWireframeGenerated?: () => void;
}

// Design and component suggestions
const designStyles = [
  { name: "Modern & Clean", description: "Sleek, clean layouts with minimalist aesthetics", value: "modern" },
  { name: "Minimalist", description: "Focus on essential content with generous whitespace", value: "minimalist" },
  { name: "Bold & Vibrant", description: "High contrast, vibrant colors, and strong elements", value: "bold" },
  { name: "Corporate", description: "Professional and structured for business applications", value: "corporate" },
  { name: "Playful & Fun", description: "Energetic and creative with friendly interface", value: "playful" },
  { name: "Luxury & Elegant", description: "Sophisticated design with premium elements", value: "luxury" },
  { name: "Tech-Forward", description: "Modern interface focused on technical innovation", value: "tech" },
  { name: "Editorial", description: "Content-focused design with beautiful typography", value: "editorial" },
];

const componentSuggestions = [
  { name: "Hero Section", description: "Large banner with headline and call to action" },
  { name: "Feature Grid", description: "Grid layout showcasing product/service features" },
  { name: "Pricing Table", description: "Compare different pricing tiers and plans" },
  { name: "Testimonial Carousel", description: "Scrollable customer reviews or testimonials" },
  { name: "Contact Form", description: "Input fields for user to send inquiries" },
  { name: "Navigation Menu", description: "Top navigation with dropdown functionality" },
  { name: "Image Gallery", description: "Grid or carousel of images or portfolio work" },
  { name: "Stats Dashboard", description: "Visual presentation of key metrics and stats" },
];

const WireframeGenerator: React.FC<WireframeGeneratorProps> = ({ projectId, onWireframeGenerated }) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [isSuggestionVisible, setSuggestionVisible] = useState<boolean>(false);
  const { toast } = useToast();
  const { generateWireframe, isGenerating, creativityLevel: defaultCreativity } = useWireframeGeneration();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<WireframeGenerationParams>({
    defaultValues: {
      projectId,
      description: '',
      complexity: 'moderate',
      style: 'modern',
      enhancedCreativity: true,
      creativityLevel: defaultCreativity || 8,
      pages: 1,
      multiPageLayout: false,
      pageTypes: [],
      moodboardSelections: {}
    }
  });
  
  useEffect(() => {
    setValue('projectId', projectId);
  }, [projectId, setValue]);
  
  const multiPageLayout = watch('multiPageLayout');
  const pages = watch('pages');
  const creativity = watch('creativityLevel');
  const currentDescription = watch('description');
  
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
      if (data.multiPageLayout && (!data.pageTypes || data.pageTypes.length === 0)) {
        const defaultPageTypes = ['home', 'about', 'services', 'contact'];
        data.pageTypes = defaultPageTypes.slice(0, data.pages || 1);
      }
      
      const result = await generateWireframe(data);
      
      if (result && onWireframeGenerated) {
        toast({
          title: "Wireframe Generated Successfully",
          description: `Created "${result.wireframe.title || 'New wireframe'}" with ${creativity}/10 creativity`,
        });
        
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
  
  // Enhanced examples with more context and guidance
  const examples = [
    "Create an elegant architecture portfolio website with a hero section showcasing featured projects, a minimal project grid, about section with team information, and contact form. Use a sophisticated black and white color scheme.",
    "Design a modern SaaS landing page with animated hero section, feature grid with icons, pricing comparison table, customer testimonials, and sticky header. Include CTAs throughout the page and a footer with resources.",
    "Generate a clean blog layout with featured post slider, category navigation, article previews with images, sidebar with popular posts, and newsletter signup. Use generous whitespace and elegant typography.",
    "Create a dashboard interface for a financial app with top navigation, sidebar menu, KPI cards, interactive charts, transaction history table, and notification center. Use a professional color scheme.",
  ];
  
  const handleAddComponent = (component: string) => {
    const currentText = getValues('description');
    setValue('description', currentText + (currentText ? '\n' : '') + `Include a ${component}.`);
    setSuggestionVisible(false);
  };
  
  const handleSelectStyle = (style: string) => {
    setValue('style', style);
    const currentText = getValues('description');
    if (!currentText.toLowerCase().includes(style.toLowerCase())) {
      setValue('description', currentText + (currentText ? '\n' : '') + `Use a ${style} design style.`);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-card text-card-foreground"
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          Wireframe Generator
        </CardTitle>
        <CardDescription>
          Create detailed wireframes using AI based on your project requirements
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 w-full">
              <TabsTrigger value="basic" className="flex items-center">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Design Brief
              </TabsTrigger>
              <TabsTrigger value="examples" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Examples
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <div className="relative">
                <div>
                  <Label htmlFor="description" className="flex justify-between">
                    Design Description
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground"
                                  onClick={() => setSuggestionVisible(!isSuggestionVisible)}>
                            Need ideas?
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Get component and style suggestions
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the website you want to create in detail. Include page type, sections needed, style preferences..."
                    rows={4}
                    className="resize-none mt-1 font-mono text-sm"
                    {...register('description', { required: true })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">Description is required</p>
                  )}
                </div>
                
                {isSuggestionVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 border rounded-md p-3 bg-muted/50"
                  >
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Design Styles</h4>
                        <div className="flex flex-wrap gap-2">
                          {designStyles.slice(0, 5).map((style) => (
                            <Badge 
                              key={style.value} 
                              variant="outline"
                              className="cursor-pointer hover:bg-primary/10"
                              onClick={() => handleSelectStyle(style.value)}
                            >
                              {style.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Popular Components</h4>
                        <div className="flex flex-wrap gap-2">
                          {componentSuggestions.slice(0, 6).map((comp, idx) => (
                            <Badge 
                              key={idx}
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                              onClick={() => handleAddComponent(comp.name)}
                            >
                              {comp.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="style">Design Style</Label>
                  <Select
                    onValueChange={(value) => setValue('style', value)}
                    defaultValue="modern"
                  >
                    <SelectTrigger id="style" className="mt-1">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {designStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          <div className="flex flex-col">
                            <span>{style.name}</span>
                            <span className="text-xs text-muted-foreground">{style.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="complexity">Complexity</Label>
                  <Select
                    onValueChange={(value) => setValue('complexity', value)}
                    defaultValue="moderate"
                  >
                    <SelectTrigger id="complexity" className="mt-1">
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple (3-4 sections)</SelectItem>
                      <SelectItem value="moderate">Standard (5-7 sections)</SelectItem>
                      <SelectItem value="complex">Advanced (8+ sections)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="examples">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Select an example prompt to get started quickly:</p>
                {examples.map((example, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors border-opacity-50">
                    <CardContent className="p-4 flex justify-between items-start">
                      <p className="text-sm pr-4">{example}</p>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setValue('description', example)}
                          className="w-full"
                          type="button"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleGenerateFromExample(example)}
                          className="w-full"
                          type="button"
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center space-x-2 pt-2">
            <div className="flex items-center space-x-2 mr-6">
              <Label htmlFor="creativityLevel" className="min-w-[70px]">Creativity</Label>
              <div className="flex-1">
                <Slider
                  id="creativityLevel"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[creativity]}
                  onValueChange={(values) => setValue('creativityLevel', values[0])}
                />
              </div>
              <Badge variant="outline">{creativity}/10</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="advanced-mode"
                checked={isAdvancedMode} 
                onCheckedChange={setIsAdvancedMode} 
              />
              <Label htmlFor="advanced-mode">Advanced Options</Label>
            </div>
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
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="typography">Typography Style</Label>
                        <Input
                          id="typography"
                          placeholder="e.g., Modern Sans-serif, Classic Serif"
                          {...register('typography')}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorTheme">Color Theme</Label>
                      <Input
                        id="colorTheme"
                        placeholder="e.g., Blue and white, Dark with neon accents"
                        {...register('colorTheme')}
                        className="mt-1"
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
                          className="mt-1"
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
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => reset()}
            disabled={isGenerating}
          >
            <Shuffle className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button 
            type="submit" 
            className="min-w-[180px]"
            disabled={isGenerating || !currentDescription?.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Wireframe...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate {multiPageLayout && pages > 1 ? `${pages}-Page ` : ''}Wireframe
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </motion.div>
  );
};

export default WireframeGenerator;
