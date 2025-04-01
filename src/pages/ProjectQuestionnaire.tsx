
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Plus, Trash2, Settings, LinkIcon, Copy } from "lucide-react";

const defaultQuestions = [
  {
    id: "q1",
    question: "What is the main purpose of your website?",
    type: "text",
    required: true,
    active: true,
  },
  {
    id: "q2",
    question: "Who is your target audience?",
    type: "text",
    required: true,
    active: true,
  },
  {
    id: "q3",
    question: "What are the main goals you want to achieve with this website?",
    type: "text",
    required: true,
    active: true,
  },
  {
    id: "q4",
    question: "List 3-5 websites that you like the style of and explain why.",
    type: "text",
    required: true,
    active: true,
  },
  {
    id: "q5",
    question: "What are your brand colors? Please provide hex codes if available.",
    type: "text",
    required: false,
    active: true,
  },
];

// Mock function to simulate beautiful-dnd since we can't install it
const mockBeautifulDnd = () => {
  return {
    DragDropContext: ({ children, onDragEnd }: any) => <div>{children}</div>,
    Droppable: ({ children }: any) => <div>{children({ innerRef: null, droppableProps: {}, placeholder: null })}</div>,
    Draggable: ({ children }: any) => <div>{children({ innerRef: null, draggableProps: {}, dragHandleProps: {} })}</div>,
  };
};

// Use mock functions since we can't actually install react-beautiful-dnd in this environment
const { DragDropContext, Droppable, Draggable } = mockBeautifulDnd();

const ProjectQuestionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState(defaultQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState("https://dezignsync.app/q/ABC123XYZ");

  const handleDragEnd = (result: any) => {
    // Normally would reorder questions here
    console.log("Question reordered");
  };

  const toggleQuestion = (id: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, active: !q.active } : q))
    );
  };

  const addNewQuestion = () => {
    const newQuestion = {
      id: `q${questions.length + 1}`,
      question: "New Question",
      type: "text",
      required: false,
      active: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Simulate saving - replace with actual Supabase integration in the future
      setTimeout(() => {
        toast({
          title: "Questionnaire saved",
          description: "Your questionnaire has been configured successfully.",
        });
        navigate("/questionnaire-preview");
      }, 1500);
    } catch (error) {
      toast({
        title: "Failed to save questionnaire",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "Questionnaire link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configure Client Questionnaire</h1>
          <p className="text-gray-600">
            Customize the questions your client will answer. Our AI will adapt based on their responses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Questionnaire Setup</CardTitle>
                <CardDescription>
                  Drag and drop to reorder questions. Toggle to enable/disable them.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="questions">
                  <TabsList className="mb-6">
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="questions">
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="questions">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {questions.map((question, index) => (
                              <Draggable key={question.id} draggableId={question.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`border rounded-lg p-4 ${
                                      question.active ? "bg-white" : "bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Switch
                                          checked={question.active}
                                          onCheckedChange={() => toggleQuestion(question.id)}
                                        />
                                        <Label htmlFor={`question-${question.id}-active`}>
                                          {question.active ? "Active" : "Inactive"}
                                        </Label>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteQuestion(question.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-gray-500" />
                                      </Button>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor={`question-${question.id}`}>Question</Label>
                                        <Textarea
                                          id={`question-${question.id}`}
                                          value={question.question}
                                          onChange={(e) =>
                                            updateQuestion(
                                              question.id,
                                              "question",
                                              e.target.value
                                            )
                                          }
                                          className="mt-1"
                                        />
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id={`required-${question.id}`}
                                          checked={question.required}
                                          onCheckedChange={(checked) =>
                                            updateQuestion(question.id, "required", checked)
                                          }
                                        />
                                        <Label htmlFor={`required-${question.id}`}>
                                          Required question
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    
                    <Button
                      variant="outline"
                      className="mt-6 w-full"
                      onClick={addNewQuestion}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Question
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="welcome-message">Welcome Message</Label>
                      <Textarea
                        id="welcome-message"
                        placeholder="Enter a welcome message for your client..."
                        defaultValue="Thanks for taking the time to fill out this questionnaire. Your answers will help us create a website that perfectly matches your vision and goals."
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="completion-message">Completion Message</Label>
                      <Textarea
                        id="completion-message"
                        placeholder="Enter a message to show when the client completes the questionnaire..."
                        defaultValue="Thank you for completing the questionnaire! We'll analyze your responses and be in touch soon with the next steps."
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>AI Features</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch id="follow-up-questions" defaultChecked />
                          <Label htmlFor="follow-up-questions">
                            Enable AI follow-up questions
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="clarification" defaultChecked />
                          <Label htmlFor="clarification">
                            Ask for clarification on vague answers
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="suggestions" defaultChecked />
                          <Label htmlFor="suggestions">
                            Provide AI content suggestions
                          </Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Back
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save & Preview"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Client Link</CardTitle>
                <CardDescription>
                  Share this link with your client to have them complete the questionnaire.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Input value={shareLink} readOnly />
                  <Button size="icon" variant="outline" onClick={copyShareLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full" onClick={() => navigate("/questionnaire-preview")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>AI Enhancement</CardTitle>
                <CardDescription>
                  How our AI will work with your questionnaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Dynamic Questions</h4>
                  <p className="text-sm text-indigo-900">
                    Our AI analyzes client responses in real-time to ask relevant follow-up questions.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-700 mb-2">Clarification Requests</h4>
                  <p className="text-sm text-purple-900">
                    When clients give vague answers, AI will ask for more specific information.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Style Detection</h4>
                  <p className="text-sm text-blue-900">
                    AI analyzes language patterns to determine brand voice and design preferences.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectQuestionnaire;
