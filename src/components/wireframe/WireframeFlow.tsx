
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WireframeVisualizer from './WireframeVisualizer';
import { ArrowRight, RefreshCcw, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { WireframeData } from '@/types/wireframe';

// Sample wireframe data
const sampleWireframes = [
  {
    id: "wire-1",
    title: "Modern Landing Page",
    description: "A clean, conversion-focused landing page with bold calls-to-action",
    imageUrl: "/wireframes/landing-1.jpg",
    sections: [
      { 
        id: "hero-1", 
        name: "Hero Section", 
        description: "Bold, minimal hero with single CTA", 
        imageUrl: "/wireframes/sections/hero-1.jpg",
        sectionType: "hero" 
      },
      { 
        id: "features-1", 
        name: "Feature Grid", 
        description: "3-column feature highlights with icons", 
        imageUrl: "/wireframes/sections/features-1.jpg",
        sectionType: "feature-grid" 
      },
      { 
        id: "testimonial-1", 
        name: "Testimonials", 
        description: "Customer quotes with avatars", 
        imageUrl: "/wireframes/sections/testimonials-1.jpg",
        sectionType: "testimonial" 
      }
    ],
    version: "1.0",
    lastUpdated: "2023-04-01"
  },
  {
    id: "wire-2",
    title: "E-commerce Product Page",
    description: "High-conversion product display with social proof elements",
    imageUrl: "/wireframes/ecommerce-1.jpg",
    sections: [
      { 
        id: "product-hero", 
        name: "Product Gallery", 
        description: "Large product images with thumbnails", 
        imageUrl: "/wireframes/sections/product-1.jpg",
        sectionType: "product-gallery" 
      },
      { 
        id: "product-info", 
        name: "Product Details", 
        description: "Pricing, options, and add to cart button", 
        imageUrl: "/wireframes/sections/product-2.jpg",
        sectionType: "product-info" 
      },
      { 
        id: "reviews", 
        name: "Customer Reviews", 
        description: "Star ratings and detailed reviews", 
        imageUrl: "/wireframes/sections/reviews-1.jpg",
        sectionType: "reviews" 
      }
    ],
    version: "1.2",
    lastUpdated: "2023-03-15"
  },
  {
    id: "wire-3",
    title: "SaaS Dashboard",
    description: "User-friendly dashboard with key metrics and actions",
    imageUrl: "/wireframes/dashboard-1.jpg",
    sections: [
      { 
        id: "metrics", 
        name: "Key Metrics", 
        description: "Important numbers and charts", 
        imageUrl: "/wireframes/sections/metrics-1.jpg",
        sectionType: "metrics" 
      },
      { 
        id: "activity", 
        name: "Recent Activity", 
        description: "Timeline of user actions", 
        imageUrl: "/wireframes/sections/activity-1.jpg",
        sectionType: "activity" 
      },
      { 
        id: "actions", 
        name: "Quick Actions", 
        description: "Common user tasks in card format", 
        imageUrl: "/wireframes/sections/actions-1.jpg",
        sectionType: "actions" 
      }
    ],
    version: "2.1",
    lastUpdated: "2023-03-28"
  }
];

interface WireframeFlowProps {
  projectId?: string;
  initialData?: WireframeData;
  onComplete?: (selectedWireframe: any) => void;
}

const WireframeFlow: React.FC<WireframeFlowProps> = ({
  projectId,
  initialData,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [selectedWireframeId, setSelectedWireframeId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("recommended");
  
  const selectedWireframe = sampleWireframes.find(w => w.id === selectedWireframeId);
  
  const handleSelectWireframe = (id: string) => {
    setSelectedWireframeId(id);
    toast.success("Wireframe selected");
  };
  
  const handleGenerateAlternatives = () => {
    setIsGenerating(true);
    toast.info("Generating alternative designs based on your preferences...");
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("New alternative designs generated!");
    }, 3000);
  };
  
  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      toast.error("Please provide some feedback before submitting");
      return;
    }
    
    toast.success("Feedback submitted, generating revised designs");
    setFeedback("");
    setStep(1);
  };
  
  const handleComplete = () => {
    if (selectedWireframe && onComplete) {
      onComplete(selectedWireframe);
      toast.success("Design selection confirmed!");
    } else {
      toast.error("Please select a wireframe design first");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
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
        
        <p className="text-muted-foreground">
          {step === 1 && "Browse recommended wireframes based on your intake form responses."}
          {step === 2 && "Review your selected design and provide specific feedback."}
          {step === 3 && "Confirm your wireframe selection to proceed."}
        </p>
      </div>
      
      {step === 1 && (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommended" className="space-y-8">
              {sampleWireframes.map(wireframe => (
                <WireframeVisualizer 
                  key={wireframe.id}
                  wireframe={wireframe}
                  onSelect={(id) => handleSelectWireframe(id)}
                />
              ))}
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleGenerateAlternatives}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Generating alternatives...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Generate More Alternatives
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="py-4 text-center text-muted-foreground">
              Recent wireframes will be displayed here
            </TabsContent>
            
            <TabsContent value="popular" className="py-4 text-center text-muted-foreground">
              Popular wireframes will be displayed here
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={() => setStep(2)}
              disabled={!selectedWireframeId}
            >
              Continue with Selected Design
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {step === 2 && selectedWireframe && (
        <div className="space-y-6">
          <WireframeVisualizer wireframe={selectedWireframe} />
          
          <Card>
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
                Submit for Revisions
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue to Confirmation
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {step === 3 && selectedWireframe && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Selection</CardTitle>
              <CardDescription>
                Review your selected wireframe before finalizing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                {selectedWireframe.imageUrl && (
                  <img 
                    src={selectedWireframe.imageUrl} 
                    alt={selectedWireframe.title} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedWireframe.title}</h3>
                <p className="text-muted-foreground">{selectedWireframe.description}</p>
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1">Included Sections:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {selectedWireframe.sections?.map(section => (
                      <li key={section.id}>{section.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back to Feedback
            </Button>
            <Button onClick={handleComplete}>
              Confirm Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WireframeFlow;
