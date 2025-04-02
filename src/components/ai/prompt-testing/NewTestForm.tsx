
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AIGeneratorService } from "@/services/ai";
import { TestFormHeader } from "./form/TestFormHeader";
import { VariantsList } from "./form/VariantsList";
import { FormActions } from "./form/FormActions";
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
          <TestFormHeader 
            name={newTest.name}
            contentType={newTest.contentType}
            description={newTest.description}
            onNameChange={(value) => setNewTest({...newTest, name: value})}
            onContentTypeChange={(value) => setNewTest({...newTest, contentType: value})}
            onDescriptionChange={(value) => setNewTest({...newTest, description: value})}
          />
          
          <VariantsList 
            variants={newTest.variants}
            onAddVariant={handleAddVariant}
            onUpdateVariant={handleUpdateVariant}
            onRemoveVariant={handleRemoveVariant}
          />
          
          <FormActions 
            isCreating={isCreating}
            onCancel={onCancel}
            onSubmit={handleCreateTest}
          />
        </div>
      </CardContent>
    </Card>
  );
};
