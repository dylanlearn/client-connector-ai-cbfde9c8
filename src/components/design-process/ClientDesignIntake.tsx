
import React, { useState } from 'react';
import { useDesignProcess } from '@/contexts/design-process/DesignProcessProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ArrowRight, Wand2 } from 'lucide-react';
import { VisualPicker } from '../design/VisualPicker';
import { useToast } from '@/hooks/use-toast';

// Sample design style options
const DESIGN_STYLES = [
  { id: 'minimal', title: 'Minimal', description: 'Clean, simple, and uncluttered', imageUrl: '/design-styles/minimal.jpg' },
  { id: 'modern', title: 'Modern', description: 'Contemporary and cutting-edge', imageUrl: '/design-styles/modern.jpg' },
  { id: 'bold', title: 'Bold', description: 'Strong, vibrant, and impactful', imageUrl: '/design-styles/bold.jpg' },
  { id: 'playful', title: 'Playful', description: 'Fun, energetic, and approachable', imageUrl: '/design-styles/playful.jpg' },
  { id: 'classic', title: 'Classic', description: 'Timeless, traditional, and elegant', imageUrl: '/design-styles/classic.jpg' },
  { id: 'corporate', title: 'Corporate', description: 'Professional, trustworthy, and established', imageUrl: '/design-styles/corporate.jpg' },
];

// Sample color scheme options
const COLOR_SCHEMES = [
  { id: 'blue', title: 'Blue Professional', description: 'Trustworthy and calm', imageUrl: '/color-schemes/blue.jpg' },
  { id: 'green', title: 'Green Natural', description: 'Fresh and growth-oriented', imageUrl: '/color-schemes/green.jpg' },
  { id: 'purple', title: 'Purple Creative', description: 'Imaginative and luxurious', imageUrl: '/color-schemes/purple.jpg' },
  { id: 'red', title: 'Red Energetic', description: 'Bold and passionate', imageUrl: '/color-schemes/red.jpg' },
  { id: 'neutral', title: 'Neutral Versatile', description: 'Balanced and timeless', imageUrl: '/color-schemes/neutral.jpg' },
];

const ClientDesignIntake: React.FC = () => {
  const { updateIntakeData, intakeData, generateDesignBrief } = useDesignProcess();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basics');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColorScheme, setSelectedColorScheme] = useState<string | null>(null);
  
  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    updateIntakeData({
      projectName: formData.get('projectName') as string,
      projectDescription: formData.get('projectDescription') as string,
      targetAudience: formData.get('targetAudience') as string,
    });
    
    setActiveTab('preferences');
    
    toast({
      title: "Information saved",
      description: "Your project details have been saved."
    });
  };
  
  const handleStyleSelection = (styleId: string) => {
    setSelectedStyle(styleId);
    updateIntakeData({ designStyle: styleId });
    
    toast({
      title: "Design style selected",
      description: `You've selected the ${styleId} design style.`
    });
  };
  
  const handleColorSchemeSelection = (schemeId: string) => {
    setSelectedColorScheme(schemeId);
    updateIntakeData({ colorPreferences: schemeId });
    
    toast({
      title: "Color scheme selected",
      description: `You've selected the ${schemeId} color scheme.`
    });
  };
  
  const handleConversionGoalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    updateIntakeData({
      mainFeatures: formData.get('conversionGoals') as string,
      additionalNotes: formData.get('additionalPreferences') as string,
    });
    
    toast({
      title: "Conversion goals saved",
      description: "Your conversion goals and preferences have been saved."
    });
    
    // Move to the next step in the design process
    generateDesignBrief();
  };
  
  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Design Preferences</CardTitle>
        <CardDescription>
          Help us understand your design vision to create a website that converts visitors into customers.
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basics" className="flex items-center gap-2">
              {activeTab !== 'basics' && activeTab !== 'preferences' && activeTab !== 'conversion' ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : null}
              Project Basics
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2" disabled={!intakeData?.projectName}>
              {activeTab !== 'preferences' && activeTab !== 'conversion' ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : null}
              Visual Preferences
            </TabsTrigger>
            <TabsTrigger value="conversion" className="flex items-center gap-2" disabled={!selectedStyle || !selectedColorScheme}>
              {activeTab !== 'conversion' ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : null}
              Conversion Goals
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <TabsContent value="basics">
            <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input 
                  id="projectName" 
                  name="projectName" 
                  placeholder="e.g., Modern Fitness Studio Website" 
                  defaultValue={intakeData?.projectName || ''}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea 
                  id="projectDescription" 
                  name="projectDescription" 
                  placeholder="Briefly describe your project and its main purpose..."
                  defaultValue={intakeData?.projectDescription || ''}
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea 
                  id="targetAudience" 
                  name="targetAudience" 
                  placeholder="Describe who your ideal visitors/customers are..."
                  defaultValue={intakeData?.targetAudience || ''}
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit">
                  Continue to Visual Preferences
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select a Design Style</h3>
                <VisualPicker
                  options={DESIGN_STYLES}
                  selectedId={selectedStyle}
                  onSelect={handleStyleSelection}
                  fullWidth
                />
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Select a Color Scheme</h3>
                <VisualPicker
                  options={COLOR_SCHEMES}
                  selectedId={selectedColorScheme}
                  onSelect={handleColorSchemeSelection}
                  fullWidth
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setActiveTab('conversion')} 
                  disabled={!selectedStyle || !selectedColorScheme}
                >
                  Continue to Conversion Goals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="conversion">
            <form onSubmit={handleConversionGoalsSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="conversionGoals">What actions do you want visitors to take?</Label>
                <Textarea 
                  id="conversionGoals" 
                  name="conversionGoals" 
                  placeholder="e.g., Sign up for a newsletter, Book a consultation, Make a purchase..."
                  defaultValue={intakeData?.mainFeatures || ''}
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalPreferences">Additional Preferences or Requirements</Label>
                <Textarea 
                  id="additionalPreferences" 
                  name="additionalPreferences" 
                  placeholder="Any other design preferences, inspirations, or specific requirements..."
                  defaultValue={intakeData?.additionalNotes || ''}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit" className="flex items-center">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Design Brief
                </Button>
              </div>
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ClientDesignIntake;
