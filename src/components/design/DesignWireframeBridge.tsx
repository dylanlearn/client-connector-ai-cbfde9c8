
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VisualCalibrationOption, EnhancedVisualPicker } from './EnhancedVisualPicker';
import { WireframeData, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';
import { DesignSuggestion, useWireframeVariations } from '@/hooks/wireframe/use-wireframe-variations';
import { useWireframeGenerator } from '@/hooks/wireframe/use-wireframe-generator';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, PenLine, Palette, Layout, ArrowRight, Loader2 } from 'lucide-react';

interface DesignWireframeBridgeProps {
  initialWireframe?: WireframeData;
  onWireframeGenerated?: (result: WireframeGenerationResult) => void;
  onDesignApplied?: (wireframe: WireframeData, designSuggestion: DesignSuggestion) => void;
  projectId?: string;
}

// Sample design options for visual calibration
const colorOptions: VisualCalibrationOption[] = [
  {
    id: "color-modern",
    title: "Modern & Clean",
    description: "Clean color scheme with abundant whitespace",
    category: "color",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Modern+%26+Clean",
    attributes: { minimalist: 0.8, professional: 0.7, vibrant: 0.3 },
    tags: ["minimal", "clean", "professional"]
  },
  {
    id: "color-vibrant",
    title: "Bold & Vibrant",
    description: "Eye-catching colors that grab attention",
    category: "color",
    imageUrl: "https://placehold.co/600x400/8B5CF6/FFFFFF?text=Bold+%26+Vibrant",
    attributes: { minimalist: 0.2, professional: 0.5, vibrant: 0.9 },
    tags: ["colorful", "bold", "modern"]
  },
  {
    id: "color-elegant",
    title: "Elegant & Subtle",
    description: "Sophisticated colors with subtle gradients",
    category: "color", 
    imageUrl: "https://placehold.co/600x400/334155/94a3b8?text=Elegant+%26+Subtle",
    attributes: { minimalist: 0.6, professional: 0.9, vibrant: 0.2 },
    tags: ["elegant", "subtle", "professional"]
  },
  {
    id: "color-playful",
    title: "Playful & Creative",
    description: "Fun, approachable color combinations",
    category: "color",
    imageUrl: "https://placehold.co/600x400/F97316/FEF7CD?text=Playful+%26+Creative", 
    attributes: { minimalist: 0.2, professional: 0.3, vibrant: 0.8 },
    tags: ["playful", "creative", "approachable"]
  }
];

const layoutOptions: VisualCalibrationOption[] = [
  {
    id: "layout-classic",
    title: "Classic Structure",
    description: "Traditional layout with clear hierarchy",
    category: "layout",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Classic+Structure",
    attributes: { traditional: 0.8, spacious: 0.5, dynamic: 0.2 },
    tags: ["traditional", "clear", "hierarchical"]
  },
  {
    id: "layout-modern",
    title: "Modern Grid",
    description: "Contemporary layout with card-based elements",
    category: "layout",
    imageUrl: "https://placehold.co/600x400/f1f5f9/64748b?text=Modern+Grid",
    attributes: { traditional: 0.3, spacious: 0.6, dynamic: 0.7 },
    tags: ["modern", "grid", "cards"]
  },
  {
    id: "layout-asymmetrical",
    title: "Dynamic Asymmetry",
    description: "Engaging layout with asymmetrical balance",
    category: "layout",
    imageUrl: "https://placehold.co/600x400/F0F9FF/0EA5E9?text=Dynamic+Asymmetry",
    attributes: { traditional: 0.1, spacious: 0.4, dynamic: 0.9 },
    tags: ["asymmetrical", "dynamic", "engaging"]
  }
];

