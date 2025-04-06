
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { WireframeVisualizer } from '@/components/wireframe';
import { Textarea } from '@/components/ui/textarea';
import { IntakeFormData } from '@/types/intake-form';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Sample wireframe generation function (in a real app, this would connect to an API)
const generateWireframesFromIntake = (formData: IntakeFormData) => {
  // Generate wireframes based on the form data
  const siteType = formData.siteType || 'business';
  const designStyle = formData.designStyle || 'modern';
  
  // In a real implementation, this would be more sophisticated
  // and actually generate wireframes based on the form data
  return [
    {
      id: `wire-${siteType}-1`,
      title: `${designStyle.charAt(0).toUpperCase() + designStyle.slice(1)} ${siteType.charAt(0).toUpperCase() + siteType.slice(1)} Website`,
      description: `Generated based on your ${siteType} requirements with ${designStyle} style`,
      imageUrl: `/wireframes/${siteType}-${designStyle}.jpg`,
      sections: [
        { id: "hero", name: "Hero Section", description: "Main landing section with primary CTA", imageUrl: `/wireframes/sections/${siteType}-hero.jpg` },
        { id: "features", name: "Features Overview", description: "Showcase of key features", imageUrl: `/wireframes/sections/${siteType}-features.jpg` }
      ],
      version: "1.0",
      lastUpdated: new Date().toLocaleDateString()
    },
    {
      id: `wire-${siteType}-2`,
      title: `Alternative ${designStyle.charAt(0).toUpperCase() + designStyle.slice(1)} Design`,
      description: `Second option based on your ${siteType} requirements`,
      imageUrl: `/wireframes/${siteType}-${designStyle}-alt.jpg`,
      sections: [
        { id: "hero-alt", name: "Alternative Hero", description: "Different approach to the main section", imageUrl: `/wireframes/sections/${siteType}-hero-alt.jpg` },
        { id: "content", name: "Content Layout", description: "Layout for your main content", imageUrl: `/wireframes/sections/${siteType}-content.jpg` }
      ],
      version: "1.0",
      lastUpdated: new Date().toLocaleDateString()
    }
  ];
};

interface IntakeWireframeBridgeProps {
  formData: IntakeFormData;
  onComplete: (selectedWireframe: any) => void;
  onBack: () => void;
}

const IntakeWireframeBridge: React.FC<IntakeWireframeBridgeProps> = ({
  formData,
  onComplete,
  onBack
}) => {
  const [wireframes, setWireframes] = useState<any[]>([]);
  const [selectedWireframeId, setSelectedWireframeId] = useState<string | null>(formData.wireframeSelection || null);
  const [feedback, setFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  
  useEffect(() => {
    // Generate wireframes when the component mounts
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateWireframesFromIntake(formData);
      setWireframes(generated);
      
      // If a wireframe was already selected in the form data, use that
      if (formData.wireframeSelection) {
        const existingWireframe = generated.find(w => w.id === formData.wireframeSelection);
        if (existingWireframe) {
          setSelectedWireframeId(existingWireframe.id);
        }
      }
      
      setIsGenerating(false);
    }, 1500); // Simulate generation time
  }, [formData]);
  
  const selectedWireframe = wireframes.find(w => w.id === selectedWireframeId);
  
  const handleSelectWireframe = (id: string) => {
    setSelectedWireframeId(id);
    toast({
      title: "Wireframe selected",
      description: "You can now provide feedback or continue to the next step"
    });
  };
  
  const handleNext = () => {
    if (!selectedWireframe) {
      toast({
        title: "Please select a wireframe",
        description: "You need to select a wireframe before proceeding",
        variant: "destructive"
      });
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      toast({
        title: "Feedback submitted",
        description: "Your feedback will help us refine the wireframe design"
      });
    }
    
    setStep(3);
  };
  
  const handleComplete = () => {
    if (!selectedWireframe) {
      toast({
        title: "Please select a wireframe",
        description: "You need to select a wireframe before proceeding",
        variant: "destructive"
      });
      return;
    }
    
    onComplete(selectedWireframe);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Wireframe Visualization</h2>
        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">
            Step {step} of 3
          </span>
          <div className="w-24 h-2 bg-gray-200 rounded-full ml-3">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {isGenerating ? (
        <Card className="flex items-center justify-center p-8 min-h-[400px]">
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Generating wireframes based on your requirements...</p>
            <p className="text-muted-foreground mt-2">This may take a moment...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {step === 1 && (
            <>
              <p className="text-muted-foreground mb-4">
                Below are wireframe options generated based on your requirements. Select the one that best matches your vision.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {wireframes.map((wireframe) => (
                  <div 
                    key={wireframe.id} 
                    className={`cursor-pointer ${selectedWireframeId === wireframe.id ? 'ring-2 ring-primary rounded-lg' : ''}`}
                    onClick={() => handleSelectWireframe(wireframe.id)}
                  >
                    <WireframeVisualizer 
                      wireframe={wireframe} 
                      onSelect={() => handleSelectWireframe(wireframe.id)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!selectedWireframeId}>
                  Continue with Selected Design
                </Button>
              </div>
            </>
          )}
          
          {step === 2 && selectedWireframe && (
            <>
              <p className="text-muted-foreground mb-4">
                Please review the selected wireframe and provide any feedback.
              </p>
              
              <WireframeVisualizer wireframe={selectedWireframe} />
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Provide Feedback</CardTitle>
                  <CardDescription>
                    Tell us what you like or what you'd change about this design
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>I like this</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ThumbsDown className="h-4 w-4" />
                      <span>Needs changes</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Add comment</span>
                    </Button>
                  </div>
                  
                  <Textarea
                    placeholder="Share your thoughts, feedback, or requested changes..."
                    className="min-h-[120px]"
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back to Designs
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSubmitFeedback}>
                    Submit Feedback
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Continue
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {step === 3 && selectedWireframe && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Your Selection</CardTitle>
                  <CardDescription>
                    Review your selected wireframe before finalizing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                    {selectedWireframe.imageUrl ? (
                      <img 
                        src={selectedWireframe.imageUrl} 
                        alt={selectedWireframe.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">No preview</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{selectedWireframe.title}</h3>
                    <p className="text-muted-foreground">{selectedWireframe.description}</p>
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1">Included Sections:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {selectedWireframe.sections?.map((section: any) => (
                          <li key={section.id}>{section.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {feedback && (
                    <div className="text-sm text-muted-foreground mr-auto">
                      <span className="font-medium">Feedback submitted:</span> Your feedback has been recorded
                    </div>
                  )}
                </CardFooter>
              </Card>
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleComplete}>
                  Confirm Selection
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default IntakeWireframeBridge;
