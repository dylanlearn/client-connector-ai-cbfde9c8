
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, FileSymlink, Link } from 'lucide-react';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { WireframeGenerationParams } from '@/services/ai/wireframe/wireframe-service';

interface WireframeGeneratorProps {
  projectId: string;
  onWireframeGenerated?: () => void;
}

const WireframeGenerator: React.FC<WireframeGeneratorProps> = ({ 
  projectId, 
  onWireframeGenerated 
}) => {
  const [prompt, setPrompt] = useState('');
  const [industry, setIndustry] = useState('');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [style, setStyle] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  
  const { 
    isGenerating, 
    generateWireframe,
    error
  } = useWireframeGeneration();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt) return;
    
    const params: WireframeGenerationParams = {
      prompt,
      projectId,
      industry: industry || undefined,
      complexity,
      style: style || undefined,
      additionalInstructions: additionalInstructions || undefined
    };
    
    const result = await generateWireframe(params);
    
    if (result && onWireframeGenerated) {
      onWireframeGenerated();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Wireframe Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                Describe what you want to create
              </label>
              <Textarea
                id="prompt"
                placeholder="Describe the wireframe you want to generate, e.g., 'A landing page for a fitness app with a hero section, features, and pricing'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full resize-none"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-1">
                  Industry
                </label>
                <Input
                  id="industry"
                  placeholder="e.g., SaaS, E-commerce, Healthcare"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="complexity" className="block text-sm font-medium mb-1">
                  Complexity
                </label>
                <Select 
                  value={complexity} 
                  onValueChange={(value: 'simple' | 'medium' | 'complex') => setComplexity(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="complex">Complex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label htmlFor="style" className="block text-sm font-medium mb-1">
                Design Style (Optional)
              </label>
              <Input
                id="style"
                placeholder="e.g., Minimalist, Modern, Corporate, Playful"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="additionalInstructions" className="block text-sm font-medium mb-1">
                Additional Instructions (Optional)
              </label>
              <Textarea
                id="additionalInstructions"
                placeholder="Any specific requirements or preferences"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                rows={2}
                className="w-full resize-none"
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-800 text-sm rounded-md">
              {error.message}
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={!prompt || isGenerating}
              className="flex items-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Wireframe
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WireframeGenerator;