const componentOptions: VisualCalibrationOption[] = [
  {
    id: "component-simple",
    title: "Clean Components",
    description: "Simple, functional UI elements",
    category: "component",
    imageUrl: "https://placehold.co/600x400/f8fafc/334155?text=Clean+Components",
    attributes: { minimal: 0.9, interactive: 0.4, decorative: 0.2 },
    tags: ["clean", "simple", "functional"]
  },
  {
    id: "component-detailed",
    title: "Detailed Components",
    description: "Rich, detailed UI with more visual elements",
    category: "component",
    imageUrl: "https://placehold.co/600x400/f1f5f9/1e293b?text=Detailed+Components",
    attributes: { minimal: 0.2, interactive: 0.6, decorative: 0.8 },
    tags: ["detailed", "rich", "visual"]
  },
  {
    id: "component-interactive",
    title: "Highly Interactive",
    description: "Components with strong interactive elements",
    category: "component",
    imageUrl: "https://placehold.co/600x400/ecfdf5/059669?text=Interactive+Components",
    attributes: { minimal: 0.3, interactive: 0.9, decorative: 0.5 },
    tags: ["interactive", "engaging", "responsive"]
  }
];

export const DesignWireframeBridge: React.FC<DesignWireframeBridgeProps> = ({
  initialWireframe,
  onWireframeGenerated,
  onDesignApplied,
  projectId
}) => {
  const [currentStep, setCurrentStep] = useState<'colors' | 'layout' | 'components' | 'review' | 'generating'>('colors');
  const [selectedColorOptions, setSelectedColorOptions] = useState<VisualCalibrationOption[]>([]);
  const [selectedLayoutOptions, setSelectedLayoutOptions] = useState<VisualCalibrationOption[]>([]);
  const [selectedComponentOptions, setSelectedComponentOptions] = useState<VisualCalibrationOption[]>([]);
  const [wireframe, setWireframe] = useState<WireframeData | undefined>(initialWireframe);
  const [calibrationParams, setCalibrationParams] = useState<Record<string, any>>({});
  
  const { generateVariation, isGenerating } = useWireframeVariations();
  
  const { generateWireframe, isGenerating: isBaseGenerating } = useWireframeGenerator(
    8,
    (result) => {
      if (result && result.wireframe) {
        setWireframe(result.wireframe);
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
      }
    },
    (props) => {
      toast(props);
      return "";
    }
  );
  
  const handleColorCalibration = useCallback((result: {
    selectedOptions: VisualCalibrationOption[];
    calibrationParams: Record<string, number | string>;
  }) => {
    setSelectedColorOptions(result.selectedOptions);
    setCalibrationParams(prev => ({ ...prev, colors: result.calibrationParams }));
    setCurrentStep('layout');
  }, []);
  
  const handleLayoutCalibration = useCallback((result: {
    selectedOptions: VisualCalibrationOption[];
    calibrationParams: Record<string, number | string>;
  }) => {
    setSelectedLayoutOptions(result.selectedOptions);
    setCalibrationParams(prev => ({ ...prev, layout: result.calibrationParams }));
    setCurrentStep('components');
  }, []);
  
  const handleComponentCalibration = useCallback((result: {
    selectedOptions: VisualCalibrationOption[];
    calibrationParams: Record<string, number | string>;
  }) => {
    setSelectedComponentOptions(result.selectedOptions);
    setCalibrationParams(prev => ({ ...prev, components: result.calibrationParams }));
    setCurrentStep('review');
  }, []);
  
  const applyDesignToWireframe = useCallback(async () => {
    if (!wireframe) {
      toast({
        title: "No wireframe available",
        description: "A wireframe must be generated or provided before applying design",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep('generating');
    
    try {
      // Create design suggestion based on selected options and calibration
      const designSuggestion: DesignSuggestion = {
        colorScheme: deriveColorScheme(selectedColorOptions, calibrationParams.colors),
        typography: deriveTypography(selectedColorOptions, calibrationParams.colors),
        layoutStyle: deriveLayoutStyle(selectedLayoutOptions, calibrationParams.layout),
        componentStyles: deriveComponentStyles(selectedComponentOptions, calibrationParams.components),
        toneDescriptor: deriveToneDescriptor(
          selectedColorOptions, 
          selectedLayoutOptions, 
          selectedComponentOptions
        )
      };
      
      // Generate wireframe variation with the design suggestions applied
      const result = await generateVariation(wireframe, 8, [], designSuggestion);
      
      if (result && result.wireframe) {
        setWireframe(result.wireframe);
        
        if (onDesignApplied) {
          onDesignApplied(result.wireframe, designSuggestion);
        }
        
        toast({
          title: "Design applied successfully",
          description: "The design suggestions have been applied to your wireframe"
        });
      }
    } catch (error) {
      console.error("Error applying design to wireframe:", error);
      toast({
        title: "Failed to apply design",
        description: error instanceof Error ? error.message : "An error occurred while applying the design",
        variant: "destructive"
      });
    } finally {
      setCurrentStep('review');
    }
  }, [
    wireframe, 
    selectedColorOptions, 
    selectedLayoutOptions, 
    selectedComponentOptions, 
    calibrationParams, 
    generateVariation,
    onDesignApplied
  ]);
  
  const generateInitialWireframe = useCallback(async () => {
    if (!projectId) return;
    
    try {
      const result = await generateWireframe({
        description: "Create a modern homepage wireframe",
        projectId,
        creativityLevel: 8
      });
      
      if (result && result.wireframe) {
        setWireframe(result.wireframe);
      }
    } catch (error) {
      console.error("Error generating initial wireframe:", error);
    }
  }, [projectId, generateWireframe]);
  
  useEffect(() => {
    if (!initialWireframe && !wireframe && projectId) {
      generateInitialWireframe();
    }
  }, [initialWireframe, wireframe, projectId, generateInitialWireframe]);
  
  // Helper functions to derive design properties from selected options
  const deriveColorScheme = (
    options: VisualCalibrationOption[], 
    params: Record<string, number>
  ): DesignSuggestion['colorScheme'] => {
    // Default color scheme
    const defaultScheme = {
      primary: "#3182ce",
      secondary: "#805ad5",
      accent: "#ed8936",
      background: "#ffffff",
      text: "#1a202c"
    };
    
    if (options.length === 0) return defaultScheme;
    
    // Check which color scheme was selected based on tags
    const hasBold = options.some(opt => opt.tags?.includes("bold") || opt.tags?.includes("vibrant"));
    const hasMinimal = options.some(opt => opt.tags?.includes("minimal") || opt.tags?.includes("clean"));
    const hasPlayful = options.some(opt => opt.tags?.includes("playful") || opt.tags?.includes("creative"));
    const hasElegant = options.some(opt => opt.tags?.includes("elegant") || opt.tags?.includes("professional"));
    
    if (hasBold) {
      return {
        primary: "#8B5CF6",
        secondary: "#F97316", 
        accent: "#0EA5E9",
        background: "#ffffff",
        text: "#1A1F2C"
      };
    } else if (hasPlayful) {
      return {
        primary: "#F97316",
        secondary: "#8B5CF6",
        accent: "#10b981",
        background: "#FDF2F8",
        text: "#1F2937"
      };
    } else if (hasMinimal) {
      return {
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#111827"
      };
    } else if (hasElegant) {
      return {
        primary: "#334155",
        secondary: "#6E59A5",
        accent: "#D946EF",
        background: "#F8FAFC",
        text: "#1E293B"
      };
    }
    
    return defaultScheme;
  };
  
  const deriveTypography = (
    options: VisualCalibrationOption[],
    params: Record<string, number>
  ): DesignSuggestion['typography'] => {
    // Default typography
    const defaultTypography = {
      headings: "Inter",
      body: "Inter"
    };
    
    if (options.length === 0) return defaultTypography;
    
    // Check which style was selected based on tags
    const hasModern = options.some(opt => opt.tags?.includes("modern"));
    const hasElegant = options.some(opt => opt.tags?.includes("elegant") || opt.tags?.includes("professional"));
    const hasPlayful = options.some(opt => opt.tags?.includes("playful") || opt.tags?.includes("creative"));
    
    if (hasModern) {
      return {
        headings: "Montserrat",
        body: "Inter"
      };
    } else if (hasElegant) {
      return {
        headings: "Playfair Display",
        body: "Raleway"
      };
    } else if (hasPlayful) {
      return {
        headings: "Nunito",
        body: "Quicksand"
      };
    }
    
    return defaultTypography;
  };
  
  const deriveLayoutStyle = (
    options: VisualCalibrationOption[],
    params: Record<string, number>
  ): string => {
    if (options.length === 0) return "standard";
    
    // Check which layout style was selected based on tags
    const hasTraditional = options.some(opt => opt.tags?.includes("traditional"));
    const hasModern = options.some(opt => opt.tags?.includes("modern") || opt.tags?.includes("grid"));
    const hasDynamic = options.some(opt => opt.tags?.includes("dynamic") || opt.tags?.includes("asymmetrical"));
    
    if (hasTraditional) return "classic";
    if (hasModern) return "grid";
    if (hasDynamic) return "asymmetrical";
    
    return "standard";
  };
  
  const deriveComponentStyles = (
    options: VisualCalibrationOption[],
    params: Record<string, number>
  ): Record<string, any> => {
    const defaultStyles: Record<string, any> = {};
    
    if (options.length === 0) return defaultStyles;
    
    // Check which component style was selected based on tags
    const hasMinimal = options.some(opt => opt.tags?.includes("minimal") || opt.tags?.includes("clean"));
    const hasDetailed = options.some(opt => opt.tags?.includes("detailed") || opt.tags?.includes("rich"));
    const hasInteractive = options.some(opt => opt.tags?.includes("interactive"));
    
    // Create component styles based on selections
    return {
      header: {
        elevation: hasDetailed ? "shadowed" : "flat",
        density: hasMinimal ? "compact" : "standard"
      },
      hero: {
        imageStyle: hasDetailed ? "detailed" : "simple",
        textAlignment: hasDynamic ? "asymmetric" : "centered"
      },
      features: {
        layout: hasModern(options) ? "grid" : "row",
        iconStyle: hasMinimal ? "outline" : "filled"
      },
      cta: {
        style: hasInteractive ? "interactive" : "standard",
        size: hasDetailed ? "large" : "medium"
      }
    };
  };
  
  const deriveToneDescriptor = (
    colorOptions: VisualCalibrationOption[],
    layoutOptions: VisualCalibrationOption[],
    componentOptions: VisualCalibrationOption[]
  ): string => {
    const allTags = [
      ...colorOptions.flatMap(opt => opt.tags || []),
      ...layoutOptions.flatMap(opt => opt.tags || []),
      ...componentOptions.flatMap(opt => opt.tags || [])
    ];
    
    const tagCounts: Record<string, number> = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    // Find the most common tags
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
    
    if (sortedTags.length === 0) return "professional and modern";
    
    // Combine top tags into a tone descriptor
    const topTags = sortedTags.slice(0, 2);
    return topTags.join(" and ");
  };
  
  // Helper to check if any options have a specific tag
  const hasModern = (options: VisualCalibrationOption[]) => {
    return options.some(opt => 
      opt.tags?.includes("modern") || 
      opt.tags?.includes("grid") || 
      opt.tags?.includes("cards")
    );
  };
  
  const hasDynamic = (options: VisualCalibrationOption[]) => {
    return options.some(opt => 
      opt.tags?.includes("dynamic") || 
      opt.tags?.includes("asymmetrical") || 
      opt.tags?.includes("engaging")
    );
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'colors':
        return (
          <EnhancedVisualPicker
            options={colorOptions}
            title="Choose Color Styles"
            onCalibrationComplete={handleColorCalibration}
            category="color"
            calibrationSettings={{
              params: [
                {
                  name: "vibrancy",
                  label: "Color Vibrancy",
                  min: 0,
                  max: 10,
                  step: 1,
                  defaultValue: 5
                },
                {
                  name: "contrast",
                  label: "Color Contrast",
                  min: 0,
                  max: 10,
                  step: 1,
                  defaultValue: 5
                }
              ]
            }}
          />
        );
        
      case 'layout':
        return (
          <EnhancedVisualPicker
            options={layoutOptions}
            title="Choose Layout Styles"
            onCalibrationComplete={handleLayoutCalibration}
            category="layout"
            calibrationSettings={{
              params: [
                {
                  name: "density",
                  label: "Content Density",
                  min: 0,
                  max: 10,
                  step: 1,
                  defaultValue: 5
                },
                {
                  name: "whitespace",
                  label: "Whitespace Amount",
                  min: 0,
                  max: 10,
                  step: 1,
                  defaultValue: 5
                }
              ]
            }}
          />
        );
        
      case 'components':
        return (
          <EnhancedVisualPicker
            options={componentOptions}
            title="Choose Component Styles"
            onCalibrationComplete={handleComponentCalibration}
            category="component"
            calibrationSettings={{
              params: [
                {
                  name: "detail",
                  label: "Detail Level",
                  min: 0,
                  max: 10,
                  step: 1,
                  defaultValue: 5
                },
                {
                  name: "interactivity",
                  label: "Interactive Elements",
                  min: 0,
                  max: 10,
                  step: 1,
                  defaultValue: 5
                }
              ]
            }}
          />
        );
        
      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">Review Your Design Choices</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Review and apply your design selections to the wireframe
              </p>
            </div>
            
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="colors" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" /> Colors
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-1">
                  <Layout className="h-4 w-4" /> Layout
                </TabsTrigger>
                <TabsTrigger value="components" className="flex items-center gap-1">
                  <PenLine className="h-4 w-4" /> Components
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="colors" className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Selected Color Styles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedColorOptions.map(option => (
                    <div key={option.id} className="border rounded p-2">
                      <div className="aspect-video w-full mb-2">
                        <img 
                          src={option.imageUrl} 
                          alt={option.title}
                          className="h-full w-full object-cover rounded" 
                        />
                      </div>
                      <p className="font-medium text-sm">{option.title}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Selected Layout Styles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedLayoutOptions.map(option => (
                    <div key={option.id} className="border rounded p-2">
                      <div className="aspect-video w-full mb-2">
                        <img 
                          src={option.imageUrl} 
                          alt={option.title}
                          className="h-full w-full object-cover rounded" 
                        />
                      </div>
                      <p className="font-medium text-sm">{option.title}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="components" className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Selected Component Styles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedComponentOptions.map(option => (
                    <div key={option.id} className="border rounded p-2">
                      <div className="aspect-video w-full mb-2">
                        <img 
                          src={option.imageUrl} 
                          alt={option.title}
                          className="h-full w-full object-cover rounded" 
                        />
                      </div>
                      <p className="font-medium text-sm">{option.title}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={applyDesignToWireframe}
                disabled={isGenerating || isBaseGenerating}
              >
                <Wand2 className="h-4 w-4" />
                Apply Design to Wireframe
              </Button>
            </div>
          </div>
        );
        
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-semibold">Applying Design to Wireframe</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Please wait while we generate your design-enhanced wireframe
            </p>
          </div>
        );
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Design Calibration Engine
        </CardTitle>
        <CardDescription>
          Calibrate and apply design preferences to your wireframe
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              currentStep === 'colors' ? 'bg-primary' : 'bg-gray-300'
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full ${
              currentStep === 'layout' ? 'bg-primary' : 'bg-gray-300'
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full ${
              currentStep === 'components' ? 'bg-primary' : 'bg-gray-300'
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full ${
              currentStep === 'review' || currentStep === 'generating' ? 'bg-primary' : 'bg-gray-300'
            }`}
          ></div>
        </div>
        
        {currentStep !== 'review' && currentStep !== 'generating' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (currentStep === 'colors') {
                setCurrentStep('layout');
              } else if (currentStep === 'layout') {
                setCurrentStep('components');
              } else if (currentStep === 'components') {
                setCurrentStep('review');
              }
            }}
          >
            Skip <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DesignWireframeBridge;
