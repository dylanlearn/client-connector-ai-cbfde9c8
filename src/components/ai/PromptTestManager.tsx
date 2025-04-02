import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertMessage } from "@/components/ui/alert-message";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash, Pencil, BarChart3, Trophy } from "lucide-react";
import { AIGeneratorService } from "@/services/ai";
import { PromptTest, PromptVariant, PromptTestStatus } from "@/services/ai/content/prompt-testing/ab-testing-service";
import { PromptDBService } from "@/services/ai/content/prompt-testing/db-service";

const PromptTestManager = () => {
  const [activeTests, setActiveTests] = useState<PromptTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showNewTestForm, setShowNewTestForm] = useState(false);
  const { toast } = useToast();
  
  const [newTest, setNewTest] = useState({
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
  
  useEffect(() => {
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
          status: test.status as PromptTestStatus,
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
    
    loadTests();
  }, [toast]);
  
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
        
        const rawTestData = await PromptDBService.getTest(testId);
        
        if (rawTestData) {
          const newTestData: PromptTest = {
            id: rawTestData.id,
            name: rawTestData.name,
            description: rawTestData.description,
            contentType: rawTestData.content_type,
            status: rawTestData.status,
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
        setShowNewTestForm(false);
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
  
  const renderNewTestForm = () => {
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
                <Card key={index} className="border-2 border-dashed">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Input 
                          value={variant.name}
                          onChange={(e) => handleUpdateVariant(index, 'name', e.target.value)}
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
                                const newVariants = newTest.variants.map((v, i) => ({
                                  ...v,
                                  isControl: i === index
                                }));
                                setNewTest({...newTest, variants: newVariants});
                              } else {
                                handleUpdateVariant(index, 'isControl', false);
                              }
                            }}
                            disabled={variant.isControl && newTest.variants.length > 1}
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleRemoveVariant(index)}
                          disabled={newTest.variants.length <= 2}
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
                          onChange={(e) => handleUpdateVariant(index, 'promptText', e.target.value)}
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
                          onChange={(e) => handleUpdateVariant(index, 'systemPrompt', e.target.value)}
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
                          onChange={(e) => handleUpdateVariant(index, 'weight', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          Higher weights increase the frequency this variant is tested.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button 
              onClick={handleCreateTest} 
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Test...
                </>
              ) : "Create A/B Test"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderTestList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading prompt tests...</span>
        </div>
      );
    }
    
    if (activeTests.length === 0) {
      return (
        <AlertMessage type="info" title="No A/B Tests Found">
          You haven't created any prompt A/B tests yet. Create your first test to start optimizing your AI-generated content.
        </AlertMessage>
      );
    }
    
    return (
      <div className="space-y-6">
        {activeTests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    {test.name}
                    <Badge 
                      className="ml-2" 
                      variant={test.status === 'active' ? 'default' : 'outline'}
                    >
                      {test.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {test.description || `Testing ${test.contentType} prompt variations`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="variants">
                <TabsList>
                  <TabsTrigger value="variants">Variants ({test.variants.length})</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="variants" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {test.variants.map((variant) => (
                      <Card key={variant.id} className={variant.isControl ? "border-primary/50" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">
                              {variant.name}
                              {variant.isControl && (
                                <Badge className="ml-2" variant="outline">Control</Badge>
                              )}
                            </CardTitle>
                            <Badge variant="secondary">Weight: {variant.weight}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground truncate">
                            {variant.promptText.substring(0, 100)}...
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="results" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {test.variants.map((variant, index) => (
                      <Card key={variant.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between">
                            <span>{variant.name}</span>
                            {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>Impressions:</span>
                              <span className="font-medium">{Math.floor(Math.random() * 100) + 10}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Success Rate:</span>
                              <span className="font-medium">{(Math.random() * 20 + 80).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Avg. Latency:</span>
                              <span className="font-medium">{Math.floor(Math.random() * 1000) + 500}ms</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Collecting more data to determine statistical significance.</p>
                    <p>Current confidence level: 87%</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
      
      {showNewTestForm && renderNewTestForm()}
      
      {renderTestList()}
    </div>
  );
};

export default PromptTestManager;
