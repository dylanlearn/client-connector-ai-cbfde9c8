
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PromptTest, PromptTestStatus } from '@/services/ai/content/prompt-testing/ab-testing-service';
import { PromptDBService } from '@/services/ai/content/prompt-testing/db-service';
import { NewTestForm } from './NewTestForm';
import { TestsList } from './TestsList';

const PromptTestManager = () => {
  const [activeTests, setActiveTests] = useState<PromptTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showNewTestForm, setShowNewTestForm] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    loadTests();
  }, []);
  
  const loadTests = async () => {
    setIsLoading(true);
    try {
      const rawTestsData = await PromptDBService.getAllTests();
      
      if (!rawTestsData) {
        setActiveTests([]);
        return;
      }
      
      const formattedTests: PromptTest[] = rawTestsData.map((test: any) => ({
        id: test.id,
        name: test.name,
        description: test.description,
        contentType: test.content_type,
        status: test.status as PromptTestStatus, // Fix type error here
        variants: test.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          promptText: v.prompt_text,
          systemPrompt: v.system_prompt,
          isControl: v.is_control,
          weight: v.weight
        })),
        createdAt: test.created_at,
        updatedAt: test.updated_at,
        minSampleSize: test.min_sample_size,
        confidenceThreshold: test.confidence_threshold
      }));
      
      setActiveTests(formattedTests);
    } catch (error) {
      console.error("Error loading prompt tests:", error);
      toast({
        variant: "destructive",
        title: "Error Loading Tests",
        description: "Could not load A/B prompt tests."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestCreated = async (testId: string) => {
    const rawTestData = await PromptDBService.getTest(testId);
    
    if (rawTestData) {
      const newTestData: PromptTest = {
        id: rawTestData.id,
        name: rawTestData.name,
        description: rawTestData.description,
        contentType: rawTestData.content_type,
        status: rawTestData.status as PromptTestStatus,
        variants: rawTestData.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          promptText: v.prompt_text,
          systemPrompt: v.system_prompt,
          isControl: v.is_control,
          weight: v.weight
        })),
        createdAt: rawTestData.created_at,
        updatedAt: rawTestData.updated_at,
        minSampleSize: rawTestData.min_sample_size,
        confidenceThreshold: rawTestData.confidence_threshold
      };
      
      setActiveTests([newTestData, ...activeTests]);
    }
    
    setShowNewTestForm(false);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">A/B Prompt Testing</h2>
        <Button 
          onClick={() => setShowNewTestForm(!showNewTestForm)} 
          variant={showNewTestForm ? "outline" : "default"}
        >
          {showNewTestForm ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> New Test</>}
        </Button>
      </div>
      
      {showNewTestForm && (
        <NewTestForm 
          onTestCreated={handleTestCreated}
          onCancel={() => setShowNewTestForm(false)}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
        />
      )}
      
      <TestsList tests={activeTests} isLoading={isLoading} />
    </div>
  );
};

export default PromptTestManager;
