import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { IntakeFormData } from '@/types/intake-form';
import { toast } from 'sonner';
import WireframeFlow from '../wireframe/WireframeFlow';
import { Loader2, ArrowRight, Check } from 'lucide-react';
import { WireframeData } from '@/types/wireframe';
import { v4 as uuidv4 } from 'uuid';

interface IntakeWireframeBridgeProps {
  intakeData: IntakeFormData;
  onComplete?: (wireframeData: WireframeData) => void;
}

const IntakeWireframeBridge: React.FC<IntakeWireframeBridgeProps> = ({
  intakeData,
  onComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [wireframeData, setWireframeData] = useState<WireframeData | null>(null);
  const [showWireframeFlow, setShowWireframeFlow] = useState(false);
  
  const handleGenerateWireframes = async () => {
    if (!intakeData.projectName || !intakeData.projectDescription) {
      toast("Project information is incomplete", {
        description: "Please complete the intake form with at least project name and description"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate API call to generate wireframes
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsGenerating(false);
      setShowWireframeFlow(true);
      
      toast("Wireframe recommendations generated", {
        description: "Based on your project requirements and design preferences"
      });
      
    } catch (error) {
      setIsGenerating(false);
      toast("Failed to generate wireframes");
      console.error(error);
    }
  };
  
  const handleWireframeSelected = (selectedWireframe: any) => {
    // Convert the selected wireframe to WireframeData format
    const wireframeData: WireframeData = {
      id: selectedWireframe.id || uuidv4(), // Ensure we have an ID
      title: selectedWireframe.title || 'Untitled Wireframe',
      description: selectedWireframe.description || '',
      sections: selectedWireframe.sections?.map((s: any) => ({
        id: s.id || uuidv4(),
        name: s.name || s.type || '',
        sectionType: s.sectionType || s.type || 'section',
        description: s.description || s.content || '',
        componentVariant: s.componentVariant || 'default',
        imageUrl: s.imageUrl || ''
      })) || [],
      colorScheme: {
        primary: intakeData.primaryColor || '#3b82f6',
        secondary: intakeData.secondaryColor || '#10b981',
        accent: '#8b5cf6',
        background: '#ffffff',
        text: '#000000'
      },
      typography: {
        headings: intakeData.fontStyle || 'modern',
        body: 'sans-serif',
        fontPairings: ['Inter', 'Roboto']
      },
      style: intakeData.designStyle || 'modern'
    };
    
    setWireframeData(wireframeData);
    
    if (onComplete) {
      onComplete(wireframeData);
    }
  };
  
  // If wireframe selection is complete, show confirmation
  if (wireframeData) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-800 rounded-full">
              <Check className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <CardTitle>Wireframe Selection Complete</CardTitle>
          </div>
          <CardDescription>
            You&apos;ve successfully selected a wireframe design based on your project requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{wireframeData.title}</h3>
              <p className="text-muted-foreground">{wireframeData.description}</p>
            </div>
            
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {wireframeData.imageUrl && (
                <img 
                  src={wireframeData.imageUrl} 
                  alt={wireframeData.title || 'Selected wireframe'} 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Design Style</p>
                <p className="text-muted-foreground capitalize">{wireframeData.style}</p>
              </div>
              <div>
                <p className="font-medium">Typography</p>
                <p className="text-muted-foreground capitalize">{wireframeData.typography?.headings}</p>
              </div>
              <div>
                <p className="font-medium">Color Scheme</p>
                <div className="flex gap-1 mt-1">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: wireframeData.colorScheme?.primary }} />
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: wireframeData.colorScheme?.secondary }} />
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: wireframeData.colorScheme?.accent }} />
                </div>
              </div>
              <div>
                <p className="font-medium">Sections</p>
                <p className="text-muted-foreground">{wireframeData.sections?.length || 0} sections included</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30">
          <div className="w-full text-center">
            <Button>
              Continue to Development
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  // Show wireframe flow if generation is complete
  if (showWireframeFlow) {
    return <WireframeFlow onComplete={handleWireframeSelected} />;
  }
  
  // Otherwise show the initial card to generate wireframes
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Wireframe Designs</CardTitle>
        <CardDescription>
          We&apos;ll create wireframe designs based on your project requirements and design preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Project Summary</h3>
          <dl className="space-y-2 text-sm">
            <div className="grid grid-cols-3">
              <dt className="font-medium">Project Name:</dt>
              <dd className="col-span-2">{intakeData.projectName || 'Not specified'}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="font-medium">Site Type:</dt>
              <dd className="col-span-2 capitalize">{intakeData.siteType || 'Not specified'}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="font-medium">Design Style:</dt>
              <dd className="col-span-2 capitalize">{intakeData.designStyle || 'Not specified'}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="font-medium">Priority:</dt>
              <dd className="col-span-2 capitalize">{intakeData.conversionPriority || 'Not specified'}</dd>
            </div>
          </dl>
        </div>
        
        <p className="text-muted-foreground text-sm">
          Our AI will analyze your requirements and generate multiple wireframe options that match your design preferences
          and conversion goals. You&apos;ll be able to select, customize, and provide feedback on the generated wireframes.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleGenerateWireframes} 
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Wireframes...
            </>
          ) : (
            <>
              Generate Wireframe Designs
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IntakeWireframeBridge;
