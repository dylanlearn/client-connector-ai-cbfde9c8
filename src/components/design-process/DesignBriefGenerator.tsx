
import React, { useState } from 'react';
import { useDesignProcess } from '@/contexts/design-process/DesignProcessProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LayoutPanelLeft, Users, Sparkles, Target, Lightbulb, Wand2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DesignBriefGenerator: React.FC = () => {
  const { intakeData, designBrief, generateWireframe } = useDesignProcess();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  
  if (!intakeData || !designBrief) {
    return (
      <Card className="w-full max-w-5xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg text-center text-gray-500">No design brief has been generated yet.</p>
            <p className="text-sm text-center text-gray-400 mt-2">
              Complete the intake form to generate a design brief.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Derive some design attributes from the intake data
  const colorScheme = intakeData.colorPreferences || 'neutral';
  const designStyle = intakeData.designStyle || 'modern';
  
  // Generate tone and personality based on design style
  const getToneAndPersonality = (style: string) => {
    switch (style) {
      case 'minimal':
        return ['clean', 'efficient', 'straightforward'];
      case 'modern':
        return ['contemporary', 'innovative', 'sleek'];
      case 'bold':
        return ['confident', 'dynamic', 'striking'];
      case 'playful':
        return ['friendly', 'energetic', 'approachable'];
      case 'classic':
        return ['timeless', 'sophisticated', 'elegant'];
      case 'corporate':
        return ['professional', 'trustworthy', 'reliable'];
      default:
        return ['balanced', 'versatile', 'appropriate'];
    }
  };
  
  const toneAndPersonality = getToneAndPersonality(designStyle);
  
  // Generate recommended components based on goals
  const getRecommendedComponents = () => {
    const components = ['navigation', 'hero'];
    const goals = intakeData.mainFeatures?.toLowerCase() || '';
    
    if (goals.includes('newsletter') || goals.includes('sign up') || goals.includes('lead')) {
      components.push('email-capture', 'benefits-list');
    }
    
    if (goals.includes('purchase') || goals.includes('buy') || goals.includes('shop')) {
      components.push('product-showcase', 'pricing-table', 'testimonials');
    }
    
    if (goals.includes('consult') || goals.includes('book') || goals.includes('appointment')) {
      components.push('booking-form', 'about-team', 'process-steps');
    }
    
    components.push('call-to-action', 'footer');
    
    return components;
  };
  
  const recommendedComponents = getRecommendedComponents();
  
  const handleExportPDF = () => {
    setIsExporting(true);
    
    // Simulate PDF export
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Design brief exported",
        description: "Your design brief has been exported as a PDF."
      });
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{designBrief.title}</CardTitle>
            <CardDescription className="mt-2">
              AI-generated design brief based on your preferences and business goals
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleExportPDF} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-1">
        <div className="px-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center">
              <LayoutPanelLeft className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Audience
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="conversion" className="flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Conversion
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="overview">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Project Summary</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {designBrief.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Design Approach</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Based on the project requirements and target audience, we recommend a 
                  <span className="font-medium"> {designStyle} design style</span> with a 
                  <span className="font-medium"> {colorScheme} color scheme</span>. This approach 
                  will create a website that feels {toneAndPersonality.join(', ')}, which aligns 
                  with your brand identity and business goals.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Key Components</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recommendedComponents.map((component) => (
                    <Badge key={component} variant="outline" className="capitalize">
                      {component.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audience">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Target Audience</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {designBrief.targetAudience}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">User Personas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium text-base mb-2">Primary User</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        The main target audience as described in your intake form.
                      </p>
                      <p className="text-sm">
                        Looking for: Solutions that address their specific needs efficiently.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium text-base mb-2">Secondary User</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Decision-makers or influencers in the purchase process.
                      </p>
                      <p className="text-sm">
                        Looking for: Value, credibility, and reasons to trust your brand.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">User Flow</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Visitors arrive through organic search or direct traffic</li>
                  <li>Engage with hero section to understand value proposition</li>
                  <li>Browse through content/product offerings</li>
                  <li>Encounter strategically placed call-to-actions</li>
                  <li>Complete primary conversion goal ({intakeData.mainFeatures?.split(',')[0]})</li>
                </ol>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="branding">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Brand Personality</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {toneAndPersonality.map((trait) => (
                    <Badge key={trait} className="capitalize">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Visual Language</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {/* Color scheme placeholder - in a real implementation this would show actual color swatches */}
                      <div className="w-8 h-8 rounded bg-blue-500"></div>
                      <div className="w-8 h-8 rounded bg-blue-700"></div>
                      <div className="w-8 h-8 rounded bg-gray-100"></div>
                      <div className="w-8 h-8 rounded bg-gray-800"></div>
                      <div className="w-8 h-8 rounded bg-amber-500"></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Typography</p>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">Heading Font</p>
                      <p className="text-base">Body Font</p>
                      <p className="text-sm italic">Accent Font</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Content Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Tone of Voice</p>
                    <p className="text-sm">
                      Communication should be {toneAndPersonality.join(', ')}, 
                      focusing on benefits and outcomes rather than features.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Imagery Style</p>
                    <p className="text-sm">
                      Images should reflect the {designStyle} aesthetic with
                      {colorScheme === 'neutral' ? ' balanced and natural tones' : 
                       ' emphasis on ' + colorScheme + ' color accents'}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="conversion">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Conversion Goals</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-base">Primary Goal</h4>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {intakeData.mainFeatures?.split(',')[0] || 'Not specified'}
                    </p>
                  </div>
                  
                  {intakeData.mainFeatures?.split(',')[1] && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-base">Secondary Goal</h4>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {intakeData.mainFeatures?.split(',')[1]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Recommended CTA Strategy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Primary CTA</p>
                    <Badge className="mb-2">
                      {
                        intakeData.mainFeatures?.toLowerCase().includes('sign') ? 'Sign Up Now' :
                        intakeData.mainFeatures?.toLowerCase().includes('book') ? 'Book Consultation' :
                        intakeData.mainFeatures?.toLowerCase().includes('purchase') ? 'Shop Now' :
                        'Get Started'
                      }
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Placement: Hero section, end of key content sections
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Secondary CTA</p>
                    <Badge variant="outline" className="mb-2">
                      {
                        intakeData.mainFeatures?.toLowerCase().includes('sign') ? 'Learn More' :
                        intakeData.mainFeatures?.toLowerCase().includes('book') ? 'View Services' :
                        intakeData.mainFeatures?.toLowerCase().includes('purchase') ? 'View Details' :
                        'Contact Us'
                      }
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Placement: Navigation, content sections, footer
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Next Steps</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Based on this design brief, our AI can now generate wireframes that align with your goals and preferences.
                </p>
                
                <Button onClick={generateWireframe} className="flex items-center">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Wireframes
                </Button>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default DesignBriefGenerator;
