
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuestionnaireSetup from "@/components/questionnaire/QuestionnaireSetup";
import ClientLinkCard from "@/components/questionnaire/ClientLinkCard";
import AIEnhancementCard from "@/components/questionnaire/AIEnhancementCard";
import { Question } from "@/components/questionnaire/QuestionItem";

const defaultQuestions: Question[] = [
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

const ProjectQuestionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
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
            <QuestionnaireSetup
              questions={questions}
              handleDragEnd={handleDragEnd}
              toggleQuestion={toggleQuestion}
              deleteQuestion={deleteQuestion}
              updateQuestion={updateQuestion}
              addNewQuestion={addNewQuestion}
              isLoading={isLoading}
              handleSave={handleSave}
            />
          </div>
          
          <div>
            <ClientLinkCard shareLink={shareLink} />
            <AIEnhancementCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectQuestionnaire;
