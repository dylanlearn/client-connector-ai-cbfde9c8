
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/hooks/useProject';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnhancedWireframeStudio from '@/components/wireframe/EnhancedWireframeStudio';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Sparkles, LayoutGrid, PencilRuler, Palette } from 'lucide-react';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Industry options for wireframe generation
const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology & SaaS' },
  { value: 'ecommerce', label: 'E-commerce & Retail' },
  { value: 'healthcare', label: 'Healthcare & Wellness' },
  { value: 'education', label: 'Education & Learning' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'travel', label: 'Travel & Hospitality' },
  { value: 'food', label: 'Food & Restaurants' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'realestate', label: 'Real Estate & Property' },
  { value: 'nonprofit', label: 'Nonprofit & Charity' }
];

// Style options for wireframe generation
const STYLE_OPTIONS = [
  { value: 'modern', label: 'Modern & Clean' },
  { value: 'minimalist', label: 'Minimalist' }, 
  { value: 'professional', label: 'Professional & Corporate' },
  { value: 'creative', label: 'Creative & Artistic' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'luxury', label: 'Luxury & Premium' },
  { value: 'technical', label: 'Technical & Detailed' }
];

const WireframeStudioPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading } = useProject();
  const { toast } = useToast();
  
  // Form state
  const [promptValue, setPromptValue] = useState('');
  const [industry, setIndustry] = useState<string>('');
  const [style, setStyle] = useState<string>('modern');
  const [creativityLevel, setCreativityLevel] = useState<number>(7);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate a default project ID if none is provided
  const effectiveProjectId = projectId || uuidv4();
  
  const {
    isGenerating,
    generateWireframe,
    currentWireframe,
    setCreativityLevel: setCreativityLevelInHook
  } = useWireframeGeneration();

  // Sync creativity level with the hook
  useEffect(() => {
    setCreativityLevelInHook(creativityLevel);
  }, [creativityLevel, setCreativityLevelInHook]);

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
      // Generate wireframe using the prompt and additional parameters
      await generateWireframe({
        description: promptValue,
        projectId: effectiveProjectId,
        style: style,
        industry: industry,
        creativityLevel: creativityLevel,
        enhancedCreativity: true
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

  // Handle creativity level change
  const handleCreativityChange = (value: string) => {
    setCreativityLevel(parseInt(value));
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
              <CardHeader className="pb-3">
                <CardTitle>Generate Wireframe with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="Describe the wireframe you want to create, e.g., 'A modern landing page for a fitness app with a hero section, features grid, testimonials, and pricing plans.'"
                      value={promptValue}
                      onChange={(e) => setPromptValue(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  
                  {activeTab === 'advanced' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Industry</label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRY_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Style</label>
                        <Select value={style} onValueChange={setStyle}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            {STYLE_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Creativity Level</label>
                          <span className="text-sm text-muted-foreground">{creativityLevel}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={creativityLevel}
                          onChange={(e) => handleCreativityChange(e.target.value)}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Practical</span>
                          <span>Creative</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                <Button variant="outline" onClick={() => setIsExpanded(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateWireframe}
                  disabled={isGenerating || !promptValue.trim()}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Wireframe
                    </>
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
