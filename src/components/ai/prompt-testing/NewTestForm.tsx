
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash } from "lucide-react";
import { AIGeneratorService } from "@/services/ai";
import { PromptVariant } from "@/services/ai/content/prompt-testing/ab-testing-service";

interface NewTestFormProps {
  onTestCreated: (testId: string) => void;
  onCancel: () => void;
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
}

interface NewTestData {
  name: string;
  description: string;
  contentType: string;
  variants: Array<{
    name: string;
    promptText: string;
    systemPrompt: string;
    isControl: boolean;
    weight: number;
  }>;
}

export const NewTestForm = ({ onTestCreated, onCancel, isCreating, setIsCreating }: NewTestFormProps) => {
  const { toast } = useToast();
  const [newTest, setNewTest] = useState<NewTestData>({
    name: '',
    description: '',
    contentType: 'header',
    variants: [
      {
        name: 'Control',
        promptText: '',
        systemPrompt: '',
        isControl: true,
        weight: 1
      },
      {
        name: 'Variant A',
        promptText: '',
        systemPrompt: '',
        isControl: false,
        weight: 1
      }
    ]
  });

  const handleCreateTest = async () => {
    if (!newTest.name || newTest.variants.some(v => !v.promptText)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    setIsCreating(true);
    try {
      const testId = await AIGeneratorService.createPromptTest(
        newTest.name,
        newTest.contentType,
        newTest.variants,
        newTest.description
      );
      
      if (testId) {
        toast({
          title: "Test Created",
          description: "A/B prompt test has been created successfully."
        });
        
        onTestCreated(testId);
        
        setNewTest({
          name: '',
          description: '',
          contentType: 'header',
          variants: [
            {
              name: 'Control',
              promptText: '',
              systemPrompt: '',
              isControl: true,
              weight: 1
            },
            {
              name: 'Variant A',
              promptText: '',
              systemPrompt: '',
              isControl: false,
              weight: 1
            }
          ]
        });
      } else {
        throw new Error("Failed to create test");
      }
    } catch (error) {
      console.error("Error creating prompt test:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Test",
        description: "Could not create A/B prompt test."
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleAddVariant = () => {
    setNewTest({
      ...newTest,
      variants: [
        ...newTest.variants,
        {
          name: `Variant ${String.fromCharCode(65 + newTest.variants.length - 1)}`,
          promptText: '',
          systemPrompt: '',
          isControl: false,
          weight: 1
        }
      ]
    });
  };
  
  const handleRemoveVariant = (index: number) => {
    if (newTest.variants.length <= 2) {
      toast({
        variant: "destructive",
        title: "Cannot Remove Variant",
        description: "A test must have at least two variants."
      });
      return;
    }
    
    const newVariants = [...newTest.variants];
    newVariants.splice(index, 1);
    
    setNewTest({
      ...newTest,
      variants: newVariants
    });
  };
  
  const handleUpdateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...newTest.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    };
    
    setNewTest({
      ...newTest,
      variants: newVariants
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New A/B Prompt Test</CardTitle>
        <CardDescription>
          Create multiple prompt variations to test which generates the best results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-name">Test Name</Label>
              <Input 
                id="test-name" 
                value={newTest.name}
                onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                placeholder="e.g., Tagline Generation Test"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select 
                value={newTest.contentType}
                onValueChange={(value) => setNewTest({...newTest, contentType: value})}
              >
                <SelectTrigger id="content-type">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="tagline">Tagline</SelectItem>
                  <SelectItem value="cta">Call to Action</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-description">Description (Optional)</Label>
            <Textarea 
              id="test-description" 
              value={newTest.description}
              onChange={(e) => setNewTest({...newTest, description: e.target.value})}
              placeholder="Describe the purpose of this test"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Prompt Variants</h3>
              <Button 
                onClick={handleAddVariant} 
                variant="outline" 
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Variant
              </Button>
            </div>
            
            {newTest.variants.map((variant, index) => (
              <VariantCard 
                key={index}
                variant={variant}
                index={index}
                onUpdateVariant={handleUpdateVariant}
                onRemoveVariant={handleRemoveVariant}
                totalVariants={newTest.variants.length}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateTest} 
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Test...
                </>
              ) : "Create A/B Test"}
            </Button>
            <Button 
              onClick={onCancel}
              variant="outline"
              disabled={isCreating}
              className="flex-shrink-0"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface VariantCardProps {
  variant: {
    name: string;
    promptText: string;
    systemPrompt: string;
    isControl: boolean;
    weight: number;
  };
  index: number;
  onUpdateVariant: (index: number, field: string, value: any) => void;
  onRemoveVariant: (index: number) => void;
  totalVariants: number;
}

const VariantCard = ({ variant, index, onUpdateVariant, onRemoveVariant, totalVariants }: VariantCardProps) => {
  return (
    <Card key={index} className="border-2 border-dashed">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Input 
              value={variant.name}
              onChange={(e) => onUpdateVariant(index, 'name', e.target.value)}
              className="max-w-[200px] font-semibold"
            />
            {variant.isControl && (
              <Badge className="ml-2" variant="outline">Control</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`is-control-${index}`} className="text-xs">Control</Label>
              <Switch 
                id={`is-control-${index}`}
                checked={variant.isControl}
                onCheckedChange={(checked) => {
                  if (checked) {
                    // Reset all other variants to non-control
                    for (let i = 0; i < totalVariants; i++) {
                      if (i !== index) {
                        onUpdateVariant(i, 'isControl', false);
                      }
                    }
                    onUpdateVariant(index, 'isControl', true);
                  } else {
                    onUpdateVariant(index, 'isControl', false);
                  }
                }}
                disabled={variant.isControl && totalVariants > 1}
              />
            </div>
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={() => onRemoveVariant(index)}
              disabled={totalVariants <= 2}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`prompt-text-${index}`}>Prompt Text</Label>
            <Textarea 
              id={`prompt-text-${index}`}
              value={variant.promptText}
              onChange={(e) => onUpdateVariant(index, 'promptText', e.target.value)}
              placeholder="Enter the prompt text for this variant"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Use &#123;&#123;type&#125;&#125;, &#123;&#123;tone&#125;&#125;, &#123;&#123;context&#125;&#125;, &#123;&#123;keywords&#125;&#125;, and &#123;&#123;maxLength&#125;&#125; as placeholders.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`system-prompt-${index}`}>System Prompt (Optional)</Label>
            <Textarea 
              id={`system-prompt-${index}`}
              value={variant.systemPrompt}
              onChange={(e) => onUpdateVariant(index, 'systemPrompt', e.target.value)}
              placeholder="Enter the system prompt for this variant"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`weight-${index}`}>Weight: {variant.weight}</Label>
            <input
              id={`weight-${index}`}
              type="range"
              min="1"
              max="10"
              value={variant.weight}
              onChange={(e) => onUpdateVariant(index, 'weight', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Higher weights increase the frequency this variant is tested.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
