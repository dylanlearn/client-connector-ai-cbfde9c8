
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedWireframe } from '@/hooks/use-advanced-wireframe';
import { Switch } from '@/components/ui/switch';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WireframeVisualizer from './WireframeVisualizer';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

const WireframeTest: React.FC = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<string>('Create a landing page for a cloud storage service');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState<WireframeData | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('prompt');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt Required',
        description: 'Please enter a prompt to generate a wireframe',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Mock wireframe generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple wireframe data structure
      const generatedWireframe: WireframeData = {
        id: uuidv4(),
        title: 'Generated Wireframe',
        description: prompt,
        sections: [
          {
            id: uuidv4(),
            name: 'Header',
            sectionType: 'header',
            components: [
              {
                id: uuidv4(),
                type: 'text',
                content: 'Company Logo',
                style: { 
                  fontSize: '24px', 
                  fontWeight: 'bold' 
                }
              },
              {
                id: uuidv4(),
                type: 'navigation',
                content: ['Home', 'Features', 'Pricing', 'Contact'],
                style: {
                  display: 'flex',
                  justifyContent: 'space-between'
                }
              }
            ]
          },
          {
            id: uuidv4(),
            name: 'Hero',
            sectionType: 'hero',
            components: [
              {
                id: uuidv4(),
                type: 'text',
                content: 'Cloud Storage Solution',
                style: {
                  fontSize: '36px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }
              },
              {
                id: uuidv4(),
                type: 'text',
                content: 'Secure, reliable, and easy to use cloud storage for all your needs.',
                style: {
                  fontSize: '18px',
                  textAlign: 'center'
                }
              },
              {
                id: uuidv4(),
                type: 'button',
                content: 'Get Started',
                style: {
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '5px'
                }
              }
            ]
          }
        ],
        colorScheme: {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#111827'
        },
        typography: {
          headings: 'sans-serif',
          body: 'sans-serif'
        },
        style: 'modern'
      };
      
      setWireframe(generatedWireframe);
      toast({
        title: 'Wireframe Generated',
        description: 'Your wireframe has been created successfully'
      });
    } catch (error) {
      console.error('Error generating wireframe:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate wireframe. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="wireframe-test-container p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Wireframe Test</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <Select value={deviceType} onValueChange={(value: 'desktop' | 'tablet' | 'mobile') => setDeviceType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="prompt" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Wireframe Prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the wireframe you want to generate..."
                  className="min-h-[100px]"
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Wireframe'
                )}
              </Button>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Complexity</Label>
                  <Slider 
                    defaultValue={[50]} 
                    max={100} 
                    step={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Style</Label>
                  <RadioGroup defaultValue="modern">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="modern" id="modern" />
                      <Label htmlFor="modern">Modern</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="classic" id="classic" />
                      <Label htmlFor="classic">Classic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimal" id="minimal" />
                      <Label htmlFor="minimal">Minimal</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Elements</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="header" defaultChecked />
                      <Label htmlFor="header">Header</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hero" defaultChecked />
                      <Label htmlFor="hero">Hero</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="features" defaultChecked />
                      <Label htmlFor="features">Features</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="footer" defaultChecked />
                      <Label htmlFor="footer">Footer</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {wireframe && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <WireframeVisualizer
              wireframe={wireframe}
              darkMode={darkMode}
              deviceType={deviceType}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WireframeTest;
