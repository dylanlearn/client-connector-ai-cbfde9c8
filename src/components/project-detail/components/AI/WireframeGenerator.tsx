
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Wand2 } from 'lucide-react';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { WireframeData } from '@/services/ai/wireframe/wireframe-service';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  style: z.string().optional(),
  complexity: z.enum(['simple', 'medium', 'complex']).optional(),
  industry: z.string().optional(),
  additionalInstructions: z.string().optional(),
  
  // Moodboard selections
  layoutPreferences: z.array(z.string()).optional(),
  fonts: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tone: z.array(z.string()).optional(),
  
  // Intake form responses
  businessGoals: z.string().optional(),
  targetAudience: z.string().optional(),
  siteFeatures: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface WireframeGeneratorProps {
  projectId: string;
  onWireframeGenerated?: () => void;
}

const WireframeGenerator: React.FC<WireframeGeneratorProps> = ({ 
  projectId,
  onWireframeGenerated
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const { isGenerating, generateWireframe } = useWireframeGeneration();
  const [generatedWireframe, setGeneratedWireframe] = useState<WireframeData | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      style: 'modern',
      complexity: 'medium',
      industry: '',
      additionalInstructions: '',
      layoutPreferences: [],
      fonts: [],
      colors: [],
      tone: [],
      businessGoals: '',
      targetAudience: '',
      siteFeatures: [],
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const result = await generateWireframe({
        prompt: values.prompt,
        projectId,
        style: values.style,
        complexity: values.complexity,
        industry: values.industry,
        additionalInstructions: values.additionalInstructions,
        moodboardSelections: {
          layoutPreferences: values.layoutPreferences,
          fonts: values.fonts,
          colors: values.colors,
          tone: values.tone,
        },
        intakeResponses: {
          businessGoals: values.businessGoals,
          targetAudience: values.targetAudience,
          siteFeatures: values.siteFeatures,
        },
      });
      
      if (result) {
        setGeneratedWireframe(result.wireframe);
        if (onWireframeGenerated) {
          onWireframeGenerated();
        }
      }
    } catch (error) {
      console.error("Error generating wireframe:", error);
    }
  }

  // Style options
  const styleOptions = [
    { label: 'Modern', value: 'modern' },
    { label: 'Minimalist', value: 'minimalist' },
    { label: 'Bold', value: 'bold' },
    { label: 'Corporate', value: 'corporate' },
    { label: 'Creative', value: 'creative' },
    { label: 'Elegant', value: 'elegant' },
    { label: 'Playful', value: 'playful' },
    { label: 'Luxury', value: 'luxury' },
  ];

  // Industry options
  const industryOptions = [
    { label: 'SaaS', value: 'saas' },
    { label: 'E-commerce', value: 'ecommerce' },
    { label: 'Portfolio', value: 'portfolio' },
    { label: 'Blog', value: 'blog' },
    { label: 'Corporate', value: 'corporate' },
    { label: 'Agency', value: 'agency' },
    { label: 'Educational', value: 'educational' },
    { label: 'Non-profit', value: 'nonprofit' },
    { label: 'Healthcare', value: 'healthcare' },
  ];

  // Layout preference options
  const layoutOptions = [
    { id: 'grid', label: 'Grid Layout' },
    { id: 'asymmetric', label: 'Asymmetric Layout' },
    { id: 'centered', label: 'Centered Content' },
    { id: 'card-based', label: 'Card-Based Design' },
    { id: 'hero-focus', label: 'Hero Image Focus' },
  ];

  // Font options
  const fontOptions = [
    { id: 'sans-serif', label: 'Sans-Serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'monospace', label: 'Monospace' },
    { id: 'display', label: 'Display/Decorative' },
    { id: 'handwritten', label: 'Handwritten' },
  ];

  // Color scheme options
  const colorOptions = [
    { id: 'monochromatic', label: 'Monochromatic' },
    { id: 'analogous', label: 'Analogous' },
    { id: 'complementary', label: 'Complementary' },
    { id: 'triadic', label: 'Triadic' },
    { id: 'pastel', label: 'Pastel' },
    { id: 'earth-tones', label: 'Earth Tones' },
    { id: 'bright', label: 'Bright and Vibrant' },
  ];

  // Tone options
  const toneOptions = [
    { id: 'professional', label: 'Professional' },
    { id: 'friendly', label: 'Friendly' },
    { id: 'luxurious', label: 'Luxurious' },
    { id: 'playful', label: 'Playful' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'technical', label: 'Technical' },
    { id: 'trustworthy', label: 'Trustworthy' },
  ];

  // Site features options
  const featureOptions = [
    { id: 'blog', label: 'Blog' },
    { id: 'contact-form', label: 'Contact Form' },
    { id: 'portfolio', label: 'Portfolio Gallery' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricing-table', label: 'Pricing Table' },
    { id: 'faq', label: 'FAQ Section' },
    { id: 'newsletter', label: 'Newsletter Signup' },
    { id: 'search', label: 'Search Functionality' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="moodboard">Moodboard</TabsTrigger>
            <TabsTrigger value="intake">Business Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wireframe Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the website you want to create..." 
                      className="resize-none h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the website, target audience, and key goals.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {styleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose a design style for your wireframe.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="complex">Complex</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Determine how complex your website wireframe should be.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the industry that best matches your website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific requirements or preferences..." 
                      className="resize-none h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide any additional instructions or specific requirements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="moodboard" className="space-y-4 mt-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="layoutPreferences"
                render={() => (
                  <FormItem>
                    <FormLabel>Layout Preferences</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {layoutOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="layoutPreferences"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select preferred layout styles.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fonts"
                render={() => (
                  <FormItem>
                    <FormLabel>Typography</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {fontOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="fonts"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select preferred font styles.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colors"
                render={() => (
                  <FormItem>
                    <FormLabel>Color Schemes</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {colorOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="colors"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select preferred color schemes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={() => (
                  <FormItem>
                    <FormLabel>Design Tone</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {toneOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="tone"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select preferred tone for your design.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="intake" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="businessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are your main business objectives?" 
                      className="resize-none h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what you want to achieve with this website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Who is your target audience?" 
                      className="resize-none h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your ideal visitors and customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteFeatures"
              render={() => (
                <FormItem>
                  <FormLabel>Site Features</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {featureOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="siteFeatures"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], option.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Select features you want to include in your website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <Button type="submit" className="w-full" disabled={isGenerating}>
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
      </form>
    </Form>
  );
};

export default WireframeGenerator;
